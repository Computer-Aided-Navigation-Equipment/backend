import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/UserModel.js";
import { CustomRequest } from "../types/types.js";

// Load environment variables from a .env file
dotenv.config();

// Authentication middleware to verify if the user is authenticated based on the JWT token
const isAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the token from the Authorization header (formatted as 'Bearer token')
    const token = req.header("Authorization")?.split(" ")[1];

    // If no token is provided, respond with an authorization denied message
    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return;
    }

    // Verify the token using the JWT secret stored in the environment variables
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload; // Decode the JWT payload, asserting it as JwtPayload type
    const userId = decoded?._id;

    // If the token doesn't contain a user ID, respond with an invalid token message
    if (!userId) {
      res.status(401).json({ message: "Token is invalid" });
      return;
    }

    // Find the user in the database by their user ID
    const user = await User.findById(userId);

    // If no user is found with that ID, respond with a user not found message
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Attach the user object to the request, so that it can be accessed in subsequent route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    // If the token is expired, respond with a token expired message
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
      return; // Return immediately after sending the response
    } else {
      // For any other error (e.g., invalid token, server issues), respond with a generic server error message
      res.status(500).json({ message: "Server error" });
      return; // Return immediately after sending the response
    }
  }
};

// Export the middleware so it can be used in routes
export default isAuth;
