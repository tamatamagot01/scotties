"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userValidation_1 = require("../validations/userValidation");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post("/register", userValidation_1.registerValidation, userController_1.register);
router.post("/login", userValidation_1.loginValidation, userController_1.login);
exports.default = router;
