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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.successPaymentNotLogin = exports.successPayment = exports.paymentStatus = exports.createPaymentNotLogin = exports.createPayment = void 0;
const stripe_1 = __importDefault(require("stripe"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const orderService_1 = require("../services/orderService");
const userUtility_1 = require("../utils/userUtility");
const userService_1 = require("../services/userService");
const productService_1 = require("../services/productService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const { id } = yield (0, userUtility_1.verifyToken)(token);
        const { userId, userOrderId, couponId } = req.body;
        const userEmail = (yield (0, userService_1.findUserEmail)(id));
        const userOrder = yield (0, orderService_1.findOrderByOrderId)(userOrderId);
        const line_items = userOrder === null || userOrder === void 0 ? void 0 : userOrder.products.map((order) => ({
            price_data: {
                currency: "thb",
                product_data: {
                    name: order.product.productName + " " + `(${order.option.optionName})`,
                },
                unit_amount: order.product.price * 100,
            },
            quantity: order.quantity,
        }));
        let session;
        if (line_items) {
            session = yield stripe.checkout.sessions.create({
                line_items: [
                    ...line_items,
                    {
                        price_data: {
                            currency: "thb",
                            product_data: {
                                name: "Shipping (EMS)",
                            },
                            unit_amount: 50 * 100,
                        },
                        quantity: 1,
                    },
                ],
                customer_email: userEmail.email,
                mode: "payment",
                success_url: `http://localhost:3000/cart/checkout/successful-payment?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}&order_id=${userOrderId}&coupon_id=${couponId}`,
                cancel_url: "http://localhost:3000/cart/checkout",
            });
        }
        res.status(201).json(session === null || session === void 0 ? void 0 : session.url);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.createPayment = createPayment;
const createPaymentNotLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        // สร้าง order สำหรับ user ที่ไม่ login (เก็บข้อมูล user, email, และอื่นๆใน table เดียวเลย)
        const order = yield (0, orderService_1.createOrderNotLoginUser)(body);
        // สร้าง line_items
        const line_items = order.products.map((order) => ({
            price_data: {
                currency: "thb",
                product_data: {
                    name: order.product.productName + " " + `(${order.option.optionName})`,
                },
                unit_amount: order.product.price * 100,
            },
            quantity: order.quantity,
        }));
        //สร้าง session สำหรับการชำระเงิน
        let session;
        if (line_items) {
            session = yield stripe.checkout.sessions.create({
                line_items: [
                    ...line_items,
                    {
                        price_data: {
                            currency: "thb",
                            product_data: {
                                name: "Shipping (EMS)",
                            },
                            unit_amount: 50 * 100,
                        },
                        quantity: 1,
                    },
                ],
                customer_email: order.email,
                mode: "payment",
                success_url: `http://localhost:3000/cart/checkout/successful-payment?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
                cancel_url: "http://localhost:3000/cart/checkout",
            });
        }
        res.status(201).json(session === null || session === void 0 ? void 0 : session.url);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.createPaymentNotLogin = createPaymentNotLogin;
const paymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = Number(req.query.orderId);
        const paymentStatus = yield (0, orderService_1.getPaymentStatus)(orderId);
        res.status(200).json(paymentStatus);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.paymentStatus = paymentStatus;
const successPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.checkout.sessions.retrieve(req.query.session_id);
        const paymentStatus = session.status;
        if (paymentStatus === "complete") {
            const userId = Number(req.query.user_id);
            const orderId = Number(req.query.order_id);
            const couponId = Number(req.query.coupon_id);
            // update status ของ order จาก pending เป็น complete
            yield (0, orderService_1.updateCompleteOrder)(orderId);
            // ดึง order นี้มาเพื่อจะหาว่ามี product อะไรใน order บ้าง
            const productsInCompleteOrder = yield (0, orderService_1.findProductsInCompleteOrder)(orderId);
            const soldProducts = productsInCompleteOrder === null || productsInCompleteOrder === void 0 ? void 0 : productsInCompleteOrder.products;
            // update quantity ของ product ให้ลดลงตามจำนวนที่ถูกซื้อ
            yield (0, productService_1.updateProductAfterSold)(soldProducts);
            // update coupon ให้ user คนนี้ไม่สามารถใช้ coupon ที่เคยใช้แล้วได้
            if (couponId !== 0) {
                yield (0, orderService_1.userUsedCoupon)(userId, orderId, couponId);
            }
            // update totalSale ให้เพิ่มขึ้นตามจำนวนที่ถูกขายไป
            if (soldProducts) {
                yield (0, productService_1.updateProductOptionTotalSale)(soldProducts);
            }
            // update totalSale ใน model Product ตามผลรวมของ totalSale ของ ProductOption ที่มี productId เดียวกัน
            if (soldProducts) {
                yield (0, productService_1.updateProductTotalSale)(soldProducts);
            }
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: "itsaree.n9@gmail.com",
                    pass: process.env.PW,
                },
            });
            const customerEmail = yield (0, userService_1.findUserEmail)(userId);
            if (customerEmail) {
                const option = {
                    from: '"Scotties Admin 👻" <itsaree.n9@gmail.com>',
                    to: customerEmail.email,
                    subject: "Thank You for Your Purchase! 🛍️",
                    text: "Thank you for shopping with us! Your order has been successfully placed.",
                    html: "<b>Thank you for shopping with us! Your order has been successfully placed.</b>",
                };
                transporter.sendMail(option, (err, info) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(info);
                    }
                });
            }
        }
        res.status(200).json({ paymentStatus });
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.successPayment = successPayment;
const successPaymentNotLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let thisOrder;
    try {
        // // อย่าลืมส่ง session ที่ได้หลังทำการจ่ายเงินมาด้วย
        const session = yield stripe.checkout.sessions.retrieve(req.query.session_id);
        const paymentStatus = session.status;
        if (paymentStatus === "complete") {
            const orderId = Number(req.query.order_id);
            // update status ของ order นี้ให้เป็น complete หลังจ่ายเงินแล้ว
            yield (0, orderService_1.updateCompleteOrderNotLogin)(orderId);
            // ดึง order นี้มาเพื่อจะหาว่ามี product อะไรใน order บ้าง
            const productsInCompleteOrder = yield (0, orderService_1.findProductsInCompleteOrderNotLogin)(orderId);
            const soldProducts = productsInCompleteOrder === null || productsInCompleteOrder === void 0 ? void 0 : productsInCompleteOrder.products;
            // update quantity ของ product ให้ลดลงตามจำนวนที่ถูกซื้อ
            const completeChangeQuantity = yield (0, productService_1.updateProductAfterSold)(soldProducts);
            // ดึง order (ไม่ได้ login) ที่จ่ายเงินเรียบร้อยแล้ว (complete)
            thisOrder = yield (0, orderService_1.findNotLoginOrderByOrderId)(orderId);
            // update totalSale ใน model ProductOption ให้เพิ่มขึ้นตามจำนวนที่ถูกขายไป
            if (soldProducts) {
                yield (0, productService_1.updateProductOptionTotalSale)(soldProducts);
            }
            // update totalSale ใน model Product ตามผลรวมของ totalSale ของ ProductOption ที่มี productId เดียวกัน
            if (soldProducts) {
                yield (0, productService_1.updateProductTotalSale)(soldProducts);
            }
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: "itsaree.n9@gmail.com",
                    pass: process.env.PW,
                },
            });
            const customerEmail = yield (0, userService_1.findNotLoginUserEmail)(orderId);
            if (customerEmail) {
                const option = {
                    from: '"Scotties Admin 👻" <itsaree.n9@gmail.com>',
                    to: customerEmail.email,
                    subject: "Thank You for Your Purchase! 🛍️",
                    text: "Thank you for shopping with us! Your order has been successfully placed.",
                    html: "<b>Thank you for shopping with us! Your order has been successfully placed.</b>",
                };
                transporter.sendMail(option, (err, info) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(info);
                    }
                });
            }
        }
        res.status(200).json(thisOrder);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.successPaymentNotLogin = successPaymentNotLogin;
