import express from "express";
import * as noteController from "../controllers/noteController";
import {
	newNoteValidation,
	noteIdValidation,
	searchNotesValidation,
	sharedNoteValidation,
	updateNoteValidation,
} from "../validations/noteValidations";
import { validationMiddleware } from "../middleware/validate";

const router = express.Router();

router.post(
	"/",

	newNoteValidation,
	noteController.createNote,
);

router.get("/shared", noteController.getSharedNotes);

router.get("/", noteController.getNotes);

router.get(
	"/search",
	searchNotesValidation,
	validationMiddleware,
	noteController.searchNotes,
);

router.get(
	"/:id",
	noteIdValidation,
	validationMiddleware,
	noteController.getNoteById,
);

router.put(
	"/:id",
	updateNoteValidation,
	validationMiddleware,
	noteController.updateNote,
);

router.put(
	"/:id/share",
	sharedNoteValidation,
	validationMiddleware,
	noteController.shareNote,
);

router.delete(
	"/:id",
	noteIdValidation,
	validationMiddleware,
	noteController.deleteNote,
);

export default router;
