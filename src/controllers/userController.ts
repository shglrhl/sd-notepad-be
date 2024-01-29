import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { validateResults } from "../utils";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
	console.info("postRegister");
	// #swagger.tags = ['Users']
	// #swagger.description = 'Register User'

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

	const { email, password } = req.body;
	const trimmedEmail = email.trim(); // * Remove whitespace from email

	try {
		// * Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: {
				email: trimmedEmail,
			},
		});
		if (existingUser) {
			/* #swagger.responses[409] = {
            	description: "User already exists",
			}   
			*/
			return res.status(409).json({ error: "User already exists" });
		}

		// * Hash the password & create user
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email: trimmedEmail,
				password: hashedPassword,
			},
		});
		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const login = async (req: Request, res: Response) => {
	console.info("postLogin");
	// #swagger.tags = ['Users']
	// #swagger.description = 'Login User'

	if (!jwtSecret)
		return res.status(500).json({ error: "Internal server error" });

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

	const { email, password } = req.body;

	try {
		// * Check if user exists
		const user = await prisma.user.findUnique({
			where: {
				email: email.trim(),
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

		const payload: User = {
			id: user.id,
			email: user.email,
		};
		// * Create JWT token
		const token = jwt.sign(payload, jwtSecret, {
			expiresIn: "1h",
		});
		/* #swagger.responses[200] = {
            description: "Successful login",
            content: {
                "application/json": {
                    schema:{
							$ref: "#/components/schemas/loginResponse"
                    }
                }           
            }
        }   
    	*/
		res.status(200).json({ token: token });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};
