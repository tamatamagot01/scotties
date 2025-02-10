import { Router } from "express";
import {
  userCreateOrder,
  getOrders,
  getOrderByUserId,
  removeItemInOrder,
  getOrderForUserNotLogin,
  getOrderByOrderIDAndOrderType,
  findCoupon,
  getOrderInRange,
  todaySales,
  totalSales,
  monthSales,
} from "../controllers/orderController";
import { verify } from "../middlewares/adminVerify";

const router = Router();

router.post("/user-order", userCreateOrder);
router.get("/orders", verify, getOrders);
router.get("/user-order", getOrderByUserId);
router.get("/get-order-id-type", verify, getOrderByOrderIDAndOrderType);
router.get("/user-not-login-order", getOrderForUserNotLogin);
router.get("/order-in-range", getOrderInRange);
router.delete("/remove-order-item", removeItemInOrder);
router.get("/find-coupon", findCoupon);
router.get("/today-sales", todaySales);
router.get("/total-sales", totalSales);
router.get("/month-sales", monthSales);

export default router;
