import mongoose, { Document, Schema } from "mongoose";
// Define an interface that represents the AdminLog document
export interface IAdminLog extends Document {
  _id: mongoose.Types.ObjectId;
  description: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the AdminLog schema
const AdminLogSchema: Schema<IAdminLog> = new Schema(
  {
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

// Create the AdminLog model
const AdminLog = mongoose.model<IAdminLog>("AdminLog", AdminLogSchema);

export default AdminLog; // Use export default for exporting the model
