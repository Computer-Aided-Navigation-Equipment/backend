import mongoose, { Document, Schema } from "mongoose";

// Define an interface that represents the User document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  password: string;
  userType: "user" | "caregiver" | "admin" | "superadmin";
  createdAt: Date;
  updatedAt: Date;

  googleId?: string;
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      required: true,
      default: "user",
    },

    // google
    googleId: { type: String },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model<IUser>("User", UserSchema);

export default User; // Use export default for exporting the model
