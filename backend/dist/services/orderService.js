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
exports.monthSalesService = exports.totalSalesService = exports.todaySalesService = exports.userUsedCoupon = exports.findIsUsedCoupon = exports.findCouponService = exports.getPaymentStatus = exports.findLengthOfOrders = exports.findOrderInRange = exports.findNotLoginOrderByOrderId = exports.findProductsInCompleteOrderNotLogin = exports.findProductsInCompleteOrder = exports.updateCompleteOrderNotLogin = exports.updateCompleteOrder = exports.findOrderItem = exports.findOrderByOrderId = exports.removeItemFromOrder = exports.findProductInOrder = exports.findPendingOrderForUserNotLogin = exports.findPendingOrderByUserId = exports.findOrderByUserId = exports.findOrderByOrderIdAndOrderType = exports.getOrderNotLoginUser = exports.getOrdersNotLoginUser = exports.createOrderNotLoginUser = exports.getOrdersLoginUser = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrder = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId, optionId, quantity } = data;
    let order;
    console.log("userID", userId, "productID", productId, "optionId", optionId, "quantity", quantity);
    const checkOrder = yield (0, exports.findPendingOrderByUserId)(userId);
    //   กรณียังไม่เคยมี order ของ user คนนี้เลย
    if (!checkOrder) {
        order = yield prisma.order.create({
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
        const haveProductInOrder = yield (0, exports.findProductInOrder)(productId, optionId, orderId);
        // หาก product ที่เพิ่มมีใน order อยู่แล้ว -> จะทำการ update product ใน order แทนการสร้าง product ใหม่เข้ามาใน order
        if (haveProductInOrder) {
            yield prisma.orderItem.update({
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
            yield prisma.orderItem.create({
                data: {
                    orderId,
                    productId,
                    optionId,
                    quantity,
                },
            });
        }
        // ดึง order ที่ถูกเพิ่ม product มาอีกรอบ เพื่อจะเอา quantity มารวมกันเก็บใน totalAmount
        const thisOrder = yield (0, exports.findPendingOrderByUserId)(userId);
        // *** ตรงนี้ลอง check ว่ามันไปดึง order ที่ complete มารึปล่าว
        const updateAmount = thisOrder.products.reduce((acc, cur) => cur.quantity + acc, 0);
        // ทำการ update totalAmount เดิม
        order = yield prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                totalAmount: updateAmount,
            },
        });
    }
    return order;
});
exports.createOrder = createOrder;
const getOrdersLoginUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma.order.findMany();
    return orders;
});
exports.getOrdersLoginUser = getOrdersLoginUser;
const createOrderNotLoginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { addressData, customerData, thisOrders } = data;
    const { streetAddress, subDistrict, district, province, postalCode } = addressData;
    const userAddress = [
        streetAddress,
        subDistrict,
        district,
        province,
        postalCode,
    ].reduce((acc, cur) => acc + " " + cur, "");
    const checkOrder = yield (0, exports.findPendingOrderForUserNotLogin)({
        email: customerData.email,
        phoneNumber: addressData.phoneNumber,
    });
    if (checkOrder) {
        return checkOrder;
    }
    const order = yield prisma.orderNotLogin.create({
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
});
exports.createOrderNotLoginUser = createOrderNotLoginUser;
const getOrdersNotLoginUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma.orderNotLogin.findMany();
    return orders;
});
exports.getOrdersNotLoginUser = getOrdersNotLoginUser;
const getOrderNotLoginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const findProducts = data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof item.productId === "number") {
            const productItem = yield prisma.product.findFirst({
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
    }));
    let orders = yield Promise.all(findProducts);
    return orders;
});
exports.getOrderNotLoginUser = getOrderNotLoginUser;
const findOrderByOrderIdAndOrderType = (orderId, orderType) => __awaiter(void 0, void 0, void 0, function* () {
    let order;
    if (orderType === "member") {
        order = yield prisma.order.findUnique({
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
        order = yield prisma.orderNotLogin.findUnique({
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
});
exports.findOrderByOrderIdAndOrderType = findOrderByOrderIdAndOrderType;
// ทำ findOrderByUserId เพื่อหาว่า userId คนนี้มีการสร้าง order ไว้แล้วหรือยัง หากสร้างแล้ว ใน createOrder ก็สร้างแค่ orderItem ไม่ต้องสร้าง order ใหม่ (เอาไปใช้กับตัว createOrder ข้างบน)
const findOrderByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId === undefined) {
        throw new Error("Invalid userId");
    }
    const order = yield prisma.order.findFirst({
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
});
exports.findOrderByUserId = findOrderByUserId;
// ใช้สำหรับหน้า /cart และ /checkout (เพื่อดึง order ตาม userId และ order ต้องมี status === "pending") (สำหรับ user ที่ login)
const findPendingOrderByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId === undefined) {
        throw new Error("Invalid userId");
    }
    const order = yield prisma.order.findFirst({
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
});
exports.findPendingOrderByUserId = findPendingOrderByUserId;
const findPendingOrderForUserNotLogin = (userDetail) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma.orderNotLogin.findFirst({
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
});
exports.findPendingOrderForUserNotLogin = findPendingOrderForUserNotLogin;
const findProductInOrder = (productId, optionId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma.orderItem.findFirst({
        where: {
            productId,
            optionId,
            orderId,
        },
    });
    return product;
});
exports.findProductInOrder = findProductInOrder;
const removeItemFromOrder = (orderId, productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orderItemId = yield (0, exports.findOrderItem)(orderId, productId);
    if (orderItemId) {
        yield prisma.orderItem.delete({
            where: {
                id: orderItemId.id,
            },
        });
        const thisOrder = yield (0, exports.findPendingOrderByUserId)(userId);
        const updateAmount = thisOrder.products.reduce((acc, cur) => cur.quantity + acc, 0);
        // ทำการ update totalAmount เดิม
        yield prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                totalAmount: updateAmount,
            },
        });
    }
});
exports.removeItemFromOrder = removeItemFromOrder;
const findOrderByOrderId = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma.order.findFirst({
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
});
exports.findOrderByOrderId = findOrderByOrderId;
const findOrderItem = (orderId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const orderItem = yield prisma.orderItem.findFirst({
        where: {
            orderId,
            productId,
        },
        select: {
            id: true,
        },
    });
    return orderItem;
});
exports.findOrderItem = findOrderItem;
// สำหรับ update status ของ order เป็น complete หาก user จ่ายเงินแล้ว
const updateCompleteOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const completeOrder = yield prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status: "complete",
        },
    });
    return completeOrder;
});
exports.updateCompleteOrder = updateCompleteOrder;
const updateCompleteOrderNotLogin = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const completeOrder = yield prisma.orderNotLogin.update({
        where: {
            id: orderId,
        },
        data: {
            status: "complete",
        },
    });
    return completeOrder;
});
exports.updateCompleteOrderNotLogin = updateCompleteOrderNotLogin;
// ใช้หา products ทั้งหมดที่อยู่ใน complete order นี้
const findProductsInCompleteOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.order.findFirst({
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
});
exports.findProductsInCompleteOrder = findProductsInCompleteOrder;
const findProductsInCompleteOrderNotLogin = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.orderNotLogin.findFirst({
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
});
exports.findProductsInCompleteOrderNotLogin = findProductsInCompleteOrderNotLogin;
const findNotLoginOrderByOrderId = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma.orderNotLogin.findUnique({
        where: {
            id: orderId,
        },
    });
    return order;
});
exports.findNotLoginOrderByOrderId = findNotLoginOrderByOrderId;
const findOrderInRange = (page, sortOrder, searchOrder, filterOrder) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    let whereFilter = {};
    if (filterOrder && filterOrder.status.all === "false") {
        whereFilter.status = { in: filterOrder.status.value };
    }
    if (filterOrder && filterOrder.totalAmount.all === "false") {
        const checkTotalAmountFilter = (_a = filterOrder.totalAmount.value) === null || _a === void 0 ? void 0 : _a.map((amount) => {
            if (amount === "1 - 5")
                return { totalAmount: { gte: 1, lte: 5 } };
            if (amount === "6 - 10")
                return { totalAmount: { gte: 6, lte: 10 } };
            if (amount === "> 10")
                return { totalAmount: { gte: 10 } };
        });
        if (checkTotalAmountFilter && (checkTotalAmountFilter === null || checkTotalAmountFilter === void 0 ? void 0 : checkTotalAmountFilter.length) > 0) {
            whereFilter.OR = checkTotalAmountFilter;
        }
    }
    if (searchOrder !== "" && Object.keys(whereFilter).length !== 0) {
        orders = yield prisma.order.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: sortBy === "userName"
                ? {
                    user: { firstName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            where: Object.assign(Object.assign({}, whereSearch), whereFilter),
            include: {
                user: true,
            },
        });
    }
    else if (searchOrder !== "" && Object.keys(whereFilter).length === 0) {
        orders = yield prisma.order.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: sortBy === "userName"
                ? {
                    user: { firstName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            where: Object.assign({}, whereSearch),
            include: {
                user: true,
            },
        });
    }
    else if (searchOrder === "" && Object.keys(whereFilter).length !== 0) {
        orders = yield prisma.order.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: sortBy === "userName"
                ? {
                    user: { firstName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            where: Object.assign({}, whereFilter),
            include: {
                user: true,
            },
        });
    }
    else {
        orders = yield prisma.order.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: sortBy === "userName"
                ? {
                    user: { firstName: sortType },
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
});
exports.findOrderInRange = findOrderInRange;
const findLengthOfOrders = (sortOrder, searchOrder, filterOrder) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
    }
    else {
        whereSearch = {
            id: Number(searchOrder),
        };
    }
    // เกี่ยวกับการ filter
    let whereFilter = {};
    if (filterOrder && filterOrder.status.all === "false") {
        const status = {
            OR: (_a = filterOrder === null || filterOrder === void 0 ? void 0 : filterOrder.status.value) === null || _a === void 0 ? void 0 : _a.map((status) => ({
                status,
            })),
        };
        whereFilter = Object.assign({}, status);
    }
    if (filterOrder && filterOrder.totalAmount.all === "false") {
        const checkTotalAmountFilter = (_b = filterOrder.totalAmount.value) === null || _b === void 0 ? void 0 : _b.map((amount) => {
            if (amount === "1 - 5") {
                return { totalAmount: { gte: 1, lte: 5 } };
            }
            if (amount === "6 - 10") {
                return { totalAmount: { gte: 6, lte: 10 } };
            }
            if (amount === "> 10") {
                return { totalAmount: { gte: 10 } };
            }
        });
        const totalAmount = {
            OR: checkTotalAmountFilter,
        };
        whereFilter = Object.assign(Object.assign({}, whereFilter), totalAmount);
    }
    if (searchOrder !== "" && Object.keys(whereFilter).length !== 0) {
        orderLength = yield prisma.order.aggregate({
            orderBy: sortBy === "userName"
                ? {
                    user: { firstName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            where: Object.assign(Object.assign({}, whereSearch), whereFilter),
            _count: {
                _all: true,
            },
        });
    }
    else if (searchOrder !== "" && Object.keys(whereFilter).length === 0) {
        orderLength = yield prisma.order.aggregate({
            orderBy: sortBy === "userName"
                ? {
                    user: { firstName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            where: Object.assign({}, whereSearch),
            _count: {
                _all: true,
            },
        });
    }
    else if (searchOrder === "" && Object.keys(whereFilter).length !== 0) {
        orderLength = yield prisma.order.aggregate({
            orderBy: sortBy === "userName"
                ? {
                    user: { firstName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            where: Object.assign({}, whereFilter),
            _count: {
                _all: true,
            },
        });
    }
    else {
        orderLength = yield prisma.order.aggregate({
            orderBy: sortBy === "userName"
                ? {
                    user: { firstName: sortType },
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
});
exports.findLengthOfOrders = findLengthOfOrders;
const getPaymentStatus = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const orderPaymentStatus = yield prisma.order.findUnique({
        where: {
            id: orderId,
        },
        select: {
            status: true,
        },
    });
    return orderPaymentStatus;
});
exports.getPaymentStatus = getPaymentStatus;
const findCouponService = (couponCode) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma.coupon.findUnique({
        where: {
            couponCode,
        },
    });
    return coupon;
});
exports.findCouponService = findCouponService;
const findIsUsedCoupon = (couponId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUsed = yield prisma.userCouponMapping.findMany({
        where: {
            couponId,
            userId,
        },
    });
    return isUsed;
});
exports.findIsUsedCoupon = findIsUsedCoupon;
const userUsedCoupon = (userId, orderId, couponId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.userCouponMapping.create({
        data: {
            userId,
            orderId,
            couponId,
        },
    });
});
exports.userUsedCoupon = userUsedCoupon;
const todaySalesService = () => __awaiter(void 0, void 0, void 0, function* () {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const sales = yield prisma.order.findMany({
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
});
exports.todaySalesService = todaySalesService;
const totalSalesService = () => __awaiter(void 0, void 0, void 0, function* () {
    const sales = yield prisma.order.findMany({
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
});
exports.totalSalesService = totalSalesService;
const monthSalesService = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    const sales = yield prisma.order.findMany({
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
});
exports.monthSalesService = monthSalesService;
