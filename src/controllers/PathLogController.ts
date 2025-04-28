// Importing necessary modules and models
import { Response } from "express";
import { CustomRequest } from "../types/types.js";
import PathLog from "../models/PathLogModel.js";
import AlertLog from "../models/AlertModel.js";

// Controller to create a new path log entry
export const createPathLog = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req; // Getting user data from the request

    // Creating a new PathLog document with the user ID and the data from the request body
    const pathLog = new PathLog({
      userId: user._id, // Associating the log with the current user
      ...req.body, // Spreading the rest of the request body properties to the log
    });

    // Saving the path log to the database
    await pathLog.save();

    // Responding with a success message and the created path log data
    res.status(201).json({
      message: "Log created successfully",
      pathLog,
    });
  } catch (error) {
    // Handling errors by sending a 500 status and the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller to create a new alert log entry
export const createAlertLog = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req; // Getting user data from the request

    // Creating a new AlertLog document with the user ID and the data from the request body
    const alert = new AlertLog({
      userId: user._id, // Associating the alert with the current user
      ...req.body, // Spreading the rest of the request body properties to the alert log
    });

    // Saving the alert log to the database
    await alert.save();

    // Responding with a success message and the created alert log data
    res.status(201).json({
      message: "Log created successfully",
      alert,
    });
  } catch (error) {
    // Handling errors by sending a 500 status and the error message
    res.status(500).json({ message: error.message });
    return;
  }
};
