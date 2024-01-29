import express from "express";
import {
	loginValidations,
	registerValidations,
} from "../validations/userValidations";
import * as UserController from "../controllers/userController";
import { validationMiddleware } from "../middleware/validate";

const router = express.Router();

router.post(
	"/register",
	registerValidations,
	validationMiddleware,
	UserController.register,
);

router.post(
	"/login",
	loginValidations,
	validationMiddleware,
	UserController.login,
);

export default router;
