"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const memberRoute_1 = __importDefault(require("./routes/memberRoute"));
const assetRoute_1 = __importDefault(require("./routes/assetRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const paymentRoute_1 = __importDefault(require("./routes/paymentRoute"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)({
    origin: "*",
}));
const prefix = "/backend/api";
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(`${prefix}/user`, userRoute_1.default); // จัดการการ login, register ทั้งฝั่ง user, admin, manager ในที่นี้
app.use(`${prefix}/member`, memberRoute_1.default);
app.use(`${prefix}/product`, productRoute_1.default);
app.use(`${prefix}/order`, orderRoute_1.default);
app.use(`${prefix}/checkout`, paymentRoute_1.default);
// เส้นนี้ไว้ใช้เพิ่มและดึงของตกแต่ง website
app.use(`${prefix}/asset`, assetRoute_1.default);
app.listen(port, () => {
    console.log(`This server is running on port ${port}`);
});
