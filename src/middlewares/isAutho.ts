import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/UserModel.js"; // Import the IUser interface to type the user object correctly
import { CustomRequest } from "../types/types.js"; // Import the CustomRequest type, which includes the user information

// This function returns a middleware that checks if the user has one of the allowed roles
const isAutho = (allowedRoles: Array<IUser["userType"]>) => {
  // The returned middleware will have access to req, res, and next parameters
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    // Extract the user from the request (it should have been attached by the isAuth middleware)
    const user = req.user as IUser;

    // Check if the user exists and if their role is included in the allowedRoles array
    if (user && allowedRoles.includes(user.userType)) {
      // If the user has the right role, allow access to the next middleware or route handler
      next();
    } else {
      // If the user doesn't have the required role, deny access and respond with a 403 Forbidden status
      res.status(403).json({
        message: "Access forbidden - Insufficient privileges",
      });
    }
  };
};

export default isAutho;
