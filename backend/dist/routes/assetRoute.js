"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assetController_1 = require("../controllers/assetController");
const verify_1 = require("../middlewares/verify");
const router = (0, express_1.Router)();
router.post("/", verify_1.verify, assetController_1.create);
router.get("/", assetController_1.find);
exports.default = router;
