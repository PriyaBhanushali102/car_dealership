import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = [
      {
        name: "Admin User",
        email: "admin@test.com",
        password: "admin1234",
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@test.com",
        password: "john1234",
        role: "user",
      },
      {
        name: "Alice Smith",
        email: "alice@test.com",
        password: "alice1234",
        role: "user",
      },
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({
        email: userData.email,
      });

      if (!existingUser) {
        await User.create(userData);
        console.log(`Created: ${userData.email}`);
      } else {
        console.log(`Already Exists: ${userData.email}`);
      }
    }
    console.log("Seeding Completed");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
