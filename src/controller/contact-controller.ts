import type { NextFunction, Request, Response } from "express";
import type { CreateContactRequest } from "../model/contact-model.js";
import { ContactService } from "../service/contact-service.js";
import type { UserRequest } from "../type/user-request.js";

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateContactRequest = req.body as CreateContactRequest;
      const response = await ContactService.create(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
