// Importing necessary modules and models
import { Response } from "express";
import { CustomRequest } from "../types/types.js";
import PathLog from "../models/PathLogModel.js";
import AdminLog from "../models/AdminLogModel.js";
import User from "../models/UserModel.js";
import AlertLog from "../models/AlertModel.js";

// Controller to get all admin logs and populate user data associated with each log
export const getLogs = async (req: CustomRequest, res: Response) => {
  try {
    // Fetching all admin logs and populating userId field with user data
    const logs = await AdminLog.find().populate("userId");
    
    // Responding with the fetched logs
    res.status(200).json({ logs });
  } catch (error) {
    // Handling errors by sending a 500 status and the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller to get logs specific to a user by userId
export const getUserLogs = async (req: CustomRequest, res: Response) => {
  try {
    // Extracting userId from the request parameters
    const { userId } = req.params;
    
    // Fetching the path logs of the user and populating userId field
    const logs = await PathLog.find({ userId }).populate("userId");
    
    // Responding with the fetched user logs
    res.status(200).json({ logs });
  } catch (error) {
    // Handling errors by sending a 500 status and the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller to get alert logs specific to a user by userId
export const getUserAlerts = async (req: CustomRequest, res: Response) => {
  try {
    // Extracting userId from the request parameters
    const { userId } = req.params;
    
    // Fetching the alert logs for the user and populating userId field
    const alerts = await AlertLog.find({ userId }).populate("userId");
    
    // Responding with the fetched alert logs
    res.status(200).json({ alerts });
  } catch (error) {
    // Handling errors by sending a 500 status and the error message
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller to get system statistics like total logs, users, and alerts
export const getStats = async (req: CustomRequest, res: Response) => {
  try {
    // Fetching all path logs and populating userId field
    const logs = await PathLog.find().populate("userId");
    
    // Fetching total number of users and alert logs
    const totalUsers = await User.find().countDocuments();
    const totalAlerts = await AlertLog.find().countDocuments();
    
    // Calculating stats based on fetched data
    const stats = {
      totalLogs: logs.length, // Total logs count
      totalUsers, // Total users count
      totalActiveUsers: new Set(logs.map((log) => log.userId)).size, // Count of unique active users
      totalAlerts, // Total alert logs count
    };
    
    // Responding with the system statistics
    res.status(200).json({ stats });
  } catch (error) {
    // Handling errors by sending a 500 status and the error message
    res.status(500).json({ message: error.message });
    return;
  }
};
