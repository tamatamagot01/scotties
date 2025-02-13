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
exports.findAllMyFavoriteItemService = exports.checkFavoriteItemService = exports.deleteFavoriteItemService = exports.addFavoriteItemService = exports.changePasswordService = exports.deleteUserService = exports.editUserService = exports.findUserByUserId = exports.findAddressByUserId = exports.deleteAddress = exports.editAddress = exports.createAddress = exports.findLengthOfUsers = exports.findUserInRange = exports.findNotLoginUserEmail = exports.findUserEmail = exports.findUserForProfile = exports.findUserForLogin = exports.findUserForRegister = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const userUtility_1 = require("../utils/userUtility");
const prisma = new client_1.PrismaClient();
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, roleId } = userData;
    const encryptedPassword = yield (0, userUtility_1.encryptPassword)(userData.password);
    const user = yield prisma.user.create({
        data: {
            firstName: firstName[0].toUpperCase() +
                firstName.substring(1, firstName.length).toLowerCase(),
            lastName: lastName[0].toUpperCase() +
                lastName.substring(1, lastName.length).toLowerCase(),
            email,
            password: encryptedPassword,
            roleId,
        },
        select: {
            id: true,
            firstName: true,
            email: true,
        },
    });
    return user;
});
exports.createUser = createUser;
const findUserForRegister = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
        },
    });
    return user;
});
exports.findUserForRegister = findUserForRegister;
const findUserForLogin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            password: true,
            roleId: true,
        },
    });
    return user;
});
exports.findUserForLogin = findUserForLogin;
const findUserForProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            roleId: true,
        },
    });
    return user;
});
exports.findUserForProfile = findUserForProfile;
const findUserEmail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = yield prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            email: true,
        },
    });
    return userEmail;
});
exports.findUserEmail = findUserEmail;
const findNotLoginUserEmail = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = yield prisma.orderNotLogin.findUnique({
        where: {
            id: orderId,
        },
        select: {
            email: true,
        },
    });
    return userEmail;
});
exports.findNotLoginUserEmail = findNotLoginUserEmail;
const findUserInRange = (page, sortUser, searchUser, filterUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let users;
    const takeItems = 15;
    const skipItems = (page - 1) * takeItems;
    // เกี่ยวกับการ sort
    console.log(sortUser);
    const sortBy = sortUser.split(",")[0];
    const sortType = sortUser.split(",")[1];
    // เกี่ยวกับการ search
    let whereSearch;
    if (isNaN(Number(searchUser))) {
        whereSearch = {
            OR: [
                { firstName: { contains: searchUser } },
                { lastName: { contains: searchUser } },
            ],
        };
    }
    else {
        whereSearch = {
            id: Number(searchUser),
        };
    }
    // เกี่ยวกับการ filter
    let whereFilter = {};
    if (filterUser && filterUser.role.all === "false") {
        const role = {
            role: {
                OR: (_a = filterUser === null || filterUser === void 0 ? void 0 : filterUser.role.value) === null || _a === void 0 ? void 0 : _a.map((role) => ({
                    roleName: role,
                })),
            },
        };
        whereFilter = Object.assign(Object.assign({}, whereFilter), role);
    }
    if (searchUser !== "" && Object.keys(whereFilter).length !== 0) {
        users = yield prisma.user.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: sortBy === "role"
                ? {
                    [sortBy]: { roleName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            where: Object.assign(Object.assign({}, whereSearch), whereFilter),
            include: {
                orders: true,
                role: true,
            },
        });
    }
    else if (searchUser !== "" && Object.keys(whereFilter).length === 0) {
        users = yield prisma.user.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: sortBy === "role"
                ? {
                    [sortBy]: { roleName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            where: Object.assign({}, whereSearch),
            include: {
                orders: true,
                role: true,
            },
        });
    }
    else if (searchUser === "" && Object.keys(whereFilter).length !== 0) {
        users = yield prisma.user.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: sortBy === "role"
                ? {
                    [sortBy]: { roleName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            where: Object.assign({}, whereFilter),
            include: {
                orders: true,
                role: true,
            },
        });
    }
    else {
        users = yield prisma.user.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: sortBy === "role"
                ? {
                    [sortBy]: { roleName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            include: {
                orders: true,
                role: true,
            },
        });
    }
    return users;
});
exports.findUserInRange = findUserInRange;
const findLengthOfUsers = (sortUser, searchUser, filterUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let userLength;
    // เกี่ยวกับการ sort
    const sortBy = sortUser.split(",")[0];
    const sortType = sortUser.split(",")[1];
    // เกี่ยวกับการ search
    let whereSearch;
    if (isNaN(Number(searchUser))) {
        whereSearch = {
            OR: [
                { firstName: { contains: searchUser } },
                { lastName: { contains: searchUser } },
            ],
        };
    }
    else {
        whereSearch = {
            id: Number(searchUser),
        };
    }
    // เกี่ยวกับการ filter
    let whereFilter = {};
    if (filterUser && filterUser.role.all === "false") {
        const role = {
            role: {
                OR: (_a = filterUser === null || filterUser === void 0 ? void 0 : filterUser.role.value) === null || _a === void 0 ? void 0 : _a.map((role) => ({
                    roleName: role,
                })),
            },
        };
        whereFilter = Object.assign(Object.assign({}, whereFilter), role);
    }
    if (searchUser !== "" && Object.keys(whereFilter).length !== 0) {
        userLength = yield prisma.user.aggregate({
            orderBy: sortBy === "role"
                ? {
                    [sortBy]: { roleName: sortType },
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
    else if (searchUser !== "" && Object.keys(whereFilter).length === 0) {
        userLength = yield prisma.user.aggregate({
            orderBy: sortBy === "role"
                ? {
                    [sortBy]: { roleName: sortType },
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
    else if (searchUser === "" && Object.keys(whereFilter).length !== 0) {
        userLength = yield prisma.user.aggregate({
            orderBy: sortBy === "role"
                ? {
                    [sortBy]: { roleName: sortType },
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
        userLength = yield prisma.user.aggregate({
            orderBy: sortBy === "role"
                ? {
                    [sortBy]: { roleName: sortType },
                }
                : {
                    [sortBy]: sortType,
                },
            _count: {
                _all: true,
            },
        });
    }
    return userLength;
});
exports.findLengthOfUsers = findLengthOfUsers;
const createAddress = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, streetAddress, subDistrict, district, province, postalCode, userId, } = data;
    let address;
    if (userId !== 0) {
        address = yield prisma.address.create({
            data: {
                phoneNumber,
                streetAddress,
                subDistrict,
                district,
                province,
                postalCode,
                userId,
            },
        });
    }
    return address;
});
exports.createAddress = createAddress;
const editAddress = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { selectedAddress, editType, editContent } = data;
    if (typeof selectedAddress === "number" &&
        typeof editType === "string" &&
        typeof editContent === "string") {
        const address = prisma.address.update({
            where: {
                id: selectedAddress,
            },
            data: {
                [editType]: editContent,
            },
        });
        return address;
    }
});
exports.editAddress = editAddress;
const deleteAddress = (addressId) => __awaiter(void 0, void 0, void 0, function* () {
    // ไม่ได้ลบจริง แต่เปลี่ยนค่า isActive จาก true -> false
    yield prisma.address.update({
        where: {
            id: addressId,
        },
        data: {
            isActive: false,
        },
    });
});
exports.deleteAddress = deleteAddress;
const findAddressByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const address = yield prisma.address.findMany({
        where: {
            userId,
            isActive: true,
        },
    });
    return address;
});
exports.findAddressByUserId = findAddressByUserId;
const findUserByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true,
            role: {
                select: {
                    roleName: true,
                },
            },
            addresses: true,
            reviews: true,
            FavoriteItem: true,
            isActive: true,
        },
    });
    return user;
});
exports.findUserByUserId = findUserByUserId;
const editUserService = (userId, editType, editContent) => __awaiter(void 0, void 0, void 0, function* () {
    let editData;
    if (editType === "firstName" ||
        editType === "lastName" ||
        editType === "email") {
        editData = {
            [editType]: editContent,
        };
    }
    if (editType === "imageUrl") {
        editData = {
            profileImage: editContent,
        };
    }
    if (editType === "role") {
        editData = {
            roleId: editContent === "customer" ? 1 : editContent === "admin" ? 2 : 3,
        };
    }
    const product = yield prisma.user.update({
        where: {
            id: userId,
        },
        data: editData,
        select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            role: {
                select: {
                    roleName: true,
                },
            },
            addresses: true,
            reviews: true,
            FavoriteItem: true,
            isActive: true,
        },
    });
    return product;
});
exports.editUserService = editUserService;
const deleteUserService = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive: status === "delete" ? false : true,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            isActive: true,
            addresses: true,
            FavoriteItem: true,
            reviews: true,
            role: true,
        },
    });
    return user;
});
exports.deleteUserService = deleteUserService;
const changePasswordService = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptedPassword = yield (0, userUtility_1.encryptPassword)(newPassword);
    const user = yield prisma.user.update({
        where: {
            email,
        },
        data: {
            password: encryptedPassword,
        },
        select: {
            id: true,
            email: true,
        },
    });
    return user;
});
exports.changePasswordService = changePasswordService;
const addFavoriteItemService = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma.favoriteItem.create({
        data: {
            productId,
            userId,
        },
    });
    return product;
});
exports.addFavoriteItemService = addFavoriteItemService;
const deleteFavoriteItemService = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma.favoriteItem.delete({
        where: {
            productId_userId: {
                productId,
                userId,
            },
        },
    });
    return product;
});
exports.deleteFavoriteItemService = deleteFavoriteItemService;
const checkFavoriteItemService = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield prisma.favoriteItem.findMany({
        where: {
            productId,
            userId,
        },
    });
    return check;
});
exports.checkFavoriteItemService = checkFavoriteItemService;
const findAllMyFavoriteItemService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.favoriteItem.findMany({
        where: {
            userId,
        },
        select: {
            Product: {
                select: {
                    id: true,
                    imageUrl: true,
                    productName: true,
                    brand: {
                        select: {
                            name: true,
                        },
                    },
                    type: {
                        select: {
                            typeName: true,
                        },
                    },
                },
            },
        },
    });
    return products;
});
exports.findAllMyFavoriteItemService = findAllMyFavoriteItemService;
