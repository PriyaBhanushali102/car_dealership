import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "test1234",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it("should not allow duplicate email", async () => {
    const email = `duplicate${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      name: "User One",
      email,
      password: "123456",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "User Two",
      email,
      password: "123456",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should login an existing user", async () => {
    const email = `login${Date.now()}@example.com`;

    // Register user first
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email,
      password: "123456",
    });

    // Login
    const response = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("token");

    expect(response.body.user.email).toBe(user.email);
  });
});
