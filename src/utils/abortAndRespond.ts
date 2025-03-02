import { Response } from "express";
import mongoose from "mongoose";

export const abortAndRespond = async (
  session: mongoose.ClientSession,
  res: Response,
  message: string,
  statusCode = 400
) => {
  await session.abortTransaction();
  session.endSession();
  res.status(statusCode).json({ message });
};
