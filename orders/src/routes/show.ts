import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Order } from "../models/order";
import { param } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@ww-ticketing/common";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  [
    param("orderId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("orderId must be provided"),
  ],
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
