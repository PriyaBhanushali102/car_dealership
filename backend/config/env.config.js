import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  CORS: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
};

export const JWT_SECRET =
  process.env.JWT_SECRET || "default_secret_dont_use_prod";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1d";
