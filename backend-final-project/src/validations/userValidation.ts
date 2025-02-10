import { NextFunction, Request, Response } from "express";
import { findUserForLogin, findUserForRegister } from "../services/userService";
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

  const existedUser = await findUserForRegister(email);
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

  if (!(email && password)) {
    res.status(400).json({ error: "All input fields are required." });
    return;
  }

  const user = await findUserForLogin(email);

  if (!user) {
    res.status(404).json({ error: "Incorrect email or password." });
    return;
  }

  const verifiedStatus = await verifyPassword(password, user!.password);

  if (!verifiedStatus) {
    res.status(400).json({ error: "Incorrect email or password." });
    return;
  }

  (req as any).user = {
    id: user.id,
    roleId: user.roleId,
  };
  next();
};
