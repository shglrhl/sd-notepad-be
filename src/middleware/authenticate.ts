import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { URequest } from "../types/custom";
import { User } from "../models/User";

const authenticateMiddleware = (
	req: URequest,
	res: Response,
	next: NextFunction,
) => {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret)
		return res.status(500).json({ error: "Internal server error" });

	const token = req.headers.authorization?.split(" ")[1];

	if (!token) return res.status(401).json({ error: "Unauthorized" });

	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.user = decoded as User;
		next();
	} catch (error) {
		return res.status(401).json({ error: "Unauthorized" });
	}
};

export default authenticateMiddleware;
