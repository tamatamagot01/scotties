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
exports.ghostService = exports.updateProductTotalSale = exports.updateProductOptionTotalSale = exports.findAllReviewsByProductId = exports.findReview = exports.canUserReviewService = exports.createReviewService = exports.incrementViewCountService = exports.deleteProductService = exports.editProductService = exports.updateProductAfterSold = exports.optionNameList = exports.typeList = exports.brandList = exports.findTypeId = exports.findBrandId = exports.findFiveTopSellerProduct = exports.findFiveMostViewProduct = exports.findProductByName = exports.findProductById = exports.findLengthOfProducts = exports.findProductInRange = exports.findAllProducts = exports.findSpecificProduct = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, brand, type, price, options, imageUrl, description } = productData;
    const brandId = yield (0, exports.findBrandId)(brand);
    const typeId = yield (0, exports.findTypeId)(type);
    if (!brandId || !typeId) {
        throw new Error("Brand or Type not found");
    }
    const product = yield prisma.product.create({
        data: {
            productName,
            description,
            typeId: typeId.id,
            brandId: brandId.id,
            price: Number(price),
            imageUrl,
        },
    });
    for (let key in options) {
        yield prisma.productOption.create({
            data: {
                optionName: key,
                quantity: options[key],
                productId: product.id,
            },
        });
    }
    return product;
});
exports.createProduct = createProduct;
const findSpecificProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, imageUrl } = productData;
    const product = yield prisma.product.findFirst({
        where: {
            OR: [{ productName }, { imageUrl }],
        },
    });
    return product;
});
exports.findSpecificProduct = findSpecificProduct;
const findAllProducts = (category, filter) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let whereFilter = {};
    // ใช้หา data จาก path params ที่ส่งมา
    if (typeof category === "object") {
        const categoryKey = Object.keys(category)[0];
        if (categoryKey === "brand") {
            whereFilter = {
                brand: {
                    id: category.brand,
                },
            };
        }
        if (categoryKey === "type") {
            whereFilter = {
                type: {
                    id: category.type,
                },
            };
        }
    }
    // ใช้หา data จาก filter ที่ส่งมา
    const brandFilter = (_a = filter === null || filter === void 0 ? void 0 : filter.brand) === null || _a === void 0 ? void 0 : _a.map((brand) => ({
        name: brand,
    }));
    const typeFilter = (_b = filter === null || filter === void 0 ? void 0 : filter.type) === null || _b === void 0 ? void 0 : _b.map((type) => ({
        typeName: type,
    }));
    if (brandFilter) {
        whereFilter = {
            brand: {
                OR: brandFilter,
            },
        };
    }
    if (typeFilter) {
        whereFilter = {
            type: {
                OR: typeFilter,
            },
        };
    }
    if (brandFilter && typeFilter) {
        whereFilter = {
            brand: {
                OR: brandFilter,
            },
            type: {
                OR: typeFilter,
            },
        };
    }
    const products = yield prisma.product.findMany({
        where: whereFilter,
        select: {
            productName: true,
            type: true,
            brand: {
                select: {
                    name: true,
                },
            },
            price: true,
            imageUrl: true,
            id: true,
        },
    });
    return products;
});
exports.findAllProducts = findAllProducts;
const findProductInRange = (page, sortProduct, searchProduct, filterProduct) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let products;
    const takeItems = 15;
    const skipItems = (page - 1) * takeItems;
    // เกี่ยวกับการ sort
    const sortBy = sortProduct.split(",")[0];
    const sortType = sortProduct.split(",")[1];
    // เกี่ยวกับการ search
    let whereSearch;
    if (isNaN(Number(searchProduct))) {
        whereSearch = {
            productName: {
                contains: searchProduct,
            },
        };
    }
    else {
        whereSearch = {
            id: Number(searchProduct),
        };
    }
    // เกี่ยวกับการ filter
    let whereFilter = {};
    if (filterProduct && filterProduct.brand.all === "false") {
        const brand = {
            brand: {
                OR: (_a = filterProduct === null || filterProduct === void 0 ? void 0 : filterProduct.brand.value) === null || _a === void 0 ? void 0 : _a.map((brand) => ({
                    name: brand,
                })),
            },
        };
        whereFilter = Object.assign({}, brand);
    }
    if (filterProduct && filterProduct.type.all === "false") {
        const type = {
            type: {
                OR: (_b = filterProduct === null || filterProduct === void 0 ? void 0 : filterProduct.type.value) === null || _b === void 0 ? void 0 : _b.map((type) => ({
                    typeName: type,
                })),
            },
        };
        whereFilter = Object.assign(Object.assign({}, whereFilter), type);
    }
    if (filterProduct && filterProduct.price.all === "false") {
        const checkPriceFilter = (_c = filterProduct.price.value) === null || _c === void 0 ? void 0 : _c.map((price) => {
            if (price === "< 3000") {
                return { price: { lte: 3000 } };
            }
            if (price === "3001 - 5000") {
                return { price: { gte: 3001, lte: 5000 } };
            }
            if (price === "5001 - 7000") {
                return { price: { gte: 5001, lte: 7000 } };
            }
            if (price === "7001 - 10000") {
                return { price: { gte: 7001, lt: 10000 } };
            }
            if (price === "> 10000") {
                return { price: { gte: 10000 } };
            }
        });
        const price = {
            OR: checkPriceFilter,
        };
        whereFilter = Object.assign(Object.assign({}, whereFilter), price);
    }
    if (filterProduct && filterProduct.totalSales.all === "false") {
        const checkTotalSalesFilter = (_d = filterProduct.totalSales.value) === null || _d === void 0 ? void 0 : _d.map((totalSale) => {
            if (totalSale === "< 10") {
                return { totalSales: { lte: 10 } };
            }
            if (totalSale === "11 - 50") {
                return { totalSales: { gte: 11, lte: 50 } };
            }
            if (totalSale === "51 - 100") {
                return { totalSales: { gte: 51, lte: 100 } };
            }
            if (totalSale === "> 100") {
                return { totalSales: { gte: 101 } };
            }
        });
        const totalSales = {
            OR: checkTotalSalesFilter,
        };
        whereFilter = Object.assign(Object.assign({}, whereFilter), totalSales);
    }
    if (searchProduct !== "" && Object.keys(whereFilter).length !== 0) {
        products = yield prisma.product.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: {
                [sortBy]: sortType,
            },
            where: Object.assign(Object.assign({}, whereSearch), whereFilter),
            include: {
                brand: true,
                type: true,
                productOptions: true,
            },
        });
    }
    else if (searchProduct !== "" && Object.keys(whereFilter).length === 0) {
        products = yield prisma.product.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: {
                [sortBy]: sortType,
            },
            where: Object.assign({}, whereSearch),
            include: {
                brand: true,
                type: true,
                productOptions: true,
            },
        });
    }
    else if (searchProduct === "" && Object.keys(whereFilter).length !== 0) {
        products = yield prisma.product.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: {
                [sortBy]: sortType,
            },
            where: Object.assign({}, whereFilter),
            include: {
                brand: true,
                type: true,
                productOptions: true,
            },
        });
    }
    else {
        products = yield prisma.product.findMany({
            take: takeItems,
            skip: skipItems,
            orderBy: {
                [sortBy]: sortType,
            },
            include: {
                brand: true,
                type: true,
                productOptions: true,
            },
        });
    }
    return products;
});
exports.findProductInRange = findProductInRange;
const findLengthOfProducts = (sortProduct, searchProduct, filterProduct) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let productLength;
    // เกี่ยวกับการ sort
    const sortBy = sortProduct.split(",")[0];
    const sortType = sortProduct.split(",")[1];
    // เกี่ยวกับการ search
    let whereSearch;
    if (isNaN(Number(searchProduct))) {
        whereSearch = {
            productName: {
                contains: searchProduct,
            },
        };
    }
    else {
        whereSearch = {
            id: Number(searchProduct),
        };
    }
    // เกี่ยวกับการ filter
    let whereFilter = {};
    if (filterProduct && filterProduct.brand.all === "false") {
        const brand = {
            brand: {
                OR: (_a = filterProduct === null || filterProduct === void 0 ? void 0 : filterProduct.brand.value) === null || _a === void 0 ? void 0 : _a.map((brand) => ({
                    name: brand,
                })),
            },
        };
        whereFilter = Object.assign({}, brand);
    }
    if (filterProduct && filterProduct.type.all === "false") {
        const type = {
            type: {
                OR: (_b = filterProduct === null || filterProduct === void 0 ? void 0 : filterProduct.type.value) === null || _b === void 0 ? void 0 : _b.map((type) => ({
                    typeName: type,
                })),
            },
        };
        whereFilter = Object.assign(Object.assign({}, whereFilter), type);
    }
    if (filterProduct && filterProduct.price.all === "false") {
        const checkPriceFilter = (_c = filterProduct.price.value) === null || _c === void 0 ? void 0 : _c.map((price) => {
            if (price === "< 3000") {
                return { price: { lte: 3000 } };
            }
            if (price === "3001 - 5000") {
                return { price: { gte: 3001, lte: 5000 } };
            }
            if (price === "5001 - 7000") {
                return { price: { gte: 5001, lte: 7000 } };
            }
            if (price === "7001 - 10000") {
                return { price: { gte: 7001, lt: 10000 } };
            }
            if (price === "> 10000") {
                return { price: { gte: 10000 } };
            }
        });
        const price = {
            OR: checkPriceFilter,
        };
        whereFilter = Object.assign(Object.assign({}, whereFilter), price);
    }
    if (filterProduct && filterProduct.totalSales.all === "false") {
        const checkTotalSalesFilter = (_d = filterProduct.totalSales.value) === null || _d === void 0 ? void 0 : _d.map((totalSale) => {
            if (totalSale === "< 10") {
                return { totalSales: { lte: 10 } };
            }
            if (totalSale === "11 - 50") {
                return { totalSales: { gte: 11, lte: 50 } };
            }
            if (totalSale === "51 - 100") {
                return { totalSales: { gte: 51, lte: 100 } };
            }
            if (totalSale === "> 100") {
                return { totalSales: { gte: 101 } };
            }
        });
        const totalSales = {
            OR: checkTotalSalesFilter,
        };
        whereFilter = Object.assign(Object.assign({}, whereFilter), totalSales);
    }
    if (searchProduct !== "" && Object.keys(whereFilter).length !== 0) {
        productLength = yield prisma.product.aggregate({
            orderBy: {
                [sortBy]: sortType,
            },
            where: Object.assign(Object.assign({}, whereSearch), whereFilter),
            _count: {
                _all: true,
            },
        });
    }
    else if (searchProduct !== "" && Object.keys(whereFilter).length === 0) {
        productLength = yield prisma.product.aggregate({
            orderBy: {
                [sortBy]: sortType,
            },
            where: Object.assign({}, whereSearch),
            _count: {
                _all: true,
            },
        });
    }
    else if (searchProduct === "" && Object.keys(whereFilter).length !== 0) {
        productLength = yield prisma.product.aggregate({
            orderBy: {
                [sortBy]: sortType,
            },
            where: Object.assign({}, whereFilter),
            _count: {
                _all: true,
            },
        });
    }
    else {
        productLength = yield prisma.product.aggregate({
            orderBy: {
                [sortBy]: sortType,
            },
            _count: {
                _all: true,
            },
        });
    }
    return productLength;
});
exports.findLengthOfProducts = findLengthOfProducts;
const findProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma.product.findUnique({
        where: {
            id: Number(id),
        },
        select: {
            id: true,
            brand: true,
            type: true,
            productName: true,
            description: true,
            imageUrl: true,
            price: true,
            productOptions: {
                select: {
                    id: true,
                    optionName: true,
                    quantity: true,
                },
            },
            isActive: true,
        },
    });
    return product;
});
exports.findProductById = findProductById;
const findProductByName = (nameFilter) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.product.findMany({
        where: {
            productName: {
                contains: nameFilter,
            },
        },
        select: {
            id: true,
            productName: true,
            imageUrl: true,
            brand: {
                select: {
                    name: true,
                },
            },
            price: true,
        },
    });
    return products;
});
exports.findProductByName = findProductByName;
const findFiveMostViewProduct = (productType) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.product.findMany({
        where: {
            type: {
                typeName: productType,
            },
        },
        take: 5,
        orderBy: {
            viewCount: "desc",
        },
        select: {
            productName: true,
            brand: {
                select: {
                    name: true,
                },
            },
            imageUrl: true,
            price: true,
            type: {
                select: {
                    typeName: true,
                },
            },
            id: true,
            viewCount: true,
        },
    });
    return products;
});
exports.findFiveMostViewProduct = findFiveMostViewProduct;
const findFiveTopSellerProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.product.findMany({
        orderBy: {
            totalSales: "desc",
        },
        take: 5,
    });
    return products;
});
exports.findFiveTopSellerProduct = findFiveTopSellerProduct;
const findBrandId = (brandName) => __awaiter(void 0, void 0, void 0, function* () {
    const brandId = yield prisma.productBrand.findFirst({
        where: {
            name: brandName,
        },
        select: {
            id: true,
        },
    });
    return brandId;
});
exports.findBrandId = findBrandId;
const findTypeId = (typeName) => __awaiter(void 0, void 0, void 0, function* () {
    const typeId = yield prisma.productType.findFirst({
        where: {
            typeName: typeName,
        },
        select: {
            id: true,
        },
    });
    return typeId;
});
exports.findTypeId = findTypeId;
const brandList = () => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield prisma.productBrand.findMany({
        select: {
            name: true,
        },
    });
    return brands;
});
exports.brandList = brandList;
const typeList = () => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield prisma.productType.findMany({
        select: {
            typeName: true,
        },
    });
    return types;
});
exports.typeList = typeList;
const optionNameList = (typeName) => __awaiter(void 0, void 0, void 0, function* () {
    const optionNames = yield prisma.optionName.findMany({
        where: {
            useForType: {
                some: {
                    typeName,
                },
            },
        },
    });
    return optionNames;
});
exports.optionNameList = optionNameList;
const updateProductAfterSold = (productGroup) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(productGroup);
    if (productGroup) {
        const updatedProduct = productGroup.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            // ดึงจำนวนเดิมของ product นั้นๆก่อน
            const prevQuantity = yield prisma.productOption.findUnique({
                where: {
                    id: product.optionId,
                },
                select: {
                    id: true,
                    quantity: true,
                },
            });
            if (prevQuantity) {
                // นำจำนวนเดิมของ product มาลบกับจำนวนที่ลูกค้าซื้อ
                const newQuantity = yield prisma.productOption.update({
                    where: {
                        id: prevQuantity.id,
                    },
                    data: {
                        quantity: (prevQuantity === null || prevQuantity === void 0 ? void 0 : prevQuantity.quantity) - product.quantity,
                    },
                    select: {
                        id: true,
                        quantity: true,
                    },
                });
                return newQuantity;
            }
        }));
        return Promise.all(updatedProduct);
    }
});
exports.updateProductAfterSold = updateProductAfterSold;
const editProductService = (productId, editType, editContent) => __awaiter(void 0, void 0, void 0, function* () {
    let editData;
    if (editType === "productName" || editType === "description") {
        editData = {
            [editType]: editContent,
        };
    }
    if (editType === "price" || editType === "quantity") {
        editData = {
            [editType]: Number(editContent),
        };
    }
    if (editType === "brand") {
        const brandList = [
            { id: 1, name: "Adidas" },
            { id: 2, name: "Asics" },
            { id: 3, name: "Converse" },
            { id: 4, name: "Fila" },
            { id: 5, name: "Jordan" },
            { id: 6, name: "New-Balance" },
            { id: 7, name: "Nike" },
            { id: 8, name: "Puma" },
            { id: 9, name: "Reebok" },
            { id: 10, name: "Timberland" },
            { id: 11, name: "Vans" },
        ];
        const selectedBrand = brandList.find((brand) => brand.name === editContent);
        editData = {
            brandId: selectedBrand.id,
        };
    }
    if (editType === "type") {
        const typeList = [
            { id: 1, name: "Shoes" },
            { id: 2, name: "T-Shirt" },
            { id: 3, name: "Pants" },
            { id: 4, name: "Hoodies" },
            { id: 5, name: "Jacket" },
            { id: 6, name: "Acc" },
        ];
        const selectedType = typeList.find((type) => type.name === editContent);
        editData = {
            typeId: selectedType.id,
        };
    }
    if (editType === "quantity") {
        const addOrNew = editContent.split(" ")[0];
        const optionName = editContent.split(" ")[1];
        const quantity = Number(editContent.split(" ")[2]);
        if (addOrNew === "Add") {
            yield prisma.productOption.updateMany({
                where: {
                    productId,
                    optionName,
                },
                data: {
                    quantity: {
                        increment: quantity,
                    },
                },
            });
        }
        if (addOrNew === "New") {
            yield prisma.productOption.updateMany({
                where: {
                    productId,
                    optionName,
                },
                data: {
                    quantity,
                },
            });
        }
        const product = yield prisma.product.findUnique({
            where: {
                id: productId,
            },
            select: {
                brand: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                type: {
                    select: {
                        id: true,
                        typeName: true,
                    },
                },
                description: true,
                id: true,
                imageUrl: true,
                price: true,
                productName: true,
                productOptions: {
                    select: {
                        optionName: true,
                        quantity: true,
                    },
                },
                isActive: true,
            },
        });
        return product;
    }
    const product = yield prisma.product.update({
        where: {
            id: productId,
        },
        data: editData,
        select: {
            brand: {
                select: {
                    id: true,
                    name: true,
                },
            },
            type: {
                select: {
                    id: true,
                    typeName: true,
                },
            },
            description: true,
            id: true,
            imageUrl: true,
            price: true,
            productName: true,
            productOptions: {
                select: {
                    optionName: true,
                    quantity: true,
                },
            },
            isActive: true,
        },
    });
    return product;
});
exports.editProductService = editProductService;
const deleteProductService = (productId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            isActive: status === "delete" ? false : true,
        },
        select: {
            brand: {
                select: {
                    name: true,
                },
            },
            type: {
                select: {
                    typeName: true,
                },
            },
            description: true,
            id: true,
            imageUrl: true,
            price: true,
            productName: true,
            productOptions: {
                select: {
                    optionName: true,
                    quantity: true,
                },
            },
            isActive: true,
        },
    });
    return product;
});
exports.deleteProductService = deleteProductService;
const incrementViewCountService = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            viewCount: {
                increment: 1,
            },
        },
    });
});
exports.incrementViewCountService = incrementViewCountService;
const createReviewService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, reviewContent, ratingScore, reviewImages, productOptions, productId, } = data;
    if ((reviewImages === null || reviewImages === void 0 ? void 0 : reviewImages.length) === 0) {
        const review = yield prisma.review.create({
            data: {
                userId,
                reviewContent,
                ratingScore,
                productId: Number(productId),
            },
        });
        for (let i = 0; i < productOptions.length; i++) {
            yield prisma.productOptionReviewMapping.create({
                data: {
                    productOptionId: productOptions[i].option.id,
                    reviewId: review.id,
                },
            });
        }
        return review;
    }
    else {
        const review = yield prisma.review.create({
            data: {
                userId,
                reviewContent,
                ratingScore,
                productId: Number(productId),
            },
        });
        if (reviewImages) {
            for (let i = 0; i < (reviewImages === null || reviewImages === void 0 ? void 0 : reviewImages.length); i++) {
                yield prisma.reviewImage.create({
                    data: {
                        imageUrl: reviewImages[i].imageUrl,
                        reviewId: review.id,
                    },
                });
            }
        }
        for (let i = 0; i < productOptions.length; i++) {
            yield prisma.productOptionReviewMapping.create({
                data: {
                    productOptionId: productOptions[i].option.id,
                    reviewId: review.id,
                },
            });
        }
        return review;
    }
});
exports.createReviewService = createReviewService;
const canUserReviewService = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma.orderItem.findMany({
        where: {
            productId,
            order: {
                userId,
            },
        },
        select: {
            option: {
                select: {
                    id: true,
                    optionName: true,
                },
            },
        },
    });
    return order;
});
exports.canUserReviewService = canUserReviewService;
const findReview = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma.review.findFirst({
        where: {
            userId,
            productId,
        },
    });
    return review;
});
exports.findReview = findReview;
const findAllReviewsByProductId = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma.review.findMany({
        where: {
            productId,
        },
        include: {
            User: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                },
            },
            reviewImages: true,
            productOption: {
                select: {
                    ProductOption: {
                        select: {
                            optionName: true,
                        },
                    },
                },
            },
        },
    });
    return reviews;
});
exports.findAllReviewsByProductId = findAllReviewsByProductId;
const updateProductOptionTotalSale = (soldProduct) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(soldProduct.map((product) => {
        return prisma.productOption.update({
            where: {
                id: product.optionId,
                productId: product.productId,
            },
            data: {
                totalSale: {
                    increment: product.quantity,
                },
            },
        });
    }));
});
exports.updateProductOptionTotalSale = updateProductOptionTotalSale;
const updateProductTotalSale = (soldProduct) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(soldProduct.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const totalSaleThisOption = yield prisma.productOption.aggregate({
            where: {
                productId: product.productId,
            },
            _sum: {
                totalSale: true,
            },
        });
        yield prisma.product.update({
            where: {
                id: product.productId,
            },
            data: {
                totalSales: totalSaleThisOption._sum.totalSale || 0,
            },
        });
    })));
});
exports.updateProductTotalSale = updateProductTotalSale;
const ghostService = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.product.findMany({
        orderBy: {
            totalSales: "desc",
        },
        take: 5,
    });
    console.log(3, products);
    return products;
});
exports.ghostService = ghostService;
