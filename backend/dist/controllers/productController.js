"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ghostController = exports.getAllReviewByProductId = exports.canUserReview = exports.createReview = exports.incrementViewCount = exports.deleteProduct = exports.editProduct = exports.getAllOptionName = exports.getAllType = exports.getAllBrand = exports.getTopSellerProduct = exports.getFiveMostViewProduct = exports.getProductByName = exports.getProductById = exports.getProductsInRange = exports.getAllProducts = exports.create = void 0;
const productService_1 = require("../services/productService");
const userUtility_1 = require("../utils/userUtility");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield (0, productService_1.createProduct)(req.body);
        res.status(201).json({ message: "New product has been created", product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.create = create;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        if (category) {
            const brand = yield (0, productService_1.findBrandId)(category);
            const type = yield (0, productService_1.findTypeId)(category);
            if (brand) {
                const products = yield (0, productService_1.findAllProducts)({ brand: brand.id }, undefined);
                res.status(200).json(products);
                return;
            }
            if (type) {
                const products = yield (0, productService_1.findAllProducts)({ type: type.id }, undefined);
                res.status(200).json(products);
                return;
            }
        }
        const filter = req.query;
        const products = yield (0, productService_1.findAllProducts)(undefined, filter);
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllProducts = getAllProducts;
const getProductsInRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, sortProduct, searchProduct, filterProduct } = req.query;
        const products = yield (0, productService_1.findProductInRange)(Number(page), String(sortProduct), String(searchProduct), filterProduct);
        const countProducts = yield (0, productService_1.findLengthOfProducts)(String(sortProduct), String(searchProduct), filterProduct);
        res.status(200).json({ products, countProducts });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getProductsInRange = getProductsInRange;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.query;
        // ใช้ดักกรณีใส่ productId มาเป็น (อักษรผสมตัวเลข เช่น 12aBc)
        if (!Boolean(Number(productId))) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }
        // ดึง product มาจาก service
        const product = yield (0, productService_1.findProductById)(productId);
        // กรณีหา product ไม่เจอ (อาจจะเพราะ productId ไม่มีอยู่) จะ res error message ออกไป
        if (!product) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getProductById = getProductById;
const getProductByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nameFilter } = req.query;
        if (typeof nameFilter !== "string") {
            res.status(400).json({ error: "Invalid product name" });
            return;
        }
        const products = yield (0, productService_1.findProductByName)(nameFilter);
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getProductByName = getProductByName;
const getFiveMostViewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.query;
        if (!category) {
            res.status(500).json({ error: "Error to get product" });
        }
        const products = yield (0, productService_1.findFiveMostViewProduct)(category);
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error to get product", error);
        res.status(500).json({ error: "Error to get product" });
    }
});
exports.getFiveMostViewProduct = getFiveMostViewProduct;
const getTopSellerProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, productService_1.findFiveTopSellerProduct)();
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error to get product", error);
        res.status(500).json({ error: "Error to get product" });
    }
});
exports.getTopSellerProduct = getTopSellerProduct;
const getAllBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield (0, productService_1.brandList)();
        res.status(200).json(brands);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllBrand = getAllBrand;
const getAllType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield (0, productService_1.typeList)();
        res.status(200).json(types);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllType = getAllType;
const getAllOptionName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { typeName } = req.query;
        if (typeof typeName === "string") {
            const optionNames = yield (0, productService_1.optionNameList)(typeName);
            res.status(200).json(optionNames);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllOptionName = getAllOptionName;
const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, editType, editContent } = req.body;
        if ((editType === "brand" || editType === "type") && editContent === "") {
            res.status(400).json({ error: "Please select brand or type" });
            return;
        }
        if (editContent === "") {
            res.status(400).json({ error: "Please fill edit content" });
            return;
        }
        const editedProduct = yield (0, productService_1.editProductService)(Number(productId), editType, editContent);
        res
            .status(200)
            .json({ message: "This product has been edited!", editedProduct });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.editProduct = editProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, status } = req.query;
        const numberProductId = Number(productId);
        const deletedProduct = yield (0, productService_1.deleteProductService)(numberProductId, status);
        if (deletedProduct.isActive === false) {
            res
                .status(200)
                .json({ message: "Successful delete product", deletedProduct });
        }
        else {
            res
                .status(200)
                .json({ message: "Available this product", deletedProduct });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.deleteProduct = deleteProduct;
const incrementViewCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        yield (0, productService_1.incrementViewCountService)(Number(productId));
        res.status(200).json({ message: "Successful increment view count" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.incrementViewCount = incrementViewCount;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield (0, productService_1.createReviewService)(req.body);
        res.status(200).json(review);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.createReview = createReview;
const canUserReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const productId = req.query.product_id;
        if (!token) {
            res.status(400).json({ error: "No token provide" });
            return;
        }
        const user = yield (0, userUtility_1.verifyToken)(token);
        if (user && productId && !isNaN(Number(productId))) {
            const orderItem = yield (0, productService_1.canUserReviewService)(user.id, Number(productId));
            if (orderItem.length > 0) {
                const hasReview = yield (0, productService_1.findReview)(user.id, Number(productId));
                if (hasReview) {
                    res
                        .status(400)
                        .json({ error: "This user already create the review" });
                }
                else {
                    res.status(200).json(orderItem);
                }
            }
            else {
                res.status(404).json({ error: "You never buy this product" });
            }
        }
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.canUserReview = canUserReview;
const getAllReviewByProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.query.product_id;
        const reviews = yield (0, productService_1.findAllReviewsByProductId)(Number(productId));
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error("Error from Internal Server", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllReviewByProductId = getAllReviewByProductId;
const ghostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield (0, productService_1.ghostService)();
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});
exports.ghostController = ghostController;
