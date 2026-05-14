import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { UserController } from "../controller/user-controller.js";
import { ContactController } from "../controller/contact-controller.js";

export const apiRouter: Router = express.Router();
apiRouter.use(authMiddleware);

// User API
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

// Contact API
apiRouter.post("/api/contacts/", ContactController.create);
apiRouter.get("/api/contacts/:contactId", ContactController.get);
apiRouter.put("/api/contacts/:contactId", ContactController.update);
apiRouter.delete("/api/contacts/:contactId", ContactController.remove);
