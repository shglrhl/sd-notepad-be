import { Response } from "express";
import { validationResult } from "express-validator";
import { Prisma, PrismaClient } from "@prisma/client";
import { URequest } from "../types/custom";
import { validateResults } from "../utils";

const prisma = new PrismaClient();

// Create Note
export const createNote = async (req: URequest, res: Response) => {
	console.info("postCreateNote");

	// #swagger.tags = ['Notes']
	// #swagger.description = 'Create a new note'
	/* #swagger.security = [{
            "bearerAuth": []
    }] */
	/* #swagger.responses[400] = {
            description: "Data validation error",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/validationErrors"
                    }
                }           
            }
        }   
    */
	// * Validate request against the validation schema
	validateResults(req, res);

	const { title, content, tags, sharedWith } = req.body;
	const userId = req.user?.id;
	if (userId === undefined)
		return res.status(500).json({ error: "Internal server error" });

	try {
		const note = await prisma.note.create({
			data: {
				title,
				content,
				authorId: userId,
				tags,
				sharedWith: {
					connect: sharedWith?.map((id: number) => ({ id: id })),
				},
			},
		});
		/* #swagger.responses[201] = {
            description: "Note created successfully",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/newNoteResponse"
                    }
                }           
            }
        }   
    	*/
		res.status(201).json(note);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get Notes
export const getNotes = async (req: URequest, res: Response) => {
	console.info("getNotes");
	// #swagger.tags = ['Notes']
	// #swagger.description = 'Get all notes for user'
	/* #swagger.security = [{
            "bearerAuth": []
	}] */
	const userId = req.user?.id;
	if (userId === undefined)
		return res.status(500).json({ error: "Internal server error" });
	try {
		const notes = await prisma.note.findMany({
			where: {
				authorId: userId,
			},
		});

		/* #swagger.responses[200] = {
            description: "Notes retrieved successfully",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/noteArray"
                    }
                }           
            }
        }   
    	*/
		res.status(200).json(notes);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get Note by Id
export const getNoteById = async (req: URequest, res: Response) => {
	console.info("getNoteById");
	// #swagger.tags = ['Notes']
	// #swagger.description = 'Get note by id'
	/* #swagger.security = [{
            "bearerAuth": []
	}] */
	/* #swagger.responses[400] = {
            description: "Data validation error",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/validationErrors"
                    }
                }           
            }
        }   
    */
	// * Validate request against the validation schema
	validateResults(req, res);

	const noteId = parseInt(req.params.id);
	const userId = req.user?.id;
	if (userId === undefined)
		return res.status(500).json({ error: "Internal server error" });

	try {
		const note = await prisma.note.findUnique({
			where: {
				id: noteId,
			},
		});

		if (!note || note.authorId !== userId) {
			// #swagger.responses[404] = { description: 'Note not found' }
			return res.status(404).json({ error: "Note not found" });
		}
		/* #swagger.responses[200] = {
            description: "Note retrieved successfully",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/newNoteResponse"
                    }
                }           
            }
        }   
    	*/
		res.status(200).json(note);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get Shared Notes (Notes that have been shared with the user)
export const getSharedNotes = async (req: URequest, res: Response) => {
	console.info("getSharedNotes");
	// #swagger.tags = ['Notes']
	// #swagger.description = 'Get all notes shared to user'
	/* #swagger.security = [{
            "bearerAuth": []
	}] */
	const userId = req.user?.id;
	if (userId === undefined) {
		return res.status(500).json({ error: "Internal server error" });
	}

	try {
		const sharedNotes = await prisma.note.findMany({
			where: {
				sharedWith: {
					some: {
						id: userId,
					},
				},
			},
		});

		/* #swagger.responses[200] = {
            description: "Notes retrieved successfully",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/noteArray"
                    }
                }           
            }
        }   
    	*/
		res.status(200).json(sharedNotes);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const searchNotes = async (req: URequest, res: Response) => {
	console.info("searchNotes");
	// #swagger.tags = ['Notes']
	// #swagger.description = 'Search notes (title, content, tags)'
	/* #swagger.security = [{
            "bearerAuth": []
	}] */
	/* #swagger.responses[400] = {
            description: "Data validation error",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/validationErrors"
                    }
                }           
            }
        }   
    */
	// * Validate request against the validation schema
	validateResults(req, res);

	const query = typeof req.query.query === "string" ? req.query.query : "";

	try {
		const notes = await prisma.note.findMany({
			where: {
				OR: [
					{
						title: {
							contains: query,
							mode: "insensitive", // Case-insensitive
						},
					},
					{
						content: {
							contains: query,
							mode: "insensitive",
						},
					},
					{
						tags: {
							has: query,
						},
					},
				],
			},
		});

		/* #swagger.responses[200] = {
            description: "Notes retrieved successfully",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/noteArray"
                    }
                }           
            }
        }   
    	*/
		res.json(notes);
	} catch (error) {
		res.status(500).json({ message: "Error searching for notes" });
	}
};

// Update Note
export const updateNote = async (req: URequest, res: Response) => {
	console.info("updateNote");
	// #swagger.tags = ['Notes']
	// #swagger.description = 'Update note'
	/* #swagger.security = [{
            "bearerAuth": []
	}] */
	/* #swagger.responses[400] = {
            description: "Data validation error",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/validationErrors"
                    }
                }           
            }
        }   
    */
	// * Validate request against the validation schema
	validateResults(req, res);

	const noteId = parseInt(req.params.id);
	const userId = req.user?.id;
	if (userId === undefined)
		return res.status(500).json({ error: "Internal server error" });

	const { title, content, tags } = req.body;

	try {
		const note = await prisma.note.findUnique({
			where: {
				id: noteId,
			},
		});

		if (!note || note.authorId !== userId) {
			// #swagger.responses[404] = { description: 'Note not found' }
			return res.status(404).json({ error: "Note not found" });
		}

		const updatedNote = await prisma.note.update({
			where: {
				id: noteId,
				authorId: userId,
			},
			data: {
				title,
				content,
				tags,
			},
		});

		res.status(200).json(updatedNote);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Share Note with User
export const shareNote = async (req: URequest, res: Response) => {
	console.info("shareNote");
	// #swagger.tags = ['Notes']
	// #swagger.description = 'Share note to user'
	/* #swagger.security = [{
            "bearerAuth": []
	}] */
	// #swagger.responses[401] = { description: 'Unauthorized. Please log in and try again.' }

	/* #swagger.responses[400] = {
            description: "Data validation error",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/validationErrors"
                    }
                }           
            }
        }   
    */
	// * Validate request against the validation schema
	validateResults(req, res);

	const noteId = parseInt(req.params.id);
	const userId = req.user?.id;
	const sharedUserId = parseInt(req.body.sharedWith);

	if (userId === undefined) {
		return res.status(500).json({ error: "Internal server error" });
	}

	try {
		const note = await prisma.note.findUnique({
			where: {
				id: noteId,
				authorId: userId,
			},
		});

		if (!note) {
			// #swagger.responses[404] = { description: 'Note not found' }
			return res.status(404).json({ error: "Note not found" });
		}

		const sharedNote = await prisma.note.update({
			where: {
				id: noteId,
			},
			data: {
				sharedWith: {
					connect: {
						id: sharedUserId,
					},
				},
			},
		});
		res.status(200).json(sharedNote);
	} catch (error) {
		console.error(error);
		// * Handle error when the user is not found
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2003") {
				return res.status(404).json({ message: "User not found" });
			}
		}
		// * Handle other potential errors
		res.status(500).json({ message: "Error sharing the note" });
	}
};

// Delete Note
export const deleteNote = async (req: URequest, res: Response) => {
	console.info("deleteNote");
	// #swagger.tags = ['Notes']
	// #swagger.description = 'Delete note'
	/* #swagger.security = [{
            "bearerAuth": []
	}] */
	/* #swagger.responses[400] = {
            description: "Data validation error",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/validationErrors"
                    }
                }           
            }
        }   
    */
	// * Validate request against the validation schema
	validateResults(req, res);

	const noteId = parseInt(req.params.id);
	const userId = req.user?.id;
	if (userId === undefined)
		return res.status(500).json({ error: "Internal server error" });

	try {
		const note = await prisma.note.findUnique({
			where: {
				id: noteId,
				authorId: userId,
			},
		});

		if (!note) {
			// #swagger.responses[404] = { description: 'Note not found' }
			return res.status(404).json({ error: "Note not found" });
		}

		const deletedNote = await prisma.note.delete({
			where: {
				id: noteId,
				authorId: userId,
			},
		});

		res.status(200).json({ message: "Note deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
