import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/UserModel.js"; // Adjust path as needed
import { CustomRequest } from "../types/types.js";

const isAutho = (allowedRoles: Array<IUser["userType"]>) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user as IUser;

    if (user && allowedRoles.includes(user.userType)) {
      next();
    } else {
      res.status(403).json({
        message: "Access forbidden - Insufficient privileges",
      });
    }
  };
};

export default isAutho;
