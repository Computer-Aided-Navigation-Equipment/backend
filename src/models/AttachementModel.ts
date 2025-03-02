import mongoose, { Document, Schema } from "mongoose";

export interface IAttachment {
  _id?: string;
  url: string;
  key: string;
  mimeType: string;
}
export const AttachmentSchema: Schema<IAttachment> = new Schema({
  url: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
});
