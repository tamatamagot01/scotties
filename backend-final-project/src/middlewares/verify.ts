import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/userUtility";

export type CustomRequest = Request & { user: { id: number } };

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = await verifyToken(token);

    (req as CustomRequest).user = decoded as any;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
