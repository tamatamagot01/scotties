import { PrismaClient } from "@prisma/client";
import { adminFilterType } from "../controllers/orderController";

const prisma = new PrismaClient();

type OrderType = {
  userId: number;
  productId: number;
  optionId: number;
  quantity: number;
};

export type OrderNotLoginType = {
  addressData: {
    streetAddress: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    phoneNumber: string;
  };
  customerData: {
    email: string;
    firstName: string;
    lastName: string;
    wantNews: boolean;
  };
  thisOrders: {
    productId: number;
    optionId: number;
    quantity: number;
  }[];
};

export const createOrder = async (data: OrderType) => {
  const { userId, productId, optionId, quantity } = data;
  let order;

  console.log(
    "userID",
    userId,
    "productID",
    productId,
    "optionId",
    optionId,
    "quantity",
    quantity
  );

  const checkOrder = await findPendingOrderByUserId(userId);

  //   กรณียังไม่เคยมี order ของ user คนนี้เลย
  if (!checkOrder) {
    order = await prisma.order.create({
      data: {
        userId,
        products: {
          create: {
            productId,
            optionId,
            quantity,
          },
        },
        totalAmount: quantity,
        status: "pending",
      },
    });
  }

  // กรณีมี order ของ user คนนี้อยู่แล้ว แต่ status ยัง pending
  if (checkOrder && checkOrder.status === "pending") {
    // ดึง orderId ของ user คนนี้
    const orderId = checkOrder.id;

    // check ว่า product ที่จะเพิ่มใน order นั้นเคยมีอยู่แล้วไหม
    const haveProductInOrder = await findProductInOrder(
      productId,
      optionId,
      orderId
    );

    // หาก product ที่เพิ่มมีใน order อยู่แล้ว -> จะทำการ update product ใน order แทนการสร้าง product ใหม่เข้ามาใน order
    if (haveProductInOrder) {
      await prisma.orderItem.update({
        where: {
          id: haveProductInOrder.id,
        },
        data: {
          quantity,
        },
      });
    }

    // สร้าง record ของ orderItem ใหม่ ใน orderId อันเดิม หากยังไม่มี product นั้นใน order มาก่อน
    if (!haveProductInOrder) {
      await prisma.orderItem.create({
        data: {
          orderId,
          productId,
          optionId,
          quantity,
        },
      });
    }

    // ดึง order ที่ถูกเพิ่ม product มาอีกรอบ เพื่อจะเอา quantity มารวมกันเก็บใน totalAmount
    const thisOrder = await findPendingOrderByUserId(userId);
    // *** ตรงนี้ลอง check ว่ามันไปดึง order ที่ complete มารึปล่าว

    const updateAmount = thisOrder!.products.reduce(
      (acc, cur) => cur.quantity + acc,
      0
    );

    // ทำการ update totalAmount เดิม
    order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        totalAmount: updateAmount,
      },
    });
  }

  return order;
};

export const getOrdersLoginUser = async () => {
  const orders = await prisma.order.findMany();

  return orders;
};

export const createOrderNotLoginUser = async (data: OrderNotLoginType) => {
  const { addressData, customerData, thisOrders } = data;

  const { streetAddress, subDistrict, district, province, postalCode } =
    addressData;
  const userAddress = [
    streetAddress,
    subDistrict,
    district,
    province,
    postalCode,
  ].reduce((acc, cur) => acc + " " + cur, "");

  const checkOrder = await findPendingOrderForUserNotLogin({
    email: customerData.email,
    phoneNumber: addressData.phoneNumber,
  });

  if (checkOrder) {
    return checkOrder;
  }

  const order = await prisma.orderNotLogin.create({
    data: {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      address: userAddress,
      email: customerData.email,
      phoneNumber: addressData.phoneNumber,
      status: "pending",
      products: {
        createMany: {
          data: thisOrders.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            optionId: item.optionId,
          })),
        },
      },
    },
    include: {
      products: {
        select: {
          product: {
            select: {
              productName: true,
              price: true,
            },
          },
          option: {
            select: {
              optionName: true,
            },
          },
          quantity: true,
        },
      },
    },
  });

  return order;
};

export const getOrdersNotLoginUser = async () => {
  const orders = await prisma.orderNotLogin.findMany();
  return orders;
};

export const getOrderNotLoginUser = async (data: Record<string, number>[]) => {
  const findProducts = data.map(async (item) => {
    if (typeof item.productId === "number") {
      const productItem = await prisma.product.findFirst({
        where: {
          id: item.productId,
        },
        select: {
          id: true,
          imageUrl: true,
          productName: true,
          price: true,
          brand: {
            select: {
              name: true,
            },
          },
          productOptions: {
            where: {
              id: item.optionId,
            },
            select: {
              optionName: true,
            },
          },
        },
      });
      return productItem;
    }
  });

  let orders = await Promise.all(findProducts);

  return orders;
};

export const findOrderByOrderIdAndOrderType = async (
  orderId: number,
  orderType: string
) => {
  let order;

  if (orderType === "member") {
    order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        userId: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        orderUsedCoupon: {
          select: {
            Coupon: {
              select: {
                couponName: true,
              },
            },
          },
        },
        products: {
          select: {
            id: true,
            productId: true,
            product: {
              select: {
                productName: true,
              },
            },
            option: {
              select: {
                optionName: true,
              },
            },
            quantity: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: {
              select: {
                roleName: true,
              },
            },
          },
        },
      },
    });
  }

  if (orderType === "non-member") {
    order = await prisma.orderNotLogin.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        email: true,
        phoneNumber: true,
        status: true,
        createAt: true,
        products: {
          select: {
            id: true,
            productId: true,
            product: {
              select: {
                productName: true,
              },
            },
            option: {
              select: {
                optionName: true,
              },
            },
            quantity: true,
          },
        },
      },
    });
  }

  return order;
};

// ทำ findOrderByUserId เพื่อหาว่า userId คนนี้มีการสร้าง order ไว้แล้วหรือยัง หากสร้างแล้ว ใน createOrder ก็สร้างแค่ orderItem ไม่ต้องสร้าง order ใหม่ (เอาไปใช้กับตัว createOrder ข้างบน)
export const findOrderByUserId = async (userId: number) => {
  if (userId === undefined) {
    throw new Error("Invalid userId");
  }

  const order = await prisma.order.findFirst({
    where: {
      userId,
    },
    select: {
      totalAmount: true,
      status: true,
      id: true,
      products: {
        select: {
          product: {
            select: {
              id: true,
              productName: true,
              brand: true,
              price: true,
              imageUrl: true,
            },
          },
          quantity: true,
        },
      },
    },
  });

  return order;
};

// ใช้สำหรับหน้า /cart และ /checkout (เพื่อดึง order ตาม userId และ order ต้องมี status === "pending") (สำหรับ user ที่ login)
export const findPendingOrderByUserId = async (userId: number) => {
  if (userId === undefined) {
    throw new Error("Invalid userId");
  }

  const order = await prisma.order.findFirst({
    where: {
      userId,
      status: "pending",
    },
    select: {
      totalAmount: true,
      status: true,
      id: true,
      products: {
        select: {
          option: {
            select: {
              optionName: true,
            },
          },
          product: {
            select: {
              id: true,
              productName: true,
              brand: true,
              price: true,
              imageUrl: true,
            },
          },
          quantity: true,
        },
      },
    },
  });

  return order;
};

export const findPendingOrderForUserNotLogin = async (userDetail: any) => {
  const order = await prisma.orderNotLogin.findFirst({
    where: {
      email: userDetail.email,
      phoneNumber: userDetail.phoneNumber,
      status: "pending",
    },
    select: {
      status: true,
      id: true,
      email: true,
      products: {
        select: {
          option: {
            select: {
              optionName: true,
            },
          },
          product: {
            select: {
              id: true,
              productName: true,
              brand: true,
              price: true,
              imageUrl: true,
            },
          },
          quantity: true,
        },
      },
    },
  });

  return order;
};

export const findProductInOrder = async (
  productId: number,
  optionId: number,
  orderId: number
) => {
  const product = await prisma.orderItem.findFirst({
    where: {
      productId,
      optionId,
      orderId,
    },
  });
  return product;
};

export const removeItemFromOrder = async (
  orderId: number,
  productId: number,
  userId: number
) => {
  const orderItemId = await findOrderItem(orderId, productId);

  if (orderItemId) {
    await prisma.orderItem.delete({
      where: {
        id: orderItemId.id,
      },
    });

    const thisOrder = await findPendingOrderByUserId(userId);

    const updateAmount = thisOrder!.products.reduce(
      (acc, cur) => cur.quantity + acc,
      0
    );

    // ทำการ update totalAmount เดิม
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        totalAmount: updateAmount,
      },
    });
  }
};

export const findOrderByOrderId = async (orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      userId: true,
      totalAmount: true,
      status: true,
      products: {
        select: {
          product: {
            select: {
              productName: true,
              price: true,
            },
          },
          option: {
            select: {
              optionName: true,
            },
          },
          quantity: true,
        },
      },
    },
  });
  return order;
};

export const findOrderItem = async (orderId: number, productId: number) => {
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      orderId,
      productId,
    },
    select: {
      id: true,
    },
  });

  return orderItem;
};

// สำหรับ update status ของ order เป็น complete หาก user จ่ายเงินแล้ว
export const updateCompleteOrder = async (orderId: number) => {
  const completeOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "complete",
    },
  });

  return completeOrder;
};

export const updateCompleteOrderNotLogin = async (orderId: number) => {
  const completeOrder = await prisma.orderNotLogin.update({
    where: {
      id: orderId,
    },
    data: {
      status: "complete",
    },
  });

  return completeOrder;
};

// ใช้หา products ทั้งหมดที่อยู่ใน complete order นี้
export const findProductsInCompleteOrder = async (orderId: number) => {
  const products = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    select: {
      products: {
        select: {
          productId: true,
          optionId: true,
          quantity: true,
        },
      },
    },
  });

  return products;
};

export const findProductsInCompleteOrderNotLogin = async (orderId: number) => {
  const products = await prisma.orderNotLogin.findFirst({
    where: {
      id: orderId,
    },
    select: {
      products: {
        select: {
          productId: true,
          optionId: true,
          quantity: true,
        },
      },
    },
  });

  return products;
};

export const findNotLoginOrderByOrderId = async (orderId: number) => {
  const order = await prisma.orderNotLogin.findUnique({
    where: {
      id: orderId,
    },
  });

  return order;
};

export const findOrderInRange = async (
  page: number,
  sortOrder: string,
  searchOrder: string,
  filterOrder: adminFilterType
) => {
  let orders;

  const takeItems = 15;
  const skipItems = (page - 1) * takeItems;

  // เกี่ยวกับการ sort
  const [sortBy, sortType] = sortOrder.split(".");

  // เกี่ยวกับการ search
  const whereSearch = isNaN(Number(searchOrder))
    ? { user: { firstName: { contains: searchOrder } } }
    : { id: Number(searchOrder) };

  // เกี่ยวกับการ filter
  let whereFilter: any = {};

  if (filterOrder && filterOrder.status.all === "false") {
    whereFilter.status = { in: filterOrder.status.value };
  }

  if (filterOrder && filterOrder!.totalAmount.all === "false") {
    const checkTotalAmountFilter = filterOrder.totalAmount.value?.map(
      (amount) => {
        if (amount === "1 - 5") return { totalAmount: { gte: 1, lte: 5 } };
        if (amount === "6 - 10") return { totalAmount: { gte: 6, lte: 10 } };
        if (amount === "> 10") return { totalAmount: { gte: 10 } };
      }
    );

    if (checkTotalAmountFilter && checkTotalAmountFilter?.length > 0) {
      whereFilter.OR = checkTotalAmountFilter;
    }
  }

  if (searchOrder !== "" && Object.keys(whereFilter).length !== 0) {
    orders = await prisma.order.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy:
        sortBy === "userName"
          ? {
              user: { firstName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereSearch,
        ...whereFilter,
      },
      include: {
        user: true,
      },
    });
  } else if (searchOrder !== "" && Object.keys(whereFilter).length === 0) {
    orders = await prisma.order.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy:
        sortBy === "userName"
          ? {
              user: { firstName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereSearch,
      },
      include: {
        user: true,
      },
    });
  } else if (searchOrder === "" && Object.keys(whereFilter).length !== 0) {
    orders = await prisma.order.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy:
        sortBy === "userName"
          ? {
              user: { firstName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereFilter,
      },
      include: {
        user: true,
      },
    });
  } else {
    orders = await prisma.order.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy:
        sortBy === "userName"
          ? {
              user: { firstName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      include: {
        user: true,
      },
    });
  }

  return orders;
};

export const findLengthOfOrders = async (
  sortOrder: string,
  searchOrder: string,
  filterOrder: adminFilterType
) => {
  let orderLength;

  // เกี่ยวกับการ sort
  const sortBy = sortOrder.split(",")[0];
  const sortType = sortOrder.split(",")[1];

  // เกี่ยวกับการ search
  let whereSearch;

  if (isNaN(Number(searchOrder))) {
    whereSearch = {
      user: {
        firstName: {
          contains: searchOrder,
        },
      },
    };
  } else {
    whereSearch = {
      id: Number(searchOrder),
    };
  }

  // เกี่ยวกับการ filter
  let whereFilter = {};

  if (filterOrder && filterOrder.status.all === "false") {
    const status = {
      OR: filterOrder?.status.value?.map((status) => ({
        status,
      })),
    };

    whereFilter = { ...status };
  }

  if (filterOrder && filterOrder!.totalAmount.all === "false") {
    const checkTotalAmountFilter = filterOrder.totalAmount.value?.map(
      (amount) => {
        if (amount === "1 - 5") {
          return { totalAmount: { gte: 1, lte: 5 } };
        }

        if (amount === "6 - 10") {
          return { totalAmount: { gte: 6, lte: 10 } };
        }

        if (amount === "> 10") {
          return { totalAmount: { gte: 10 } };
        }
      }
    );

    const totalAmount = {
      OR: checkTotalAmountFilter,
    };

    whereFilter = { ...whereFilter, ...totalAmount };
  }

  if (searchOrder !== "" && Object.keys(whereFilter).length !== 0) {
    orderLength = await prisma.order.aggregate({
      orderBy:
        sortBy === "userName"
          ? {
              user: { firstName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereSearch,
        ...whereFilter,
      },
      _count: {
        _all: true,
      },
    });
  } else if (searchOrder !== "" && Object.keys(whereFilter).length === 0) {
    orderLength = await prisma.order.aggregate({
      orderBy:
        sortBy === "userName"
          ? {
              user: { firstName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereSearch,
      },
      _count: {
        _all: true,
      },
    });
  } else if (searchOrder === "" && Object.keys(whereFilter).length !== 0) {
    orderLength = await prisma.order.aggregate({
      orderBy:
        sortBy === "userName"
          ? {
              user: { firstName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereFilter,
      },
      _count: {
        _all: true,
      },
    });
  } else {
    orderLength = await prisma.order.aggregate({
      orderBy:
        sortBy === "userName"
          ? {
              user: { firstName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      _count: {
        _all: true,
      },
    });
  }

  return orderLength;
};

export const getPaymentStatus = async (orderId: number) => {
  const orderPaymentStatus = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      status: true,
    },
  });

  return orderPaymentStatus;
};

export const findCouponService = async (couponCode: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      couponCode,
    },
  });

  return coupon;
};

export const findIsUsedCoupon = async (couponId: number, userId: number) => {
  const isUsed = await prisma.userCouponMapping.findMany({
    where: {
      couponId,
      userId,
    },
  });

  return isUsed;
};

export const userUsedCoupon = async (
  userId: number,
  orderId: number,
  couponId: number
) => {
  await prisma.userCouponMapping.create({
    data: {
      userId,
      orderId,
      couponId,
    },
  });
};

export const todaySalesService = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const sales = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    select: {
      totalAmount: true,
      products: {
        select: {
          product: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });

  return sales;
};

export const totalSalesService = async () => {
  const sales = await prisma.order.findMany({
    select: {
      totalAmount: true,
      products: {
        select: {
          product: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });

  return sales;
};

export const monthSalesService = async () => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const sales = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      totalAmount: true,
      products: {
        select: {
          product: {
            select: {
              price: true,
            },
          },
        },
      },
      createdAt: true,
    },
  });

  return sales;
};
