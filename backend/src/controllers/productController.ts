import { Request, Response } from "express";
import {
  brandList,
  createProduct,
  findAllProducts,
  findProductById,
  findBrandId,
  findTypeId,
  typeList,
  findProductByName,
  editProductService,
  deleteProductService,
  ghostService,
  optionNameList,
  findFiveMostViewProduct,
  incrementViewCountService,
  canUserReviewService,
  findReview,
  createReviewService,
  findAllReviewsByProductId,
  findProductInRange,
  findLengthOfProducts,
  findFiveTopSellerProduct,
} from "../services/productService";
import { verifyToken } from "../utils/userUtility";

export type filterType = {
  brand?: string[];
  type?: string[];
  gender?: string[];
};

export type adminFilterType =
  | {
      brand: {
        all: string;
        value?: string[];
      };
      type: {
        all: string;
        value?: string[];
      };
      price: {
        all: string;
        value?: string[];
      };
      totalSales: {
        all: string;
        value?: string[];
      };
    }
  | undefined;

export const create = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);

    res.status(201).json({ message: "New product has been created", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    if (category) {
      const brand = await findBrandId(category);
      const type = await findTypeId(category);

      if (brand) {
        const products = await findAllProducts({ brand: brand.id }, undefined);
        res.status(200).json(products);
        return;
      }

      if (type) {
        const products = await findAllProducts({ type: type.id }, undefined);
        res.status(200).json(products);
        return;
      }
    }

    const filter: filterType = req.query;

    const products = await findAllProducts(undefined, filter);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductsInRange = async (req: Request, res: Response) => {
  try {
    const { page, sortProduct, searchProduct, filterProduct } = req.query;

    const products = await findProductInRange(
      Number(page),
      String(sortProduct),
      String(searchProduct),
      filterProduct as adminFilterType
    );

    const countProducts = await findLengthOfProducts(
      String(sortProduct),
      String(searchProduct),
      filterProduct as adminFilterType
    );

    res.status(200).json({ products, countProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;

    // ใช้ดักกรณีใส่ productId มาเป็น (อักษรผสมตัวเลข เช่น 12aBc)
    if (!Boolean(Number(productId))) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    // ดึง product มาจาก service
    const product = await findProductById(productId as string);

    // กรณีหา product ไม่เจอ (อาจจะเพราะ productId ไม่มีอยู่) จะ res error message ออกไป
    if (!product) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductByName = async (req: Request, res: Response) => {
  try {
    const { nameFilter } = req.query;

    if (typeof nameFilter !== "string") {
      res.status(400).json({ error: "Invalid product name" });
      return;
    }

    const products = await findProductByName(nameFilter);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getFiveMostViewProduct = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    if (!category) {
      res.status(500).json({ error: "Error to get product" });
    }

    const products = await findFiveMostViewProduct(category as string);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error to get product", error);
    res.status(500).json({ error: "Error to get product" });
  }
};

export const getTopSellerProduct = async (req: Request, res: Response) => {
  try {
    const products = await findFiveTopSellerProduct();

    res.status(200).json(products);
  } catch (error) {
    console.error("Error to get product", error);
    res.status(500).json({ error: "Error to get product" });
  }
};

export const getAllBrand = async (req: Request, res: Response) => {
  try {
    const brands = await brandList();
    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllType = async (req: Request, res: Response) => {
  try {
    const types = await typeList();
    res.status(200).json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllOptionName = async (req: Request, res: Response) => {
  try {
    const { typeName } = req.query;

    if (typeof typeName === "string") {
      const optionNames = await optionNameList(typeName);
      res.status(200).json(optionNames);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const { productId, editType, editContent } = req.body;

    if ((editType === "brand" || editType === "type") && editContent === "") {
      res.status(400).json({ error: "Please select brand or type" });
      return;
    }

    if (editContent === "") {
      res.status(400).json({ error: "Please fill edit content" });
      return;
    }

    const editedProduct = await editProductService(
      Number(productId),
      editType,
      editContent
    );

    res
      .status(200)
      .json({ message: "This product has been edited!", editedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId, status } = req.query;

    const numberProductId = Number(productId);

    const deletedProduct = await deleteProductService(
      numberProductId,
      status as string
    );

    if (deletedProduct.isActive === false) {
      res
        .status(200)
        .json({ message: "Successful delete product", deletedProduct });
    } else {
      res
        .status(200)
        .json({ message: "Available this product", deletedProduct });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const incrementViewCount = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    await incrementViewCountService(Number(productId));

    res.status(200).json({ message: "Successful increment view count" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const review = await createReviewService(req.body);

    res.status(200).json(review);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const canUserReview = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const productId = req.query.product_id;

    if (!token) {
      res.status(400).json({ error: "No token provide" });
      return;
    }

    const user = await verifyToken(token);

    if (user && productId && !isNaN(Number(productId))) {
      const orderItem = await canUserReviewService(user.id, Number(productId));

      if (orderItem.length > 0) {
        const hasReview = await findReview(user.id, Number(productId));

        if (hasReview) {
          res
            .status(400)
            .json({ error: "This user already create the review" });
        } else {
          res.status(200).json(orderItem);
        }
      } else {
        res.status(404).json({ error: "You never buy this product" });
      }
    }
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllReviewByProductId = async (req: Request, res: Response) => {
  try {
    const productId = req.query.product_id;

    const reviews = await findAllReviewsByProductId(Number(productId));
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error from Internal Server", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const ghostController = async (req: Request, res: Response) => {
  try {
    const order = await ghostService();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
