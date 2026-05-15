import type { NextFunction, Response } from "express";
import type { UserRequest } from "../type/user-request.js";
import type { CreateAddressRequest, GetAddressRequest } from "../model/address-model.js";
import { AddressService } from "../service/address-service.js";

export class AddressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateAddressRequest = req.body as CreateAddressRequest;
      request.contactId = Number(req.params.contactId);

      const response = await AddressService.create(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        id: Number(req.params.addressId),
        contactId: Number(req.params.contactId),
      };

      const response = await AddressService.get(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
