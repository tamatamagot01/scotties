"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const verify_1 = require("../middlewares/verify");
const adminVerify_1 = require("../middlewares/adminVerify");
const addressValidation_1 = require("../validations/addressValidation");
const userValidation_1 = require("../validations/userValidation");
const router = (0, express_1.Router)();
//user-side
router.get("/profile", verify_1.verify, userController_1.profile);
router.patch("/edit-by-user", verify_1.verify, userController_1.editUserByUser);
router.patch("/change-password", verify_1.verify, userValidation_1.loginValidation, userController_1.changePassword);
router.post("/add-favorite-item", verify_1.verify, userController_1.addFavoriteItem);
router.get("/get-favorite-item", verify_1.verify, userController_1.getAllMyFavoriteItems);
router.delete("/delete-favorite-item", verify_1.verify, userController_1.deleteFavoriteItem);
// admin-side
router.get("/user-detail", adminVerify_1.verify, userController_1.getUserDetail);
router.get("/user-in-range", userController_1.getUserInRange);
router.patch("/edit-by-admin", adminVerify_1.verify, userController_1.editUserByAdmin);
router.delete("/delete-user", adminVerify_1.verify, userController_1.deleteUser);
//both-side
router.get("/address", userController_1.getUserAddress);
router.post("/address", addressValidation_1.addressValidation, userController_1.createUserAddress);
exports.default = router;
