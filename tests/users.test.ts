import request from "supertest";
import app from "../src/app"; // Adjust the import path to your Express app

describe("POST /users/register", () => {
	it("should register a new user", async () => {
		const userData = { email: "testemail@gmail.com", password: "testpassword" };
		const res = await request(app).post("/api/users/register").send(userData);
		expect([200, 409]).toContain(res.status); // * 200 for success, 409 for user already exists
	});
});

describe("POST /users/register", () => {
	it("should register a 2nd user to test sharing later", async () => {
		const userData = {
			email: "testemail2@gmail.com",
			password: "testpassword",
		};
		const res = await request(app).post("/api/users/register").send(userData);
		expect([200, 409]).toContain(res.status); // * 200 for success, 409 for user already exists
	});
});

describe("POST /users/login", () => {
	it("should login the user and return a JWT token", async () => {
		const userData = { email: "testemail@gmail.com", password: "testpassword" };
		const res = await request(app).post("/api/users/login").send(userData);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("token");
	});
});
