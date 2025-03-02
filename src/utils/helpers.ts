import mongoose from "mongoose";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/multerConfiguration.js";

export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const generatePresignedUrl = async (key: string) => {
  try {
    const getObjectParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(getObjectParams);
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
};
