import swaggerAutogen from "swagger-autogen";

import type { User } from "@prisma/client"; // Import the User type

const doc = {
	info: {
		title: "My API",
		description: "API Documentation",
	},
	host: "localhost:3000",
	schemes: ["http"],
	consumes: ["application/json"],
	produces: ["application/json"],
	components: {
		schemas: {
			loginResponse: {
				$token: "testToken123",
			},
			userCredentials: {
				$email: "testemail@gmail.com",
				$password: "testpassword",
			},
			newNote: {
				$title: "New Note Title",
				$content: "Content of my new note",
				tags: ["tag1", "tag2"],
				sharedWith: [1, 2, 3], //User Ids of users to share note with
			},
			newNoteResponse: {
				id: 7,
				title: "New Note Title",
				content: "Content of my new note",
				tags: ["tag1", "tag2"],
				createdAt: "2024-01-29T16:56:48.708Z",
				updatedAt: "2024-01-29T16:56:48.708Z",
				authorId: 1,
			},
			noteArray: [
				{
					id: 7,
					title: "New Note Title",
					content: "Content of my new note",
					tags: ["tag1", "tag2"],
					createdAt: "2024-01-29T16:56:48.708Z",
					updatedAt: "2024-01-29T16:56:48.708Z",
					authorId: 1,
				},
			],
			updateNote: {
				$title: "Updated Note Title",
				$content: "Content of my updated note",
				tags: ["tag1", "tag2"],
			},
			shareNote: {
				sharedWith: [1, 2], //User Ids of users to share note with
			},
			noteId: 1,
			validationErrors: [
				{
					type: "field",
					value: "testd",
					msg: "Password must be at least 6 characters long",
					path: "password",
					location: "body",
				},
			],
		},
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
	},
};

const outputFile = "./swagger_output.json"; // Swagger JSON output file
const endpointsFiles = ["./src/app.ts"]; // Path to the file that contains your routes

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
