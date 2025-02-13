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
exports.productValidation = void 0;
const productService_1 = require("../services/productService");
const productValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, brand, type, price, imageUrl, description } = req.body;
    if (!(productName && brand && type && price && imageUrl && description)) {
        res.status(400).json({ error: "All input fields are required." });
        return;
    }
    const existedProduct = yield (0, productService_1.findSpecificProduct)(req.body);
    if (existedProduct) {
        res.status(400).json({ error: "This product has already been created." });
        return;
    }
    next();
});
exports.productValidation = productValidation;
