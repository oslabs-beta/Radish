const fs = require("fs");
const path = require("path");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const User = require("../server/models/User.js");
const app = require("../server/server.ts");

const server = "http://localhost:8080";

describe("api endpoints tests", () => {
  describe("GET /api/users/user", () => {
    it("should return a 401 status code with no token", async () => {
      const response = await request(app).get("/api/users/user");
      expect(response.status).toBe(401);
    });
  });

  // describe("POST /api/users/login", () => {
  //   it("should return an error with invalid username", async () => {
  //     const response = await request(server)
  //       .post("/api/users/login")
  //       .send({ email: "notRealUser", password: "notRealPassword" });
  //     expect(response.status).toBe(401);
  //     expect(response.body).toEqual({ error: "User not found" });
  //   });

  //   it("should return an error with invalid password", async () => {
  //     const response = await request(server)
  //       .post("/api/users/login")
  //       .send({ email: "chillkid32@gmail.com", password: "notRealPassword" });
  //     expect(response.status).toBe(401);
  //     expect(response.body).toEqual({ error: "Invalid credentials" });
  //   });

  //   it("should return a token with valid credentials", async () => {
  //     const response = await request(server)
  //       .post("/api/users/login")
  //       .send({ email: "chillkid32@gmail.com", password: "12345" });
  //     expect(response.status).toBe(200);
  //     expect(response.body.token !== undefined).toBe(true);
  //     expect(Array.isArray(response.body.ips)).toBe(true);
  //     expect(response.body.ips.length).toBe(3);
  //   });
  // });

  // describe("GET /api/users/logout", () => {
  //   it("should return logout message", async () => {
  //     const response = await request(server).get("/api/users/logout");
  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual({ message: "Logged out" });
  //   });
  // });

  // describe("POST /api/launchEC2", () => {
  //   it("should return a 401 status code with no token", async () => {
  //     const response = await request(server).post("/api/launchEC2");
  //     expect(response.status).toBe(401);
  //     expect(response.body).toEqual("Not Authorized");
  //   });

  //   it("should give an error in security group if no aws parameters gvien", async () => {
  //     const user = await User.findOne({ email: "tdjerg@gmail.com" });
  //     console.log("User: ", User.findOne);
  //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  //     const response = await request(server)
  //       .post("/api/launchEC2")
  //       .set("Cookie", `authToken=${"toekn"}`);
  //     expect(response.status).toBe(400);
  //     // expect(user).not.toBe(null);
  //   }, 10000);
  // });
});
