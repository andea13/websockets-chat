import express from "express";
import { test, registerUser } from "../controllers/registrationControllers.js";

export const registrationRouter = express.Router();

registrationRouter.get("/test", test);

registrationRouter.post("/register", registerUser);
