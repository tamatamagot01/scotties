import { Request, Response } from "express";
import {
  addFavoriteItemService,
  changePasswordService,
  checkFavoriteItemService,
  createAddress,
  createUser,
  deleteAddress,
  deleteFavoriteItemService,
  deleteUserService,
  editAddress,
  editUserService,
  findAddressByUserId,
  findAllMyFavoriteItemService,
  findUserByUserId,
  findUserForProfile,
} from "../services/userService";
import { createToken, verifyToken } from "../utils/userUtility";
import { CustomRequest } from "../middlewares/verify";
import { UserAddressType } from "../validations/addressValidation";
import { findLengthOfUsers, findUserInRange } from "../services/userService";

export type adminFilterType =
  | {
      firstName: {
        all: string;
        value?: string[];
      };
      lastName: {
        all: string;
        value?: string[];
      };
      email: {
        all: string;
        value?: string[];
      };
      role: {
        all: string;
        value?: string[];
      };
      orderCount: {
        all: string;
        value?: string[];
      };
    }
  | undefined;

export const register = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (
  req: Request & { user?: { id: number; roleId: number } },
  res: Response
) => {
  try {
    const user = req.user;

    const token = await createToken(user!.id, user!.roleId);
    res
      .status(200)
      .json({ message: "Successful Login", token, roleId: user!.roleId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const userId = (req as CustomRequest).user.id;

    const user = await findUserForProfile(userId);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createUserAddress = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const data = req.body as UserAddressType;
    let userId;

    if (token && typeof token === "string") {
      const { id } = await verifyToken(token);
      userId = id;
    }

    data.userId = userId as number;

    const address = await createAddress(data);

    res.status(201).json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserAddress = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
    }

    const user = await verifyToken(token);
    const userId = user.id;

    const address = await findAddressByUserId(userId);
    res.status(200).json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserDetail = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);

    if (typeof userId !== "number" || Number.isNaN(userId)) {
      res.status(400).json({ error: "Incorrect user id" });
      return;
    }

    const user = await findUserByUserId(Number(userId));

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserInRange = async (req: Request, res: Response) => {
  try {
    const { page, sortUser, searchUser, filterUser } = req.query;

    const users = await findUserInRange(
      Number(page),
      String(sortUser),
      String(searchUser),
      filterUser as adminFilterType
    );

    const countUsers = await findLengthOfUsers(
      String(sortUser),
      String(searchUser),
      filterUser as adminFilterType
    );

    res.status(200).json({ users, countUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const editUserByUser = async (req: Request, res: Response) => {
  try {
    const { userId, editType, editContent } = req.body;

    if (editType === "firstName") {
      await editUserService(userId, editType, editContent);
      res.status(200).json({ message: "First name has been changed" });
      return;
    }

    if (editType === "lastName") {
      await editUserService(userId, editType, editContent);
      res.status(200).json({ message: "Last name has been changed" });
      return;
    }

    if (editType === "imageUrl") {
      await editUserService(userId, editType, editContent);
      res.status(200).json({ message: "Profile image has been changed" });
      return;
    }

    if (editType === "addAddress") {
      type EditContentType = {
        streetAddress: string;
        subDistrict: string;
        district: string;
        province: string;
        postalCode: string;
        phoneNumber: string;
      };

      const {
        streetAddress,
        subDistrict,
        district,
        province,
        postalCode,
        phoneNumber,
      } = editContent as EditContentType;

      const data = {
        userId,
        streetAddress,
        subDistrict,
        district,
        province,
        postalCode,
        phoneNumber,
      };

      await createAddress(data);
      res.status(201).json({ message: "New address has been created" });
      return;
    }

    if (editType === "editAddress") {
      type EditContentType = {
        streetAddress: string;
        subDistrict: string;
        district: string;
        province: string;
        postalCode: string;
        phoneNumber: string;
        selectedAddress: number;
      };

      const {
        streetAddress,
        subDistrict,
        district,
        province,
        postalCode,
        phoneNumber,
        selectedAddress,
      } = editContent as EditContentType;

      if (streetAddress !== "") {
        await editAddress({
          selectedAddress,
          editType: "streetAddress",
          editContent: streetAddress,
        });
        res.status(200).json({ message: "Street Address has been edited" });
      }

      if (subDistrict !== "") {
        await editAddress({
          selectedAddress,
          editType: "subDistrict",
          editContent: subDistrict,
        });
        res.status(200).json({ message: "Sub district has been edited" });
      }

      if (district !== "") {
        await editAddress({
          selectedAddress,
          editType: "district",
          editContent: district,
        });
        res.status(200).json({ message: "District has been edited" });
      }

      if (province !== "") {
        await editAddress({
          selectedAddress,
          editType: "province",
          editContent: province,
        });
        res.status(200).json({ message: "Province has been edited" });
      }

      if (postalCode !== "") {
        await editAddress({
          selectedAddress,
          editType: "postalCode",
          editContent: postalCode,
        });
        res.status(200).json({ message: "Postal Code has been edited" });
      }

      if (phoneNumber !== "") {
        await editAddress({
          selectedAddress,
          editType: "phoneNumber",
          editContent: phoneNumber,
        });
        res.status(200).json({ message: "Phone Number has been edited" });
      }
    }

    if (editType === "deleteAddress") {
      await deleteAddress(editContent);
      res.status(200).json({ message: "This address has been deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const editUserByAdmin = async (req: Request, res: Response) => {
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

    const editedUser = await editUserService(
      Number(userId),
      editType,
      editContent
    );

    res.status(200).json({ editedUser, message: "Successful edit user!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.query;

    const numberUserId = Number(userId);

    const deletedUser = await deleteUserService(numberUserId, status as string);

    if (deletedUser.isActive === false) {
      res.status(200).json({ message: "Successful delete user", deletedUser });
    } else {
      res.status(200).json({ message: "Available this user", deletedUser });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    const user = changePasswordService(email, newPassword);

    if (!user) {
      res.status(400).json({ message: "Can't change password" });
      return;
    }

    res.status(200).json({ message: "Password has been changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const addFavoriteItem = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.body.productId);
    const userId = (req as CustomRequest).user.id;

    const check = await checkFavoriteItemService(productId, userId);

    if (check.length !== 0) {
      res.status(400).json({ error: "This product already add before" });
      return;
    }

    await addFavoriteItemService(productId, userId);

    res
      .status(200)
      .json({ message: "This product has been add to my favorite!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllMyFavoriteItems = async (req: Request, res: Response) => {
  try {
    const userId = (req as CustomRequest).user.id;

    const products = await findAllMyFavoriteItemService(userId);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteFavoriteItem = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.query.product_id);
    const userId = (req as CustomRequest).user.id;

    await deleteFavoriteItemService(productId, userId);

    res.status(200).json({ message: "Item has been deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
