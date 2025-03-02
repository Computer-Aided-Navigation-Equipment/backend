import mongoose, { Document, Schema } from "mongoose";
import { AttachmentSchema, IAttachment } from "./AttachementModel.js";

// Define an interface that represents the Location document
export interface ILocation extends Document {
  _id: mongoose.Types.ObjectId;
<<<<<<< HEAD
  id: string;
  title: string;
=======
>>>>>>> f4d506c (add initial backend structure with models, routes, and middleware for user and location management)
  location: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Location schema
const LocationSchema: Schema<ILocation> = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
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

// Create the Location model
const Location = mongoose.model<ILocation>("Location", LocationSchema);

export default Location; // Use export default for exporting the model
