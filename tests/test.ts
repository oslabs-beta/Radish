const fs = require("fs");
const path = require("path");
const request = require("supertest");

const server = "http://localhost:8080";

describe("api endpoints tests", () => {
  describe("GET /api/users/user", () => {
    it("should return a 401 status code with no token", async () => {
      const response = await request(server).get("/api/users/user");
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/users/login", () => {
    it("should return an error with invalid username", async () => {
      const response = await request(server)
        .post("/api/users/login")
        .send({ email: "notRealUser", password: "notRealPassword" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "User not found" });
    });

    it("should return an error with invalid password", async () => {
      const response = await request(server)
        .post("/api/users/login")
        .send({ email: "chillkid32@gmail.com", password: "notRealPassword" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid credentials" });
    });

    it("should return a token with valid credentials", async () => {
      const response = await request(server)
        .post("/api/users/login")
        .send({ email: "chillkid32@gmail.com", password: "12345" });
      expect(response.status).toBe(200);
      expect(response.body.token !== undefined).toBe(true);
      expect(Array.isArray(response.body.ips)).toBe(true);
      expect(response.body.ips.length).toBe(3);
    });
  });
});
