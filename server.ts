import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import userRouter from './modular/user/user.route';
import eventRouter from './modular/event/event.route';

// Load environment variables before anything else
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000',],
   credentials: true,
}));
app.use(express.json());

// Environment variables
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || '';
app.use("/api", userRouter);
app.use("/api", eventRouter)
// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Start server only after DB is connected
    server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
}).on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
    process.exit(1);
  } else {
    throw err;
  }
});// Optional: Exit on DB failure
  });

