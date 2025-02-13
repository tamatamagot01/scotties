"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const adminVerify_1 = require("../middlewares/adminVerify");
const router = (0, express_1.Router)();
router.post("/user-order", orderController_1.userCreateOrder);
router.get("/orders", adminVerify_1.verify, orderController_1.getOrders);
router.get("/user-order", orderController_1.getOrderByUserId);
router.get("/get-order-id-type", adminVerify_1.verify, orderController_1.getOrderByOrderIDAndOrderType);
router.get("/user-not-login-order", orderController_1.getOrderForUserNotLogin);
router.get("/order-in-range", orderController_1.getOrderInRange);
router.delete("/remove-order-item", orderController_1.removeItemInOrder);
router.get("/find-coupon", orderController_1.findCoupon);
router.get("/today-sales", orderController_1.todaySales);
router.get("/total-sales", orderController_1.totalSales);
router.get("/month-sales", orderController_1.monthSales);
exports.default = router;
