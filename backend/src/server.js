import express from "express";
import { randomUUID } from "node:crypto";
import errorHandler from "./middleware/errorHandler.js";
import authenticate from "./middleware/authenticate.js";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json({ limit: "10kb" }));
app.use(cors());        
app.use('/api/tasks', authenticate, taskRoutes);
app.use('/api/auth', authRoutes);

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
app.use(logger);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


mongoose.connect(process.env.MONGO_URI, {  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exitCode = 1;
  });


app.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Task API: http://127.0.0.1:${process.env.PORT}`);
});
app.use(errorHandler);