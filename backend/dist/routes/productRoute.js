"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productValidation_1 = require("../validations/productValidation");
const productController_1 = require("../controllers/productController");
const adminVerify_1 = require("../middlewares/adminVerify");
const router = (0, express_1.Router)();
router.get("/product-by-id", productController_1.getProductById);
router.get("/product-by-name", productController_1.getProductByName);
router.get("/most-view-product", productController_1.getFiveMostViewProduct);
router.get("/get-top-seller", productController_1.getTopSellerProduct);
router.patch("/increment-view-count", productController_1.incrementViewCount);
router.get("/", productController_1.getAllProducts);
router.get("/product-in-range", productController_1.getProductsInRange);
router.get("/:category", productController_1.getAllProducts);
router.post("/create", productValidation_1.productValidation, productController_1.create);
router.patch("/edit", adminVerify_1.verify, productController_1.editProduct);
router.delete("/delete-product", productController_1.deleteProduct);
// ใช้ดึง brand และ type ทั้งหมดว่ามีอะไรบ้าง
router.get("/product/get-brands", productController_1.getAllBrand);
router.get("/product/get-types", productController_1.getAllType);
router.get("/product/get-option-names", productController_1.getAllOptionName);
// จัดการเรื่อง review ของ product
router.post("/review/create-review", productController_1.createReview);
router.get("/review/can-review", productController_1.canUserReview);
router.get("/review/get-review-by-product-id", productController_1.getAllReviewByProductId);
router.get("/test/ghost-route", productController_1.ghostController);
exports.default = router;
