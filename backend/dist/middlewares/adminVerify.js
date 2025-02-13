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
exports.verify = void 0;
const userUtility_1 = require("../utils/userUtility");
const adminService_1 = require("../services/adminService");
// export type CustomRequest = Request & { admin: { id: number } };
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }
        const decoded = yield (0, userUtility_1.verifyToken)(token);
        if (typeof decoded === "object") {
            const admin = yield (0, adminService_1.isAdmin)(decoded.id);
            const role = admin === null || admin === void 0 ? void 0 : admin.role.roleName;
            if (role !== "admin" && role !== "manager") {
                res.status(400).json({ error: "This account isn't admin" });
                return;
            }
        }
        // (req as CustomRequest).admin = decoded as any;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
});
exports.verify = verify;
