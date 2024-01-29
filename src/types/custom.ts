import { Request } from "express";
import { User } from "../models/User";

export interface URequest extends Request {
	user?: User;
}
