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
exports.isAdmin = exports.findAdminForLogin = exports.findAdminForRegister = exports.createAdmin = void 0;
const client_1 = require("@prisma/client");
const userUtility_1 = require("../utils/userUtility");
const prisma = new client_1.PrismaClient();
const createAdmin = (adminData) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptedPassword = yield (0, userUtility_1.encryptPassword)(adminData.password);
    const admin = yield prisma.user.create({
        data: Object.assign(Object.assign({}, adminData), { password: encryptedPassword, role: {
                create: {
                    roleName: "admin",
                },
            } }),
        select: {
            id: true,
            firstName: true,
            email: true,
        },
    });
    return admin;
});
exports.createAdmin = createAdmin;
const findAdminForRegister = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
        },
    });
    return admin;
});
exports.findAdminForRegister = findAdminForRegister;
const findAdminForLogin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            role: {
                select: {
                    roleName: true,
                },
            },
            password: true,
        },
    });
    return admin;
});
exports.findAdminForLogin = findAdminForLogin;
const isAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            role: {
                select: {
                    roleName: true,
                },
            },
        },
    });
    return admin;
});
exports.isAdmin = isAdmin;
