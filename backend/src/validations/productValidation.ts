import { Request, Response, NextFunction } from "express";
import { findSpecificProduct } from "../services/productService";

export const productValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productName, brand, type, price, imageUrl, description } = req.body;

  if (!(productName && brand && type && price && imageUrl && description)) {
    res.status(400).json({ error: "All input fields are required." });
    return;
  }

  const existedProduct = await findSpecificProduct(req.body);

  if (existedProduct) {
    res.status(400).json({ error: "This product has already been created." });
    return;
  }
  next();
};
