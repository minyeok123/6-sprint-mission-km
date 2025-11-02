import express from 'express';
import { PrismaClient } from '@prisma/client';

const orderRouter = express.Router();

const prisma = new PrismaClient();

orderRouter.route('/').post(async (req, res) => {
  const { user, orderItems } = req.body;
  const productIds = orderItems.map((orderItem) => orderItem.product.productId);

  function getQuantity(productId) {
    const orderItem = orderItems.find((orderItem) => orderItem.product.productId === productId);
    return orderItem.quantity;
  }
});
