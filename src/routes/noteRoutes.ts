import express from "express";
import * as noteController from "../controllers/noteController";
import {
	newNoteValidation,
	noteIdValidation,
	searchNotesValidation,
	sharedNoteValidation,
	updateNoteValidation,
} from "../validations/noteValidations";

const router = express.Router();

router.post(
	"/",

	newNoteValidation,
	noteController.createNote,
);

router.get("/shared", noteController.getSharedNotes);

router.get("/", noteController.getNotes);

router.get("/search", searchNotesValidation, noteController.searchNotes);

router.get("/:id", noteIdValidation, noteController.getNoteById);

router.put("/:id", updateNoteValidation, noteController.updateNote);

router.put("/:id/share", sharedNoteValidation, noteController.shareNote);

router.delete("/:id", noteIdValidation, noteController.deleteNote);

export default router;
