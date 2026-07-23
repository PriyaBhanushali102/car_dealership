import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";

let userToken;
let adminToken;

const uniqueModel = (name) =>
  `${name}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const stamp = Date.now();

  // Normal User
  const userEmail = `user${stamp}@example.com`;

  const userRes = await request(app).post("/api/auth/register").send({
    name: "Normal User",
    email: userEmail,
    password: "123456",
  });

  userToken = userRes.body.token;

  // Admin User
  const adminEmail = `admin${stamp}@example.com`;

  await request(app).post("/api/auth/register").send({
    name: "Admin User",
    email: adminEmail,
    password: "123456",
  });

  await User.findOneAndUpdate({ email: adminEmail }, { role: "admin" });

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: adminEmail,
    password: "123456",
  });

  adminToken = adminLogin.body.token;

  expect(userToken).toBeDefined();
  expect(adminToken).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Vehicle API", () => {
  // create vehicle test
  it("should return 401 when creating vehicle without token", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({
        make: "Honda",
        model: uniqueModel("City"),
        category: "Sedan",
        price: 1200000,
        quantity: 5,
      });

    expect(res.statusCode).toBe(401);
  });

  it("should create a vehicle", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Honda",
        model: uniqueModel("City"),
        category: "Sedan",
        price: 1200000,
        quantity: 5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // get all vehicles test
  it("should get all vehicles", async () => {
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Toyota",
        model: uniqueModel("Corolla"),
        category: "Sedan",
        price: 1000000,
        quantity: 2,
      });

    const res = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // update test
  it("should update a vehicle", async () => {
    const model = uniqueModel("Focus");

    const created = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Ford",
        model,
        category: "Hatchback",
        price: 800000,
        quantity: 4,
      });

    expect(created.statusCode).toBe(201);
    const id = created.body.data._id;

    const res = await request(app)
      .patch(`/api/vehicles/${id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Ford",
        model,
        category: "Hatchback",
        price: 750000,
        quantity: 6,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.price).toBe(750000);
    expect(res.body.data.quantity).toBe(6);
  });

  it("should return 404 when updating non-existent vehicle", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/vehicles/${fakeId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        price: 1000,
      });

    expect(res.statusCode).toBe(404);
  });

  // delete test
  it("should delete a vehicle as admin", async () => {
    const created = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        make: "Audi",
        model: uniqueModel("A4"),
        category: "Sedan",
        price: 4000000,
        quantity: 2,
      });

    const id = created.body.data._id;

    const res = await request(app)
      .delete(`/api/vehicles/${id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 when deleting non-existent vehicle", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/vehicles/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // search test
  it("should search vehicles by make/model/category", async () => {
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Toyota",
        model: uniqueModel("Corolla"),
        category: "Sedan",
        price: 1500000,
        quantity: 3,
      });

    const res = await request(app)
      .get("/api/vehicles/search?make=Toyota")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].make).toBe("Toyota");
  });

  it("should return empty array when no vehicles found", async () => {
    const res = await request(app)
      .get("/api/vehicles/search?make=Ferrari")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  // purchase test
  it("should purchase vehicle and decrease quantity", async () => {
    const created = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Honda",
        model: uniqueModel("Civic"),
        category: "Sedan",
        price: 1100000,
        quantity: 5,
      });

    const id = created.body.data._id;

    const res = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quantity).toBe(4);
  });

  it("should return 400 when quantity is 0", async () => {
    const created = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Honda",
        model: uniqueModel("Jazz"),
        category: "Hatchback",
        price: 900000,
        quantity: 0,
      });

    const id = created.body.data._id;

    const res = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 when vehicle not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/vehicles/${fakeId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // restock (admin) test
  it("should restock vehicle as admin", async () => {
    const created = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Toyota",
        model: uniqueModel("Innova"),
        category: "SUV",
        price: 2000000,
        quantity: 2,
      });

    const id = created.body.data._id;

    const res = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quantity).toBe(5);
  });

  it("should return 403 for non-admin user", async () => {
    const created = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Toyota",
        model: uniqueModel("Fortuner"),
        category: "SUV",
        price: 3500000,
        quantity: 1,
      });

    const id = created.body.data._id;

    const res = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 when vehicle not found on restock", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/vehicles/${fakeId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
