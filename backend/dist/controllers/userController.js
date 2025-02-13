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
exports.deleteFavoriteItem = exports.getAllMyFavoriteItems = exports.addFavoriteItem = exports.changePassword = exports.deleteUser = exports.editUserByAdmin = exports.editUserByUser = exports.getUserInRange = exports.getUserDetail = exports.getUserAddress = exports.createUserAddress = exports.profile = exports.login = exports.register = void 0;
const userService_1 = require("../services/userService");
const userUtility_1 = require("../utils/userUtility");
const userService_2 = require("../services/userService");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userService_1.createUser)(req.body);
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const token = yield (0, userUtility_1.createToken)(user.id, user.roleId);
        res
            .status(200)
            .json({ message: "Successful Login", token, roleId: user.roleId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.login = login;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const user = yield (0, userService_1.findUserForProfile)(userId);
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.profile = profile;
const createUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const data = req.body;
        let userId;
        if (token && typeof token === "string") {
            const { id } = yield (0, userUtility_1.verifyToken)(token);
            userId = id;
        }
        data.userId = userId;
        const address = yield (0, userService_1.createAddress)(data);
        res.status(201).json(address);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.createUserAddress = createUserAddress;
const getUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
        }
        const user = yield (0, userUtility_1.verifyToken)(token);
        const userId = user.id;
        const address = yield (0, userService_1.findAddressByUserId)(userId);
        res.status(200).json(address);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getUserAddress = getUserAddress;
const getUserDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.query.userId);
        if (typeof userId !== "number" || Number.isNaN(userId)) {
            res.status(400).json({ error: "Incorrect user id" });
            return;
        }
        const user = yield (0, userService_1.findUserByUserId)(Number(userId));
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getUserDetail = getUserDetail;
const getUserInRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, sortUser, searchUser, filterUser } = req.query;
        const users = yield (0, userService_2.findUserInRange)(Number(page), String(sortUser), String(searchUser), filterUser);
        const countUsers = yield (0, userService_2.findLengthOfUsers)(String(sortUser), String(searchUser), filterUser);
        res.status(200).json({ users, countUsers });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getUserInRange = getUserInRange;
const editUserByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, editType, editContent } = req.body;
        if (editType === "firstName") {
            yield (0, userService_1.editUserService)(userId, editType, editContent);
            res.status(200).json({ message: "First name has been changed" });
            return;
        }
        if (editType === "lastName") {
            yield (0, userService_1.editUserService)(userId, editType, editContent);
            res.status(200).json({ message: "Last name has been changed" });
            return;
        }
        if (editType === "imageUrl") {
            yield (0, userService_1.editUserService)(userId, editType, editContent);
            res.status(200).json({ message: "Profile image has been changed" });
            return;
        }
        if (editType === "addAddress") {
            const { streetAddress, subDistrict, district, province, postalCode, phoneNumber, } = editContent;
            const data = {
                userId,
                streetAddress,
                subDistrict,
                district,
                province,
                postalCode,
                phoneNumber,
            };
            yield (0, userService_1.createAddress)(data);
            res.status(201).json({ message: "New address has been created" });
            return;
        }
        if (editType === "editAddress") {
            const { streetAddress, subDistrict, district, province, postalCode, phoneNumber, selectedAddress, } = editContent;
            if (streetAddress !== "") {
                yield (0, userService_1.editAddress)({
                    selectedAddress,
                    editType: "streetAddress",
                    editContent: streetAddress,
                });
                res.status(200).json({ message: "Street Address has been edited" });
            }
            if (subDistrict !== "") {
                yield (0, userService_1.editAddress)({
                    selectedAddress,
                    editType: "subDistrict",
                    editContent: subDistrict,
                });
                res.status(200).json({ message: "Sub district has been edited" });
            }
            if (district !== "") {
                yield (0, userService_1.editAddress)({
                    selectedAddress,
                    editType: "district",
                    editContent: district,
                });
                res.status(200).json({ message: "District has been edited" });
            }
            if (province !== "") {
                yield (0, userService_1.editAddress)({
                    selectedAddress,
                    editType: "province",
                    editContent: province,
                });
                res.status(200).json({ message: "Province has been edited" });
            }
            if (postalCode !== "") {
                yield (0, userService_1.editAddress)({
                    selectedAddress,
                    editType: "postalCode",
                    editContent: postalCode,
                });
                res.status(200).json({ message: "Postal Code has been edited" });
            }
            if (phoneNumber !== "") {
                yield (0, userService_1.editAddress)({
                    selectedAddress,
                    editType: "phoneNumber",
                    editContent: phoneNumber,
                });
                res.status(200).json({ message: "Phone Number has been edited" });
            }
        }
        if (editType === "deleteAddress") {
            yield (0, userService_1.deleteAddress)(editContent);
            res.status(200).json({ message: "This address has been deleted" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.editUserByUser = editUserByUser;
const editUserByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, editType, editContent } = req.body;
        if (editType === "role" && editContent === "") {
            res.status(400).json({ error: "Please select role" });
            return;
        }
        if (editContent === "") {
            res.status(400).json({ error: "Please fill edit content" });
            return;
        }
        const editedUser = yield (0, userService_1.editUserService)(Number(userId), editType, editContent);
        res.status(200).json({ editedUser, message: "Successful edit user!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.editUserByAdmin = editUserByAdmin;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, status } = req.query;
        const numberUserId = Number(userId);
        const deletedUser = yield (0, userService_1.deleteUserService)(numberUserId, status);
        if (deletedUser.isActive === false) {
            res.status(200).json({ message: "Successful delete user", deletedUser });
        }
        else {
            res.status(200).json({ message: "Available this user", deletedUser });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.deleteUser = deleteUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        const user = (0, userService_1.changePasswordService)(email, newPassword);
        if (!user) {
            res.status(400).json({ message: "Can't change password" });
            return;
        }
        res.status(200).json({ message: "Password has been changed" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.changePassword = changePassword;
const addFavoriteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = Number(req.body.productId);
        const userId = req.user.id;
        const check = yield (0, userService_1.checkFavoriteItemService)(productId, userId);
        if (check.length !== 0) {
            res.status(400).json({ error: "This product already add before" });
            return;
        }
        yield (0, userService_1.addFavoriteItemService)(productId, userId);
        res
            .status(200)
            .json({ message: "This product has been add to my favorite!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.addFavoriteItem = addFavoriteItem;
const getAllMyFavoriteItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const products = yield (0, userService_1.findAllMyFavoriteItemService)(userId);
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllMyFavoriteItems = getAllMyFavoriteItems;
const deleteFavoriteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = Number(req.query.product_id);
        const userId = req.user.id;
        yield (0, userService_1.deleteFavoriteItemService)(productId, userId);
        res.status(200).json({ message: "Item has been deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.deleteFavoriteItem = deleteFavoriteItem;
