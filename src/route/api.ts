import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { UserController } from "../controller/user-controller.js";

export const apiRouter: Router = express.Router();
apiRouter.use(authMiddleware);

// User API
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
