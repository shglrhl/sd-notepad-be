import express from "express";
import {
	loginValidations,
	registerValidations,
} from "../validations/userValidations";
import * as UserController from "../controllers/userController";

const router = express.Router();

router.post("/register", registerValidations, UserController.register);
router.post("/login", loginValidations, UserController.login);

export default router;
