import { body } from "express-validator";

export const registerValidations = [
	/*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/userCredentials"
                    }  
                }
            }
        } 
    */
	body("email")
		.trim()
		.isEmail()
		.withMessage("Invalid email address"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
	// TODO Add more complex password requirements
];

export const loginValidations = [
	/*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/userCredentials"
                    }  
                }
            }
        } 
    */
	body("email")
		.isEmail()
		.withMessage("Invalid email address"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
];
