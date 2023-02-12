const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");
require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.disconnect(); // Disconnecting from the database before each test.
  await mongoose.connect(process.env.MONGO_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

/* Testing the base GET / route. */
describe("GET /", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("welcome to stream-auth");
  });
});

/* Testing the POST /users/<userId>/register-device route. */
describe("POST /users/<userId>/register-device", () => {
  it("should return 200", async () => {
    const res = await request(app)
      .post("/users/1/register-device")
      .send({ deviceId: "1234567890" });
    expect(res.status).toBe(200);
    expect(res.body.deviceId).toBe("1234567890");
    expect(res.body.isActive).toBe(true);
  });
});

/* Testing the POST /users/<userId>/unregister-device route. */
describe("POST /users/<userId>/unregister-device", () => {
  it("should return 200", async () => {
    const res = await request(app)
      .post("/users/1/unregister-device")
      .send({ deviceId: "1234567890" });
    expect(res.status).toBe(200);
    expect(res.body.deviceId).toBe("1234567890");
    expect(res.body.isActive).toBe(false);
  });
});

/* Testing the POST /users/<userId>/unregister-all-devices route. */
describe("POST /users/<userId>/unregister-all-devices", () => {
  it("should return 200", async () => {
    const res = await request(app).post("/users/1/unregister-all-devices");
    expect(res.status).toBe(200);
    expect(res.body.acknowledged).toBe(true);
  });
});

/* Testing the GET /users/<userId>/<deviceId> route. */
describe("GET /users/<userId>/<deviceId>", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/users/1/1234567890");
    expect(res.status).toBe(200);
    expect(res.body.deviceId).toBe("1234567890");
    expect(res.body.isActive).toBe(false);
  });
});
