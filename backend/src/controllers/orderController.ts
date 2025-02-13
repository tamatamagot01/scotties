import { Request, Response } from "express";
import {
  createOrder,
  getOrderNotLoginUser,
  removeItemFromOrder,
  findPendingOrderByUserId,
  getOrdersLoginUser,
  getOrdersNotLoginUser,
  findOrderByOrderIdAndOrderType,
  findCouponService,
  findIsUsedCoupon,
  findOrderInRange,
  findLengthOfOrders,
  todaySalesService,
  totalSalesService,
  monthSalesService,
} from "../services/orderService";

export type adminFilterType =
  | {
      status: {
        all: string;
        value?: string[];
      };
      totalAmount: {
        all: string;
        value?: string[];
      };
    }
  | undefined;

export const userCreateOrder = async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.body);

    res.status(201).json(order);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    let orders;

    const { filter } = req.query;

    if (filter === "member") {
      orders = await getOrdersLoginUser();
    }

    if (filter === "non-member") {
      orders = await getOrdersNotLoginUser();
    }

    res.status(201).json(orders);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrderByUserId = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);

    const order = await findPendingOrderByUserId(userId);

    res.status(200).json(order);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrderByOrderIDAndOrderType = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId, orderType } = req.query;

    if (!orderId || !orderType) {
      res.status(400).json({ error: "Can't access this order" });
      return;
    }

    const order = await findOrderByOrderIdAndOrderType(
      Number(orderId),
      String(orderType)
    );

    if (!order) {
      res.status(400).json({ error: "Can't find this order" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrderForUserNotLogin = async (req: Request, res: Response) => {
  try {
    const data = req.query.orders as string;
    const decodedData = JSON.parse(decodeURIComponent(data));

    let orders;

    if (decodedData.length > 0) {
      orders = await getOrderNotLoginUser(decodedData);
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrderInRange = async (req: Request, res: Response) => {
  try {
    const { page, sortOrder, searchOrder, filterOrder } = req.query;

    const orders = await findOrderInRange(
      Number(page),
      String(sortOrder),
      String(searchOrder),
      filterOrder as adminFilterType
    );

    const countOrders = await findLengthOfOrders(
      String(sortOrder),
      String(searchOrder),
      filterOrder as adminFilterType
    );

    res.status(200).json({ orders, countOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const removeItemInOrder = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.query.orderId);
    const productId = Number(req.query.productId);
    const userId = Number(req.query.userId);

    let order;
    if (
      typeof orderId === "number" &&
      typeof productId === "number" &&
      typeof userId === "number"
    ) {
      order = await removeItemFromOrder(orderId, productId, userId);
    }
    res.status(200).json({ message: "Item already deleted" });
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const findCoupon = async (req: Request, res: Response) => {
  try {
    const { couponCode, userId } = req.query;

    const coupon = await findCouponService(couponCode as string);

    const isUsedByThisUser = await findIsUsedCoupon(
      Number(coupon?.id),
      Number(userId)
    );

    if (!coupon) {
      res.status(400).json({ error: "Invalid coupon code" });
      return;
    } else if (coupon && !coupon.isActive) {
      res.status(400).json({ error: "The coupon has expired" });
      return;
    } else if (coupon && isUsedByThisUser.length !== 0) {
      res.status(400).json({ error: "This coupon has already been used" });
      return;
    } else {
      res.status(200).json(coupon);
    }
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const todaySales = async (req: Request, res: Response) => {
  try {
    const sales = await todaySalesService();
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const totalSales = async (req: Request, res: Response) => {
  try {
    const sales = await totalSalesService();
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const monthSales = async (req: Request, res: Response) => {
  try {
    const sales = await monthSalesService();
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};
