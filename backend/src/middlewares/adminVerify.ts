import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/userUtility";
import { isAdmin } from "../services/adminService";

// export type CustomRequest = Request & { admin: { id: number } };

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

    if (typeof decoded === "object") {
      const admin = await isAdmin(decoded.id);

      const role = admin?.role.roleName;

      if (role !== "admin" && role !== "manager") {
        res.status(400).json({ error: "This account isn't admin" });
        return;
      }
    }

    // (req as CustomRequest).admin = decoded as any;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
