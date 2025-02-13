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
exports.loginValidation = exports.registerValidation = void 0;
const adminService_1 = require("../services/adminService");
const userUtility_1 = require("../utils/userUtility");
const registerValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    if (!(firstName && lastName && email && password)) {
        res.status(400).json({ error: "All input fields are required." });
        return;
    }
    const existedUser = yield (0, adminService_1.findAdminForRegister)(email);
    if (existedUser) {
        res.status(400).json({ error: "This email already in used." });
        return;
    }
    next();
});
exports.registerValidation = registerValidation;
const loginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    if (!(email && password)) {
        res.status(400).json({ error: "All input fields are required." });
        return;
    }
    const admin = yield (0, adminService_1.findAdminForLogin)(email);
    if (!(admin && admin.role.roleName !== "admin")) {
        res.status(404).json({ error: "Admin not found" });
        return;
    }
    const verifiedStatus = (0, userUtility_1.verifyPassword)(password, admin.password);
    if (!verifiedStatus) {
        res.status(400).json({ message: "Incorect email or password." });
    }
    req.admin = {
        id: admin.id,
    };
    next();
});
exports.loginValidation = loginValidation;
