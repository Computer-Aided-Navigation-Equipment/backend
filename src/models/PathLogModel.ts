import mongoose, { Document, Schema } from "mongoose";
// Define an interface that represents the PathLog document
export interface IPathLog extends Document {
  _id: mongoose.Types.ObjectId;
  miles: number;
  numberOfObsticles: number;
  numberOfSteps: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the PathLog schema
const PathLogSchema: Schema<IPathLog> = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    numberOfObsticles: {
      type: Number,
      required: true,
    },
    numberOfSteps: {
      type: Number,
      required: true,
    },
    miles: {
      type: Number,
      required: true,
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
