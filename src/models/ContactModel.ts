import mongoose, { Document, Schema } from "mongoose";
import { AttachmentSchema, IAttachment } from "./AttachementModel.js";

// Define an interface that represents the Contact document
export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  contactId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Contact schema
const ContactSchema: Schema<IContact> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Create the Contact model
const Contact = mongoose.model<IContact>("Contact", ContactSchema);

export default Contact; // Use export default for exporting the model
