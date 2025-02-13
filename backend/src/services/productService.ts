import { Prisma, PrismaClient } from "@prisma/client";
import { adminFilterType, filterType } from "../controllers/productController";

const prisma = new PrismaClient();

type ProductDataType = {
  productName: string;
  brand: string;
  type: string;
  price: string;
  imageUrl: string;
  description: string;
  options: any;
};

type ReviewType = {
  userId: number;
  reviewContent: string;
  ratingScore: number;
  reviewImages?: { imageUrl: string }[];
  productOptions: { option: { id: number; optionName: string } }[];
  productId: number;
};

export const createProduct = async (productData: ProductDataType) => {
  const { productName, brand, type, price, options, imageUrl, description } =
    productData;

  const brandId = await findBrandId(brand);
  const typeId = await findTypeId(type);

  if (!brandId || !typeId) {
    throw new Error("Brand or Type not found");
  }

  const product = await prisma.product.create({
    data: {
      productName,
      description,
      typeId: typeId.id,
      brandId: brandId.id,
      price: Number(price),
      imageUrl,
    },
  });

  for (let key in options) {
    await prisma.productOption.create({
      data: {
        optionName: key,
        quantity: options[key],
        productId: product.id,
      },
    });
  }

  return product;
};

export const findSpecificProduct = async (productData: {
  productName: string;
  imageUrl: string;
}) => {
  const { productName, imageUrl } = productData;
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ productName }, { imageUrl }],
    },
  });

  return product;
};

export const findAllProducts = async (
  category?: Record<string, number>,
  filter?: filterType
) => {
  let whereFilter = {};

  // ใช้หา data จาก path params ที่ส่งมา
  if (typeof category === "object") {
    const categoryKey = Object.keys(category)[0];

    if (categoryKey === "brand") {
      whereFilter = {
        brand: {
          id: category.brand,
        },
      };
    }

    if (categoryKey === "type") {
      whereFilter = {
        type: {
          id: category.type,
        },
      };
    }
  }

  // ใช้หา data จาก filter ที่ส่งมา
  const brandFilter = filter?.brand?.map((brand) => ({
    name: brand,
  }));

  const typeFilter = filter?.type?.map((type) => ({
    typeName: type,
  }));

  if (brandFilter) {
    whereFilter = {
      brand: {
        OR: brandFilter,
      },
    };
  }

  if (typeFilter) {
    whereFilter = {
      type: {
        OR: typeFilter,
      },
    };
  }

  if (brandFilter && typeFilter) {
    whereFilter = {
      brand: {
        OR: brandFilter,
      },
      type: {
        OR: typeFilter,
      },
    };
  }

  const products = await prisma.product.findMany({
    where: whereFilter,
    select: {
      productName: true,
      type: true,
      brand: {
        select: {
          name: true,
        },
      },
      price: true,
      imageUrl: true,
      id: true,
    },
  });
  return products;
};

export const findProductInRange = async (
  page: number,
  sortProduct: string,
  searchProduct: string,
  filterProduct: adminFilterType
) => {
  let products;

  const takeItems = 15;
  const skipItems = (page - 1) * takeItems;

  // เกี่ยวกับการ sort
  const sortBy = sortProduct.split(",")[0];
  const sortType = sortProduct.split(",")[1];

  // เกี่ยวกับการ search
  let whereSearch;

  if (isNaN(Number(searchProduct))) {
    whereSearch = {
      productName: {
        contains: searchProduct,
      },
    };
  } else {
    whereSearch = {
      id: Number(searchProduct),
    };
  }

  // เกี่ยวกับการ filter
  let whereFilter = {};

  if (filterProduct && filterProduct.brand.all === "false") {
    const brand = {
      brand: {
        OR: filterProduct?.brand.value?.map((brand) => ({
          name: brand,
        })),
      },
    };

    whereFilter = { ...brand };
  }

  if (filterProduct && filterProduct!.type.all === "false") {
    const type = {
      type: {
        OR: filterProduct?.type.value?.map((type) => ({
          typeName: type,
        })),
      },
    };

    whereFilter = { ...whereFilter, ...type };
  }

  if (filterProduct && filterProduct!.price.all === "false") {
    const checkPriceFilter = filterProduct.price.value?.map((price) => {
      if (price === "< 3000") {
        return { price: { lte: 3000 } };
      }

      if (price === "3001 - 5000") {
        return { price: { gte: 3001, lte: 5000 } };
      }

      if (price === "5001 - 7000") {
        return { price: { gte: 5001, lte: 7000 } };
      }

      if (price === "7001 - 10000") {
        return { price: { gte: 7001, lt: 10000 } };
      }

      if (price === "> 10000") {
        return { price: { gte: 10000 } };
      }
    });

    const price = {
      OR: checkPriceFilter,
    };

    whereFilter = { ...whereFilter, ...price };
  }

  if (filterProduct && filterProduct!.totalSales.all === "false") {
    const checkTotalSalesFilter = filterProduct.totalSales.value?.map(
      (totalSale) => {
        if (totalSale === "< 10") {
          return { totalSales: { lte: 10 } };
        }

        if (totalSale === "11 - 50") {
          return { totalSales: { gte: 11, lte: 50 } };
        }

        if (totalSale === "51 - 100") {
          return { totalSales: { gte: 51, lte: 100 } };
        }

        if (totalSale === "> 100") {
          return { totalSales: { gte: 101 } };
        }
      }
    );

    const totalSales = {
      OR: checkTotalSalesFilter,
    };

    whereFilter = { ...whereFilter, ...totalSales };
  }

  if (searchProduct !== "" && Object.keys(whereFilter).length !== 0) {
    products = await prisma.product.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy: {
        [sortBy]: sortType,
      },
      where: {
        ...whereSearch,
        ...whereFilter,
      },
      include: {
        brand: true,
        type: true,
        productOptions: true,
      },
    });
  } else if (searchProduct !== "" && Object.keys(whereFilter).length === 0) {
    products = await prisma.product.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy: {
        [sortBy]: sortType,
      },
      where: {
        ...whereSearch,
      },
      include: {
        brand: true,
        type: true,
        productOptions: true,
      },
    });
  } else if (searchProduct === "" && Object.keys(whereFilter).length !== 0) {
    products = await prisma.product.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy: {
        [sortBy]: sortType,
      },
      where: {
        ...whereFilter,
      },
      include: {
        brand: true,
        type: true,
        productOptions: true,
      },
    });
  } else {
    products = await prisma.product.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy: {
        [sortBy]: sortType,
      },
      include: {
        brand: true,
        type: true,
        productOptions: true,
      },
    });
  }

  return products;
};

export const findLengthOfProducts = async (
  sortProduct: string,
  searchProduct: string,
  filterProduct: adminFilterType
) => {
  let productLength;

  // เกี่ยวกับการ sort
  const sortBy = sortProduct.split(",")[0];
  const sortType = sortProduct.split(",")[1];

  // เกี่ยวกับการ search
  let whereSearch;

  if (isNaN(Number(searchProduct))) {
    whereSearch = {
      productName: {
        contains: searchProduct,
      },
    };
  } else {
    whereSearch = {
      id: Number(searchProduct),
    };
  }

  // เกี่ยวกับการ filter
  let whereFilter = {};

  if (filterProduct && filterProduct.brand.all === "false") {
    const brand = {
      brand: {
        OR: filterProduct?.brand.value?.map((brand) => ({
          name: brand,
        })),
      },
    };

    whereFilter = { ...brand };
  }

  if (filterProduct && filterProduct!.type.all === "false") {
    const type = {
      type: {
        OR: filterProduct?.type.value?.map((type) => ({
          typeName: type,
        })),
      },
    };

    whereFilter = { ...whereFilter, ...type };
  }

  if (filterProduct && filterProduct!.price.all === "false") {
    const checkPriceFilter = filterProduct.price.value?.map((price) => {
      if (price === "< 3000") {
        return { price: { lte: 3000 } };
      }

      if (price === "3001 - 5000") {
        return { price: { gte: 3001, lte: 5000 } };
      }

      if (price === "5001 - 7000") {
        return { price: { gte: 5001, lte: 7000 } };
      }

      if (price === "7001 - 10000") {
        return { price: { gte: 7001, lt: 10000 } };
      }

      if (price === "> 10000") {
        return { price: { gte: 10000 } };
      }
    });

    const price = {
      OR: checkPriceFilter,
    };

    whereFilter = { ...whereFilter, ...price };
  }

  if (filterProduct && filterProduct!.totalSales.all === "false") {
    const checkTotalSalesFilter = filterProduct.totalSales.value?.map(
      (totalSale) => {
        if (totalSale === "< 10") {
          return { totalSales: { lte: 10 } };
        }

        if (totalSale === "11 - 50") {
          return { totalSales: { gte: 11, lte: 50 } };
        }

        if (totalSale === "51 - 100") {
          return { totalSales: { gte: 51, lte: 100 } };
        }

        if (totalSale === "> 100") {
          return { totalSales: { gte: 101 } };
        }
      }
    );

    const totalSales = {
      OR: checkTotalSalesFilter,
    };

    whereFilter = { ...whereFilter, ...totalSales };
  }

  if (searchProduct !== "" && Object.keys(whereFilter).length !== 0) {
    productLength = await prisma.product.aggregate({
      orderBy: {
        [sortBy]: sortType,
      },
      where: {
        ...whereSearch,
        ...whereFilter,
      },
      _count: {
        _all: true,
      },
    });
  } else if (searchProduct !== "" && Object.keys(whereFilter).length === 0) {
    productLength = await prisma.product.aggregate({
      orderBy: {
        [sortBy]: sortType,
      },
      where: {
        ...whereSearch,
      },
      _count: {
        _all: true,
      },
    });
  } else if (searchProduct === "" && Object.keys(whereFilter).length !== 0) {
    productLength = await prisma.product.aggregate({
      orderBy: {
        [sortBy]: sortType,
      },
      where: {
        ...whereFilter,
      },
      _count: {
        _all: true,
      },
    });
  } else {
    productLength = await prisma.product.aggregate({
      orderBy: {
        [sortBy]: sortType,
      },
      _count: {
        _all: true,
      },
    });
  }

  return productLength;
};

export const findProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      brand: true,
      type: true,
      productName: true,
      description: true,
      imageUrl: true,
      price: true,
      productOptions: {
        select: {
          id: true,
          optionName: true,
          quantity: true,
        },
      },
      isActive: true,
    },
  });

  return product;
};

export const findProductByName = async (nameFilter: string) => {
  const products = await prisma.product.findMany({
    where: {
      productName: {
        contains: nameFilter,
      },
    },
    select: {
      id: true,
      productName: true,
      imageUrl: true,
      brand: {
        select: {
          name: true,
        },
      },
      price: true,
    },
  });

  return products;
};

export const findFiveMostViewProduct = async (productType: string) => {
  const products = await prisma.product.findMany({
    where: {
      type: {
        typeName: productType,
      },
    },
    take: 5,
    orderBy: {
      viewCount: "desc",
    },
    select: {
      productName: true,
      brand: {
        select: {
          name: true,
        },
      },
      imageUrl: true,
      price: true,
      type: {
        select: {
          typeName: true,
        },
      },
      id: true,
      viewCount: true,
    },
  });

  return products;
};

export const findFiveTopSellerProduct = async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      totalSales: "desc",
    },
    take: 5,
  });

  return products;
};

export const findBrandId = async (brandName: string) => {
  const brandId = await prisma.productBrand.findFirst({
    where: {
      name: brandName,
    },
    select: {
      id: true,
    },
  });
  return brandId;
};

export const findTypeId = async (typeName: string) => {
  const typeId = await prisma.productType.findFirst({
    where: {
      typeName: typeName,
    },
    select: {
      id: true,
    },
  });
  return typeId;
};

export const brandList = async () => {
  const brands = await prisma.productBrand.findMany({
    select: {
      name: true,
    },
  });
  return brands;
};

export const typeList = async () => {
  const types = await prisma.productType.findMany({
    select: {
      typeName: true,
    },
  });
  return types;
};

export const optionNameList = async (typeName: string) => {
  const optionNames = await prisma.optionName.findMany({
    where: {
      useForType: {
        some: {
          typeName,
        },
      },
    },
  });
  return optionNames;
};

export const updateProductAfterSold = async (
  productGroup: Record<string, number>[] | undefined
) => {
  console.log(productGroup);
  if (productGroup) {
    const updatedProduct = productGroup.map(async (product) => {
      // ดึงจำนวนเดิมของ product นั้นๆก่อน
      const prevQuantity = await prisma.productOption.findUnique({
        where: {
          id: product.optionId,
        },
        select: {
          id: true,
          quantity: true,
        },
      });

      if (prevQuantity) {
        // นำจำนวนเดิมของ product มาลบกับจำนวนที่ลูกค้าซื้อ
        const newQuantity = await prisma.productOption.update({
          where: {
            id: prevQuantity.id,
          },
          data: {
            quantity: prevQuantity?.quantity - product.quantity,
          },
          select: {
            id: true,
            quantity: true,
          },
        });
        return newQuantity;
      }
    });

    return Promise.all(updatedProduct);
  }
};

export const editProductService = async (
  productId: number,
  editType: string,
  editContent: any
) => {
  let editData;

  if (editType === "productName" || editType === "description") {
    editData = {
      [editType]: editContent,
    };
  }

  if (editType === "price" || editType === "quantity") {
    editData = {
      [editType]: Number(editContent),
    };
  }

  if (editType === "brand") {
    const brandList = [
      { id: 1, name: "Adidas" },
      { id: 2, name: "Asics" },
      { id: 3, name: "Converse" },
      { id: 4, name: "Fila" },
      { id: 5, name: "Jordan" },
      { id: 6, name: "New-Balance" },
      { id: 7, name: "Nike" },
      { id: 8, name: "Puma" },
      { id: 9, name: "Reebok" },
      { id: 10, name: "Timberland" },
      { id: 11, name: "Vans" },
    ];

    const selectedBrand = brandList.find((brand) => brand.name === editContent);

    editData = {
      brandId: selectedBrand!.id,
    };
  }

  if (editType === "type") {
    const typeList = [
      { id: 1, name: "Shoes" },
      { id: 2, name: "T-Shirt" },
      { id: 3, name: "Pants" },
      { id: 4, name: "Hoodies" },
      { id: 5, name: "Jacket" },
      { id: 6, name: "Acc" },
    ];

    const selectedType = typeList.find((type) => type.name === editContent);

    editData = {
      typeId: selectedType!.id,
    };
  }

  if (editType === "quantity") {
    const addOrNew = editContent.split(" ")[0];
    const optionName = editContent.split(" ")[1];
    const quantity = Number(editContent.split(" ")[2]);

    if (addOrNew === "Add") {
      await prisma.productOption.updateMany({
        where: {
          productId,
          optionName,
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    }

    if (addOrNew === "New") {
      await prisma.productOption.updateMany({
        where: {
          productId,
          optionName,
        },
        data: {
          quantity,
        },
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        type: {
          select: {
            id: true,
            typeName: true,
          },
        },
        description: true,
        id: true,
        imageUrl: true,
        price: true,
        productName: true,
        productOptions: {
          select: {
            optionName: true,
            quantity: true,
          },
        },
        isActive: true,
      },
    });

    return product;
  }

  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: editData!,
    select: {
      brand: {
        select: {
          id: true,
          name: true,
        },
      },
      type: {
        select: {
          id: true,
          typeName: true,
        },
      },
      description: true,
      id: true,
      imageUrl: true,
      price: true,
      productName: true,
      productOptions: {
        select: {
          optionName: true,
          quantity: true,
        },
      },
      isActive: true,
    },
  });

  return product;
};

export const deleteProductService = async (
  productId: number,
  status: string
) => {
  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      isActive: status === "delete" ? false : true,
    },
    select: {
      brand: {
        select: {
          name: true,
        },
      },
      type: {
        select: {
          typeName: true,
        },
      },
      description: true,
      id: true,
      imageUrl: true,
      price: true,
      productName: true,
      productOptions: {
        select: {
          optionName: true,
          quantity: true,
        },
      },
      isActive: true,
    },
  });

  return product;
};

export const incrementViewCountService = async (productId: number) => {
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
};

export const createReviewService = async (data: ReviewType) => {
  const {
    userId,
    reviewContent,
    ratingScore,
    reviewImages,
    productOptions,
    productId,
  } = data;

  if (reviewImages?.length === 0) {
    const review = await prisma.review.create({
      data: {
        userId,
        reviewContent,
        ratingScore,
        productId: Number(productId),
      },
    });

    for (let i = 0; i < productOptions.length; i++) {
      await prisma.productOptionReviewMapping.create({
        data: {
          productOptionId: productOptions[i].option.id,
          reviewId: review.id,
        },
      });
    }

    return review;
  } else {
    const review = await prisma.review.create({
      data: {
        userId,
        reviewContent,
        ratingScore,
        productId: Number(productId),
      },
    });

    if (reviewImages) {
      for (let i = 0; i < reviewImages?.length; i++) {
        await prisma.reviewImage.create({
          data: {
            imageUrl: reviewImages[i].imageUrl,
            reviewId: review.id,
          },
        });
      }
    }

    for (let i = 0; i < productOptions.length; i++) {
      await prisma.productOptionReviewMapping.create({
        data: {
          productOptionId: productOptions[i].option.id,
          reviewId: review.id,
        },
      });
    }

    return review;
  }
};

export const canUserReviewService = async (
  userId: number,
  productId: number
) => {
  const order = await prisma.orderItem.findMany({
    where: {
      productId,
      order: {
        userId,
      },
    },
    select: {
      option: {
        select: {
          id: true,
          optionName: true,
        },
      },
    },
  });

  return order;
};

export const findReview = async (userId: number, productId: number) => {
  const review = await prisma.review.findFirst({
    where: {
      userId,
      productId,
    },
  });

  return review;
};

export const findAllReviewsByProductId = async (productId: number) => {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      User: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      reviewImages: true,
      productOption: {
        select: {
          ProductOption: {
            select: {
              optionName: true,
            },
          },
        },
      },
    },
  });

  return reviews;
};

export const updateProductOptionTotalSale = async (
  soldProduct: {
    quantity: number;
    productId: number;
    optionId: number;
  }[]
) => {
  await Promise.all(
    soldProduct.map((product) => {
      return prisma.productOption.update({
        where: {
          id: product.optionId,
          productId: product.productId,
        },
        data: {
          totalSale: {
            increment: product.quantity,
          },
        },
      });
    })
  );
};

export const updateProductTotalSale = async (
  soldProduct: {
    quantity: number;
    productId: number;
    optionId: number;
  }[]
) => {
  await Promise.all(
    soldProduct.map(async (product) => {
      const totalSaleThisOption = await prisma.productOption.aggregate({
        where: {
          productId: product.productId,
        },
        _sum: {
          totalSale: true,
        },
      });

      await prisma.product.update({
        where: {
          id: product.productId,
        },
        data: {
          totalSales: totalSaleThisOption._sum.totalSale || 0,
        },
      });
    })
  );
};

export const ghostService = async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      totalSales: "desc",
    },
    take: 5,
  });
  console.log(3, products);

  return products;
};
