import { Router } from "express";
import {
  createPayment,
  createPaymentNotLogin,
  paymentStatus,
  successPayment,
  successPaymentNotLogin,
} from "../controllers/paymentController";

const router = Router();

router.post("/checkout", createPayment);

router.post("/checkout-not-login", createPaymentNotLogin);

router.get("/payment-status", paymentStatus);

router.get("/payment-success", successPayment);

router.get("/payment-success-not-login", successPaymentNotLogin);

export default router;
