import { Request, Response } from "express";
import { createAsset, findAssets } from "../services/assetService";

export const create = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const asset = await createAsset(data);

    if ("status" in asset) {
      res.status(asset.status).json(asset);
    } else {
      res.status(201).json(asset);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const find = async (req: Request, res: Response) => {
  try {
    const assets = await findAssets();
    res.status(200).json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
