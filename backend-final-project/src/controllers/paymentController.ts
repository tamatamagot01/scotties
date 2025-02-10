import { Request, Response } from "express";
import Stripe from "stripe";
import nodemailer from "nodemailer";

import {
  createOrderNotLoginUser,
  findNotLoginOrderByOrderId,
  findOrderByOrderId,
  findProductsInCompleteOrder,
  findProductsInCompleteOrderNotLogin,
  getPaymentStatus,
  OrderNotLoginType,
  updateCompleteOrder,
  updateCompleteOrderNotLogin,
  userUsedCoupon,
} from "../services/orderService";
import { verifyToken } from "../utils/userUtility";
import { findNotLoginUserEmail, findUserEmail } from "../services/userService";
import {
  updateProductOptionTotalSale,
  updateProductAfterSold,
  updateProductTotalSale,
} from "../services/productService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createPayment = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const { id } = await verifyToken(token);
    const { userId, userOrderId, couponId } = req.body;

    const userEmail = (await findUserEmail(id)) as { email: string };

    const userOrder = await findOrderByOrderId(userOrderId);

    const line_items = userOrder?.products.map((order) => ({
      price_data: {
        currency: "thb",
        product_data: {
          name:
            order.product.productName + " " + `(${order.option.optionName})`,
        },
        unit_amount: order.product.price * 100,
      },
      quantity: order.quantity,
    }));

    let session;

    if (line_items) {
      session = await stripe.checkout.sessions.create({
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

    res.status(201).json(session?.url);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createPaymentNotLogin = async (req: Request, res: Response) => {
  try {
    const body = req.body as OrderNotLoginType;

    // สร้าง order สำหรับ user ที่ไม่ login (เก็บข้อมูล user, email, และอื่นๆใน table เดียวเลย)
    const order = await createOrderNotLoginUser(body);

    // สร้าง line_items
    const line_items = order.products.map((order) => ({
      price_data: {
        currency: "thb",
        product_data: {
          name:
            order.product.productName + " " + `(${order.option.optionName})`,
        },
        unit_amount: order.product.price * 100,
      },
      quantity: order.quantity,
    }));

    //สร้าง session สำหรับการชำระเงิน
    let session;

    if (line_items) {
      session = await stripe.checkout.sessions.create({
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

    res.status(201).json(session?.url);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const paymentStatus = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.query.orderId);

    const paymentStatus = await getPaymentStatus(orderId);
    res.status(200).json(paymentStatus);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const successPayment = async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id as string
    );

    const paymentStatus = session.status;

    if (paymentStatus === "complete") {
      const userId = Number(req.query.user_id);
      const orderId = Number(req.query.order_id);
      const couponId = Number(req.query.coupon_id);

      // update status ของ order จาก pending เป็น complete
      await updateCompleteOrder(orderId);

      // ดึง order นี้มาเพื่อจะหาว่ามี product อะไรใน order บ้าง
      const productsInCompleteOrder = await findProductsInCompleteOrder(
        orderId
      );
      const soldProducts = productsInCompleteOrder?.products;

      // update quantity ของ product ให้ลดลงตามจำนวนที่ถูกซื้อ
      await updateProductAfterSold(soldProducts);

      // update coupon ให้ user คนนี้ไม่สามารถใช้ coupon ที่เคยใช้แล้วได้
      if (couponId !== 0) {
        await userUsedCoupon(userId, orderId, couponId);
      }

      // update totalSale ให้เพิ่มขึ้นตามจำนวนที่ถูกขายไป
      if (soldProducts) {
        await updateProductOptionTotalSale(soldProducts);
      }

      // update totalSale ใน model Product ตามผลรวมของ totalSale ของ ProductOption ที่มี productId เดียวกัน
      if (soldProducts) {
        await updateProductTotalSale(soldProducts);
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "itsaree.n9@gmail.com",
          pass: process.env.PW,
        },
      });

      const customerEmail = await findUserEmail(userId);

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
          } else {
            console.log(info);
          }
        });
      }
    }

    res.status(200).json({ paymentStatus });
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const successPaymentNotLogin = async (req: Request, res: Response) => {
  let thisOrder;
  try {
    // // อย่าลืมส่ง session ที่ได้หลังทำการจ่ายเงินมาด้วย
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id as string
    );

    const paymentStatus = session.status;

    if (paymentStatus === "complete") {
      const orderId = Number(req.query.order_id);

      // update status ของ order นี้ให้เป็น complete หลังจ่ายเงินแล้ว
      await updateCompleteOrderNotLogin(orderId);

      // ดึง order นี้มาเพื่อจะหาว่ามี product อะไรใน order บ้าง
      const productsInCompleteOrder = await findProductsInCompleteOrderNotLogin(
        orderId
      );
      const soldProducts = productsInCompleteOrder?.products;

      // update quantity ของ product ให้ลดลงตามจำนวนที่ถูกซื้อ
      const completeChangeQuantity = await updateProductAfterSold(soldProducts);

      // ดึง order (ไม่ได้ login) ที่จ่ายเงินเรียบร้อยแล้ว (complete)
      thisOrder = await findNotLoginOrderByOrderId(orderId);

      // update totalSale ใน model ProductOption ให้เพิ่มขึ้นตามจำนวนที่ถูกขายไป
      if (soldProducts) {
        await updateProductOptionTotalSale(soldProducts);
      }

      // update totalSale ใน model Product ตามผลรวมของ totalSale ของ ProductOption ที่มี productId เดียวกัน
      if (soldProducts) {
        await updateProductTotalSale(soldProducts);
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "itsaree.n9@gmail.com",
          pass: process.env.PW,
        },
      });

      const customerEmail = await findNotLoginUserEmail(orderId);

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
          } else {
            console.log(info);
          }
        });
      }
    }

    res.status(200).json(thisOrder);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};
