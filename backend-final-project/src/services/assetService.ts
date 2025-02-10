import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type AssetType = {
  name: string;
  imageUrl: string;
};

export const createAsset = async (data: AssetType) => {
  const { name, imageUrl } = data;

  const existingAsset = await findAsset(data);

  if (existingAsset) {
    return { error: "Asset already exists", status: 400 };
  }

  if (!name || !imageUrl) {
    return { error: "Missing required fields", status: 400 };
  }

  const asset = await prisma.asset.create({
    data: {
      name,
      imageUrl,
    },
  });
  return asset;
};

export const findAsset = async (data: AssetType) => {
  const { name, imageUrl } = data;
  const asset = prisma.asset.findFirst({
    where: {
      OR: [{ name: name }, { imageUrl: imageUrl }],
    },
  });
  return asset;
};

export const findAssets = async () => {
  const assets = await prisma.asset.findMany();

  return assets;
};
