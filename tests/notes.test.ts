import request from "supertest";
import app from "../src/app"; // Adjust the import path to your Express app

let token: string;
let noteId: number;

describe("User Authentication", () => {
	it("should authenticate user and return JWT token", async () => {
		const res = await request(app)
			.post("/api/users/login")
			.send({ email: "testemail@gmail.com", password: "testpassword" });

		expect(res.status).toBe(200);
		token = res.body.token; // Store the token for later use
	});
});

describe("POST /notes", () => {
	it("should create a new note", async () => {
		const noteData = { title: "Test Note", content: "This is a test note" };
		const res = await request(app)
			.post("/api/notes")
			.set("Authorization", `Bearer ${token}`) // Set the JWT token in the header
			.send(noteData);

		expect(res.status).toBe(201); // Assuming 201 for created resource
		expect(res.body.title).toBe(noteData.title);
		noteId = res.body.id; // Store the ID for later use
		console.log("noteId:", noteId);
	});
});

describe("GET /notes", () => {
	it("should retrieve all notes", async () => {
		const res = await request(app)
			.get("/api/notes")
			.set("Authorization", `Bearer ${token}`); // Set the JWT token in the header
		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
	});
});

describe("GET /notes/:id", () => {
	it("should retrieve a specific note", async () => {
		const res = await request(app)
			.get(`/api/notes/${noteId}`)
			.set("Authorization", `Bearer ${token}`); // Set the JWT token in the header
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("id", noteId);
	});
});

describe("PUT /notes/:id", () => {
	it("should update the note", async () => {
		const updatedData = { title: "Updated Test Note", content: "" };
		const res = await request(app)
			.put(`/api/notes/${noteId}`)
			.set("Authorization", `Bearer ${token}`) // Set the JWT token in the header
			.send(updatedData);
		expect(res.status).toBe(200); // Or another appropriate status code
		expect(res.body.title).toBe(updatedData.title);
	});
});

describe("Sharing a Note", () => {
	it("should share a note with another user", async () => {
		const res = await request(app)
			.put(`/notes/${noteId}/share`) // Using template literal for dynamic noteId
			.set("Authorization", `Bearer ${token}`)
			.send({ userId: 2 }); // Adjust with the ID of the user to share the note with

		// Check if the status is either 200 or 409
		expect([200, 409]).toContain(res.status);
	});

	// Additional tests for other scenarios...
});

describe("DELETE /notes/:id", () => {
	it("should delete the note", async () => {
		const res = await request(app)
			.delete(`/api/notes/${noteId}`)
			.set("Authorization", `Bearer ${token}`); // Set the JWT token in the header
		expect(res.status).toBe(200);
	});
});
