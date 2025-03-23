import { Response } from "express";
import { CustomRequest } from "../types/types.js";
import PathLog from "../models/PathLogModel.js";
import AdminLog from "../models/AdminLogModel.js";
import User from "../models/UserModel.js";
import AlertLog from "../models/AlertModel.js";

export const getLogs = async (req: CustomRequest, res: Response) => {
  try {
    const logs = await AdminLog.find().populate("userId");
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

export const getUserLogs = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const logs = await PathLog.find({ userId }).populate("userId");
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

export const getUserAlerts = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const alerts = await AlertLog.find({ userId }).populate("userId");
    res.status(200).json({ alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};
export const getStats = async (req: CustomRequest, res: Response) => {
  try {
    const logs = await PathLog.find().populate("userId");
    const totalUsers = await User.find().countDocuments();
    const totalAlerts = await AlertLog.find().countDocuments();
    const stats = {
      totalLogs: logs.length,
      totalUsers,
      totalActiveUsers: new Set(logs.map((log) => log.userId)).size,
      totalAlerts,
    };
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};
