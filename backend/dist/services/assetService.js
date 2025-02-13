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
exports.findAssets = exports.findAsset = exports.createAsset = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAsset = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, imageUrl } = data;
    const existingAsset = yield (0, exports.findAsset)(data);
    if (existingAsset) {
        return { error: "Asset already exists", status: 400 };
    }
    if (!name || !imageUrl) {
        return { error: "Missing required fields", status: 400 };
    }
    const asset = yield prisma.asset.create({
        data: {
            name,
            imageUrl,
        },
    });
    return asset;
});
exports.createAsset = createAsset;
const findAsset = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, imageUrl } = data;
    const asset = prisma.asset.findFirst({
        where: {
            OR: [{ name: name }, { imageUrl: imageUrl }],
        },
    });
    return asset;
});
exports.findAsset = findAsset;
const findAssets = () => __awaiter(void 0, void 0, void 0, function* () {
    const assets = yield prisma.asset.findMany();
    return assets;
});
exports.findAssets = findAssets;
