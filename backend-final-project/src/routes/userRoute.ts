import { Router } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validations/userValidation";
import { login, register } from "../controllers/userController";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

export default router;
