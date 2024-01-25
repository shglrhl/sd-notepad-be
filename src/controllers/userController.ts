import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Prisma, PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
	// * Validate request against the validation schema
	const error = validationResult(req);
	if (!error.isEmpty()) {
		// * If there are errors, return them all
		return res.status(400).json({ error: error.array() });
	}

	const { email, password } = req.body;

	try {
		// * Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (existingUser) {
			return res.status(409).json({ error: "User already exists" });
		}

		// * Hash the password & create user
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email: email,
				password: hashedPassword,
			},
		});
		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const login = async (req: Request, res: Response) => {
	if (!jwtSecret)
		return res.status(500).json({ error: "Internal server error" });

	// * Validate request against the validation schema
	const error = validationResult(req);
	if (!error.isEmpty()) {
		// * If there are errors, return them all
		return res.status(400).json({ error: error.array() });
	}

	const { email, password } = req.body;

	try {
		// * Check if user exists
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (!user) {
			return res.status(401).json({
				error: "Incorrect email or password. Please check them and try again.",
			});
		}

		// * Check if password is correct
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(401).json({
				error: "Incorrect email or password. Please check them and try again.",
			});
		}

		// * Create JWT token
		const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
			expiresIn: "1h",
		});
		res.status(200).json({ token: token });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};
