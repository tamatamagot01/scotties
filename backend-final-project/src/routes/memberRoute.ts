import { Router } from "express";
import {
  createUserAddress,
  changePassword,
  deleteUser,
  editUserByAdmin,
  getUserAddress,
  getUserDetail,
  profile,
  editUserByUser,
  deleteFavoriteItem,
  addFavoriteItem,
  getAllMyFavoriteItems,
  getUserInRange,
} from "../controllers/userController";
import { verify as userVerify } from "../middlewares/verify";
import { verify as adminVerify } from "../middlewares/adminVerify";
import { addressValidation } from "../validations/addressValidation";
import { loginValidation } from "../validations/userValidation";

const router = Router();

//user-side
router.get("/profile", userVerify, profile);
router.patch("/edit-by-user", userVerify, editUserByUser);
router.patch("/change-password", userVerify, loginValidation, changePassword);
router.post("/add-favorite-item", userVerify, addFavoriteItem);
router.get("/get-favorite-item", userVerify, getAllMyFavoriteItems);
router.delete("/delete-favorite-item", userVerify, deleteFavoriteItem);

// admin-side
router.get("/user-detail", adminVerify, getUserDetail);
router.get("/user-in-range", getUserInRange);
router.patch("/edit-by-admin", adminVerify, editUserByAdmin);
router.delete("/delete-user", adminVerify, deleteUser);

//both-side
router.get("/address", getUserAddress);
router.post("/address", addressValidation, createUserAddress);

export default router;
