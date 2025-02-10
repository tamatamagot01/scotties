import { Router } from "express";
import { create, find } from "../controllers/assetController";
import { verify } from "../middlewares/verify";

const router = Router();

router.post("/", verify, create);
router.get("/", find);

export default router;
