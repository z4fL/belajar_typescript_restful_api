import type { NextFunction, Request, Response } from "express";
import type { CreateUserRequest } from "../model/user-model.js";
import { UserService } from "../service/user-service.js";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const response = await UserService.register(request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
