import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Vehicle API", () => {
  it("should create a vehicle", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 1200000,
        quantity: 5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should get all vehicles", async () => {
    await request(app).post("/api/vehicles").send({
      make: "Toyota",
      model: "Corolla",
      category: "Sedan",
      price: 1000000,
      quantity: 2,
    });

    const res = await request(app).get("/api/vehicles");


    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toMatchObject({
      make: expect.any(String),
      model: expect.any(String),
      category: expect.any(String),
      price: expect.any(Number),
      quantity: expect.any(Number),
    })
  })
});


