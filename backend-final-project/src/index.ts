import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute";
import memberRouter from "./routes/memberRoute";
import assetRoute from "./routes/assetRoute";
import productRoute from "./routes/productRoute";
import orderRoute from "./routes/orderRoute";
import paymentRoute from "./routes/paymentRoute";
import cors from "cors";

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:3000", // อนุญาตเฉพาะ request จาก frontend ของเรา
  })
);

const prefix = "/backend/api";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(`${prefix}/user`, userRouter); // จัดการการ login, register ทั้งฝั่ง user, admin, manager ในที่นี้
app.use(`${prefix}/member`, memberRouter);
app.use(`${prefix}/product`, productRoute);
app.use(`${prefix}/order`, orderRoute);
app.use(`${prefix}/checkout`, paymentRoute);

// เส้นนี้ไว้ใช้เพิ่มและดึงของตกแต่ง website
app.use("/asset", assetRoute);

app.listen(port, () => {
  console.log(`This server is running on port ${port}`);
});
