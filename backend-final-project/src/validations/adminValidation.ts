import { Request, Response, NextFunction } from "express";
import {
  findAdminForLogin,
  findAdminForRegister,
} from "../services/adminService";
import { verifyPassword } from "../utils/userUtility";

export const registerValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password } = req.body;

  if (!(firstName && lastName && email && password)) {
    res.status(400).json({ error: "All input fields are required." });
    return;
  }

  const existedUser = await findAdminForRegister(email);
  if (existedUser) {
    res.status(400).json({ error: "This email already in used." });
    return;
  }
  next();
};

export const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  console.log(email, password);

  if (!(email && password)) {
    res.status(400).json({ error: "All input fields are required." });
    return;
  }

  const admin = await findAdminForLogin(email);

  if (!(admin && admin.role.roleName !== "admin")) {
    res.status(404).json({ error: "Admin not found" });
    return;
  }

  const verifiedStatus = verifyPassword(password, admin.password);

  if (!verifiedStatus) {
    res.status(400).json({ message: "Incorect email or password." });
  }

  (req as any).admin = {
    id: admin.id,
  };

  next();
};
