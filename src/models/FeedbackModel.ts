import mongoose, { Document, Schema } from "mongoose";
import { AttachmentSchema, IAttachment } from "./AttachementModel.js";

// Define an interface that represents the Feedback document
export interface IFeedback extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  thoughts: string;
  issues: string;
  issuesDescription: string;
  suggestions: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Feedback schema
const FeedbackSchema: Schema<IFeedback> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    thoughts: {
      type: String,
    },
    issues: {
      type: String,
    },
    issuesDescription: {
      type: String,
    },
    suggestions: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create the Feedback model
const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback; // Use export default for exporting the model
