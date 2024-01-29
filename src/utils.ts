import { validationResult } from "express-validator";
import { Request, Response } from "express";

export function validateResults(req: Request, res: Response) {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		// * If there are errors, return them all

		return res.status(400).json({ error: error.array() });
	}
}
