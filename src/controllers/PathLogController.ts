import { Response } from "express";
import { CustomRequest } from "../types/types.js";
import PathLog from "../models/PathLogModel.js";

export const createPathLog = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;

    const contact = new PathLog({
      userId: user._id,
      ...req.body,
    });
    await contact.save();
    res.status(201).json({
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};
