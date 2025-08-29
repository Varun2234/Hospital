import express from "express";
import { body } from "express-validator";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  saveTransaction,
  getTransactions,
} from "../controllers/paymentController.js";

const validateCreateOrder = [
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .notEmpty()
    .withMessage("Amount is required"),
];

const validateSaveTransaction = [
  body("orderID")
    .isString()
    .withMessage("Order ID must be a string")
    .notEmpty()
    .withMessage("Order ID is required"),
  body("paymentID")
    .isString()
    .withMessage("Payment ID must be a string")
    .notEmpty()
    .withMessage("Payment ID is required"),
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .notEmpty()
    .withMessage("Amount is required"),
  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string"),
  body("receipt").optional().isString().withMessage("Receipt must be a string"),
  body("status")
    .isIn(["success", "failed"])
    .withMessage("Status must be either 'success' or 'failed'"),
];

const router = express.Router();

router.post("/create-order", verifyToken, validateCreateOrder, createOrder);

router.post(
  "/save-transaction",
  verifyToken,
  validateSaveTransaction,
  saveTransaction
);

router.get("/", verifyToken, getTransactions);

export default router;
