import mongoose, { Document, Schema } from "mongoose";

// Define an interface that represents the Counter document
export interface ICounter extends Document {
  id: string;
  seq: number;
}

// Define the Counter schema
const CounterSchema: Schema<ICounter> = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the Counter model
const Counter = mongoose.model<ICounter>("Counter", CounterSchema);

export default Counter; // Use export default for exporting the model
