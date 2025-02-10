import { Router } from "express";
import { productValidation } from "../validations/productValidation";
import {
  create,
  getAllProducts,
  getProductById,
  getAllBrand,
  getAllType,
  getProductByName,
  editProduct,
  deleteProduct,
  ghostController,
  getAllOptionName,
  getFiveMostViewProduct,
  incrementViewCount,
  createReview,
  canUserReview,
  getAllReviewByProductId,
  getProductsInRange,
  getTopSellerProduct,
} from "../controllers/productController";
import { verify } from "../middlewares/adminVerify";

const router = Router();

router.get("/product-by-id", getProductById);
router.get("/product-by-name", getProductByName);
router.get("/most-view-product", getFiveMostViewProduct);
router.get("/get-top-seller", getTopSellerProduct);
router.patch("/increment-view-count", incrementViewCount);
router.get("/", getAllProducts);
router.get("/product-in-range", getProductsInRange);
router.get("/:category", getAllProducts);
router.post("/create", productValidation, create);
router.patch("/edit", verify, editProduct);
router.delete("/delete-product", deleteProduct);

// ใช้ดึง brand และ type ทั้งหมดว่ามีอะไรบ้าง
router.get("/product/get-brands", getAllBrand);
router.get("/product/get-types", getAllType);
router.get("/product/get-option-names", getAllOptionName);

// จัดการเรื่อง review ของ product
router.post("/review/create-review", createReview);
router.get("/review/can-review", canUserReview);
router.get("/review/get-review-by-product-id", getAllReviewByProductId);

router.get("/test/ghost-route", ghostController);
export default router;
