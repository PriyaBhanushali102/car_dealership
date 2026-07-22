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
});

describe("POST /api/auth/login", () => {
  it("should login user successfully with valid credentials", async () => {
    const user = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "test1234",
      role: "user",
    };

    // First create user
    await request(app).post("/api/auth/register").send(user);

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
