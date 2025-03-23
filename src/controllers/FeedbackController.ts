import { Response } from "express";
import Feedback from "../models/FeedbackModel.js";
import { CustomRequest } from "../types/types.js";

export const createFeedback = async (req: CustomRequest, res: Response) => {
  try {
    const { user } = req;
    const feedback = new Feedback({
      userId: user._id,
      ...req.body,
    });
    await feedback.save();
    res.status(201).json({
      message: "Feedback created successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

export const getAllFeedbacks = async (req: CustomRequest, res: Response) => {
  try {
    const feedbacks = await Feedback.find().populate("userId");
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};
