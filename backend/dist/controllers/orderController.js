"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthSales = exports.totalSales = exports.todaySales = exports.findCoupon = exports.removeItemInOrder = exports.getOrderInRange = exports.getOrderForUserNotLogin = exports.getOrderByOrderIDAndOrderType = exports.getOrderByUserId = exports.getOrders = exports.userCreateOrder = void 0;
const orderService_1 = require("../services/orderService");
const userCreateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield (0, orderService_1.createOrder)(req.body);
        res.status(201).json(order);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.userCreateOrder = userCreateOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orders;
        const { filter } = req.query;
        if (filter === "member") {
            orders = yield (0, orderService_1.getOrdersLoginUser)();
        }
        if (filter === "non-member") {
            orders = yield (0, orderService_1.getOrdersNotLoginUser)();
        }
        res.status(201).json(orders);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getOrders = getOrders;
const getOrderByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.query.userId);
        const order = yield (0, orderService_1.findPendingOrderByUserId)(userId);
        res.status(200).json(order);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getOrderByUserId = getOrderByUserId;
const getOrderByOrderIDAndOrderType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, orderType } = req.query;
        if (!orderId || !orderType) {
            res.status(400).json({ error: "Can't access this order" });
            return;
        }
        const order = yield (0, orderService_1.findOrderByOrderIdAndOrderType)(Number(orderId), String(orderType));
        if (!order) {
            res.status(400).json({ error: "Can't find this order" });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getOrderByOrderIDAndOrderType = getOrderByOrderIDAndOrderType;
const getOrderForUserNotLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.query.orders;
        const decodedData = JSON.parse(decodeURIComponent(data));
        let orders;
        if (decodedData.length > 0) {
            orders = yield (0, orderService_1.getOrderNotLoginUser)(decodedData);
        }
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getOrderForUserNotLogin = getOrderForUserNotLogin;
const getOrderInRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, sortOrder, searchOrder, filterOrder } = req.query;
        const orders = yield (0, orderService_1.findOrderInRange)(Number(page), String(sortOrder), String(searchOrder), filterOrder);
        const countOrders = yield (0, orderService_1.findLengthOfOrders)(String(sortOrder), String(searchOrder), filterOrder);
        res.status(200).json({ orders, countOrders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getOrderInRange = getOrderInRange;
const removeItemInOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = Number(req.query.orderId);
        const productId = Number(req.query.productId);
        const userId = Number(req.query.userId);
        let order;
        if (typeof orderId === "number" &&
            typeof productId === "number" &&
            typeof userId === "number") {
            order = yield (0, orderService_1.removeItemFromOrder)(orderId, productId, userId);
        }
        res.status(200).json({ message: "Item already deleted" });
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.removeItemInOrder = removeItemInOrder;
const findCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { couponCode, userId } = req.query;
        const coupon = yield (0, orderService_1.findCouponService)(couponCode);
        const isUsedByThisUser = yield (0, orderService_1.findIsUsedCoupon)(Number(coupon === null || coupon === void 0 ? void 0 : coupon.id), Number(userId));
        if (!coupon) {
            res.status(400).json({ error: "Invalid coupon code" });
            return;
        }
        else if (coupon && !coupon.isActive) {
            res.status(400).json({ error: "The coupon has expired" });
            return;
        }
        else if (coupon && isUsedByThisUser.length !== 0) {
            res.status(400).json({ error: "This coupon has already been used" });
            return;
        }
        else {
            res.status(200).json(coupon);
        }
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.findCoupon = findCoupon;
const todaySales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield (0, orderService_1.todaySalesService)();
        res.status(200).json(sales);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.todaySales = todaySales;
const totalSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield (0, orderService_1.totalSalesService)();
        res.status(200).json(sales);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.totalSales = totalSales;
const monthSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield (0, orderService_1.monthSalesService)();
        res.status(200).json(sales);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.monthSales = monthSales;
