import express from "express";
import cors from "cors";

import errorHandler from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
