import mongoose, { Document, Schema } from "mongoose";
// Define an interface that represents the AlertLog document
export interface IAlertLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the AlertLog schema
const AlertLogSchema: Schema<IAlertLog> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the AlertLog model
const AlertLog = mongoose.model<IAlertLog>("AlertLog", AlertLogSchema);

export default AlertLog; // Use export default for exporting the model
