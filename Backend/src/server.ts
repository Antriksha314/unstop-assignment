import express, { Application } from "express";
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv";
import { seatRouter } from "./models/route";

// Load environment variables from .env file
dotenv.config();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const app: Application = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Routes
app.use("/api/seat", seatRouter);

// Disable strict query mode in Mongoose
mongoose.set('strictQuery', false);

// Start the server
app.listen(PORT, async () => {
  try {
    // Attempt to connect to the database
    await mongoose.connect(process.env.mongoURL as string);;
    console.log("Connected to the database");
  } catch (error) {
    // Log any errors that occur during the connection
    console.error("Database connection failed:", error);
  }
  // Log the server start message
  console.log(`Server running on port ${PORT}`);
});
