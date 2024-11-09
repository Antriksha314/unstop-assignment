import mongoose, { Document, Schema } from "mongoose";

// Define an interface representing a document in MongoDB.
interface ISeat extends Document {
  seatNumber: string;
  status: string;
  id: number;
}

// Define the schema for a seat
const seatSchema: Schema = new Schema({
  seatNumber: { type: String, required: true },
  status: { type: String, default: "available" },
  id: { type: Number, required: true }
});

// Create a model from the schema
const SeatModel = mongoose.model<ISeat>("Seat", seatSchema);

// Export the model for use in other parts of the application
export { SeatModel };
