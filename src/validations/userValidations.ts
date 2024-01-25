import { body } from "express-validator";

export const registerValidations = [
	body("email").isEmail().withMessage("Invalid email address"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
	// TODO Add more complex password requirements
];

export const loginValidations = [
	body("email").isEmail().withMessage("Invalid email address"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
];
