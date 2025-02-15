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
exports.verifyToken = exports.createToken = exports.verifyPassword = exports.encryptPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ใช้ encryption ของ password ด้วย bcrypt
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
    return encryptedPassword;
});
exports.encryptPassword = encryptPassword;
// ใช้การตรวจสอบ password ด้วย bcrypt
const verifyPassword = (password, encryptedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedStatus = yield bcrypt_1.default.compare(password, encryptedPassword);
    return verifiedStatus;
});
exports.verifyPassword = verifyPassword;
// ใช้สร้าง token ด้วย jsonwebtoken
const createToken = (userId, roleId) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ id: userId, roleId: roleId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d",
    });
    return token;
});
exports.createToken = createToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    return decode;
});
exports.verifyToken = verifyToken;
