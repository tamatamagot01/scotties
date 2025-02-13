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
const userService_1 = require("../services/userService");
const userUtility_1 = require("../utils/userUtility");
const registerValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    if (!(firstName && lastName && email && password)) {
        res.status(400).json({ error: "All input fields are required." });
        return;
    }
    const existedUser = yield (0, userService_1.findUserForRegister)(email);
    if (existedUser) {
        res.status(400).json({ error: "This email already in used." });
        return;
    }
    next();
});
exports.registerValidation = registerValidation;
const loginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!(email && password)) {
        res.status(400).json({ error: "All input fields are required." });
        return;
    }
    const user = yield (0, userService_1.findUserForLogin)(email);
    if (!user) {
        res.status(404).json({ error: "Incorrect email or password." });
        return;
    }
    const verifiedStatus = yield (0, userUtility_1.verifyPassword)(password, user.password);
    if (!verifiedStatus) {
        res.status(400).json({ error: "Incorrect email or password." });
        return;
    }
    req.user = {
        id: user.id,
        roleId: user.roleId,
    };
    next();
});
exports.loginValidation = loginValidation;
