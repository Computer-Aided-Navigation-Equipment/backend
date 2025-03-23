import mongoose, { Document, Schema } from "mongoose";
// Define an interface that represents the PathLog document
export interface IPathLog extends Document {
  _id: mongoose.Types.ObjectId;
  type: "PathLog" | "AuthLog" | "AlertLog";
  miles: number;
  numberOfObsticles: number;
  numberOfSteps: number;
  location: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the PathLog schema
const PathLogSchema: Schema<IPathLog> = new Schema(
  {
    type: {
      type: String,
      required: true,
      default: "PathLog",
    },
    numberOfObsticles: {
      type: Number,
    },
    numberOfSteps: {
      type: Number,
    },
    miles: {
      type: Number,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Create the PathLog model
const PathLog = mongoose.model<IPathLog>("PathLog", PathLogSchema);

export default PathLog; // Use export default for exporting the model
