import { Response } from "express";
import { CustomRequest } from "../types/types.js";
import PathLog from "../models/PathLogModel.js";
import AlertLog from "../models/AlertModel.js";

export const createPathLog = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;

    const pathLog = new PathLog({
      userId: user._id,
      ...req.body,
    });
    await pathLog.save();
    res.status(201).json({
      message: "Log created successfully",
      pathLog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

export const createAlertLog = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;

    const alert = new AlertLog({
      userId: user._id,
      ...req.body,
    });
    await alert.save();
    res.status(201).json({
      message: "Log created successfully",
      alert,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};
