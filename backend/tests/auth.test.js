import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Uesr",
      email: "test@example.com",
      password: "test1234",
    });
    expect(res.statusCode).toBe(201);
  });
});
