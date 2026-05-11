import express, { Router } from "express";
import { UserController } from "../controller/user-controller.js";

export const publicRouter: Router = express.Router();
publicRouter.post("/api/users", UserController.register);
publicRouter.post("/api/users/login", UserController.login);
