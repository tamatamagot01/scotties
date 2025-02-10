import { PrismaClient, Prisma } from "@prisma/client";
import { encryptPassword } from "../utils/userUtility";
import { UserAddressType } from "../validations/addressValidation";
import { adminFilterType } from "../controllers/userController";

const prisma = new PrismaClient();

export const createUser = async (
  userData: Prisma.UserCreateInput & { roleId: number }
) => {
  const { firstName, lastName, email, roleId } = userData;

  const encryptedPassword = await encryptPassword(userData.password);

  const user = await prisma.user.create({
    data: {
      firstName:
        firstName[0].toUpperCase() +
        firstName.substring(1, firstName.length).toLowerCase(),
      lastName:
        lastName[0].toUpperCase() +
        lastName.substring(1, lastName.length).toLowerCase(),
      email,
      password: encryptedPassword,
      roleId,
    },
    select: {
      id: true,
      firstName: true,
      email: true,
    },
  });

  return user;
};

export const findUserForRegister = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return user;
};

export const findUserForLogin = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      roleId: true,
    },
  });

  return user;
};

export const findUserForProfile = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      roleId: true,
    },
  });
  return user;
};

export const findUserEmail = async (id: number) => {
  const userEmail = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      email: true,
    },
  });

  return userEmail;
};

export const findNotLoginUserEmail = async (orderId: number) => {
  const userEmail = await prisma.orderNotLogin.findUnique({
    where: {
      id: orderId,
    },
    select: {
      email: true,
    },
  });

  return userEmail;
};

export const findUserInRange = async (
  page: number,
  sortUser: string,
  searchUser: string,
  filterUser: adminFilterType
) => {
  let users;

  const takeItems = 15;
  const skipItems = (page - 1) * takeItems;

  // เกี่ยวกับการ sort
  console.log(sortUser);
  const sortBy = sortUser.split(",")[0];
  const sortType = sortUser.split(",")[1];

  // เกี่ยวกับการ search
  let whereSearch;

  if (isNaN(Number(searchUser))) {
    whereSearch = {
      OR: [
        { firstName: { contains: searchUser } },
        { lastName: { contains: searchUser } },
      ],
    };
  } else {
    whereSearch = {
      id: Number(searchUser),
    };
  }

  // เกี่ยวกับการ filter
  let whereFilter = {};

  if (filterUser && filterUser!.role.all === "false") {
    const role = {
      role: {
        OR: filterUser?.role.value?.map((role) => ({
          roleName: role,
        })),
      },
    };

    whereFilter = { ...whereFilter, ...role };
  }

  if (searchUser !== "" && Object.keys(whereFilter).length !== 0) {
    users = await prisma.user.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy:
        sortBy === "role"
          ? {
              [sortBy]: { roleName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereSearch,
        ...whereFilter,
      },
      include: {
        orders: true,
        role: true,
      },
    });
  } else if (searchUser !== "" && Object.keys(whereFilter).length === 0) {
    users = await prisma.user.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy:
        sortBy === "role"
          ? {
              [sortBy]: { roleName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereSearch,
      },
      include: {
        orders: true,
        role: true,
      },
    });
  } else if (searchUser === "" && Object.keys(whereFilter).length !== 0) {
    users = await prisma.user.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy:
        sortBy === "role"
          ? {
              [sortBy]: { roleName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereFilter,
      },
      include: {
        orders: true,
        role: true,
      },
    });
  } else {
    users = await prisma.user.findMany({
      take: takeItems,
      skip: skipItems,
      orderBy:
        sortBy === "role"
          ? {
              [sortBy]: { roleName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      include: {
        orders: true,
        role: true,
      },
    });
  }

  return users;
};

export const findLengthOfUsers = async (
  sortUser: string,
  searchUser: string,
  filterUser: adminFilterType
) => {
  let userLength;

  // เกี่ยวกับการ sort
  const sortBy = sortUser.split(",")[0];
  const sortType = sortUser.split(",")[1];

  // เกี่ยวกับการ search
  let whereSearch;

  if (isNaN(Number(searchUser))) {
    whereSearch = {
      OR: [
        { firstName: { contains: searchUser } },
        { lastName: { contains: searchUser } },
      ],
    };
  } else {
    whereSearch = {
      id: Number(searchUser),
    };
  }

  // เกี่ยวกับการ filter
  let whereFilter = {};

  if (filterUser && filterUser!.role.all === "false") {
    const role = {
      role: {
        OR: filterUser?.role.value?.map((role) => ({
          roleName: role,
        })),
      },
    };

    whereFilter = { ...whereFilter, ...role };
  }

  if (searchUser !== "" && Object.keys(whereFilter).length !== 0) {
    userLength = await prisma.user.aggregate({
      orderBy:
        sortBy === "role"
          ? {
              [sortBy]: { roleName: sortType as "asc" | "desc" },
            }
          : {
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
  } else if (searchUser !== "" && Object.keys(whereFilter).length === 0) {
    userLength = await prisma.user.aggregate({
      orderBy:
        sortBy === "role"
          ? {
              [sortBy]: { roleName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      where: {
        ...whereSearch,
      },
      _count: {
        _all: true,
      },
    });
  } else if (searchUser === "" && Object.keys(whereFilter).length !== 0) {
    userLength = await prisma.user.aggregate({
      orderBy:
        sortBy === "role"
          ? {
              [sortBy]: { roleName: sortType as "asc" | "desc" },
            }
          : {
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
    userLength = await prisma.user.aggregate({
      orderBy:
        sortBy === "role"
          ? {
              [sortBy]: { roleName: sortType as "asc" | "desc" },
            }
          : {
              [sortBy]: sortType,
            },
      _count: {
        _all: true,
      },
    });
  }

  return userLength;
};

export const createAddress = async (data: UserAddressType) => {
  const {
    phoneNumber,
    streetAddress,
    subDistrict,
    district,
    province,
    postalCode,
    userId,
  } = data;

  let address;

  if (userId !== 0) {
    address = await prisma.address.create({
      data: {
        phoneNumber,
        streetAddress,
        subDistrict,
        district,
        province,
        postalCode,
        userId,
      },
    });
  }

  return address;
};

export const editAddress = async (data: Record<string, unknown>) => {
  const { selectedAddress, editType, editContent } = data;

  if (
    typeof selectedAddress === "number" &&
    typeof editType === "string" &&
    typeof editContent === "string"
  ) {
    const address = prisma.address.update({
      where: {
        id: selectedAddress,
      },
      data: {
        [editType]: editContent,
      },
    });

    return address;
  }
};

export const deleteAddress = async (addressId: number) => {
  // ไม่ได้ลบจริง แต่เปลี่ยนค่า isActive จาก true -> false
  await prisma.address.update({
    where: {
      id: addressId,
    },
    data: {
      isActive: false,
    },
  });
};

export const findAddressByUserId = async (userId: number) => {
  const address = await prisma.address.findMany({
    where: {
      userId,
      isActive: true,
    },
  });

  return address;
};

export const findUserByUserId = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      email: true,
      role: {
        select: {
          roleName: true,
        },
      },
      addresses: true,
      reviews: true,
      FavoriteItem: true,
      isActive: true,
    },
  });

  return user;
};

export const editUserService = async (
  userId: number,
  editType: string,
  editContent: string
) => {
  let editData;

  if (
    editType === "firstName" ||
    editType === "lastName" ||
    editType === "email"
  ) {
    editData = {
      [editType]: editContent,
    };
  }

  if (editType === "imageUrl") {
    editData = {
      profileImage: editContent,
    };
  }

  if (editType === "role") {
    editData = {
      roleId: editContent === "customer" ? 1 : editContent === "admin" ? 2 : 3,
    };
  }

  const product = await prisma.user.update({
    where: {
      id: userId,
    },
    data: editData!,
    select: {
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      role: {
        select: {
          roleName: true,
        },
      },
      addresses: true,
      reviews: true,
      FavoriteItem: true,
      isActive: true,
    },
  });

  return product;
};

export const deleteUserService = async (userId: number, status: string) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive: status === "delete" ? false : true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      isActive: true,
      addresses: true,
      FavoriteItem: true,
      reviews: true,
      role: true,
    },
  });

  return user;
};

export const changePasswordService = async (
  email: string,
  newPassword: string
) => {
  const encryptedPassword = await encryptPassword(newPassword);

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: encryptedPassword,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return user;
};

export const addFavoriteItemService = async (
  productId: number,
  userId: number
) => {
  const product = await prisma.favoriteItem.create({
    data: {
      productId,
      userId,
    },
  });

  return product;
};

export const deleteFavoriteItemService = async (
  productId: number,
  userId: number
) => {
  const product = await prisma.favoriteItem.delete({
    where: {
      productId_userId: {
        productId,
        userId,
      },
    },
  });

  return product;
};

export const checkFavoriteItemService = async (
  productId: number,
  userId: number
) => {
  const check = await prisma.favoriteItem.findMany({
    where: {
      productId,
      userId,
    },
  });

  return check;
};

export const findAllMyFavoriteItemService = async (userId: number) => {
  const products = await prisma.favoriteItem.findMany({
    where: {
      userId,
    },
    select: {
      Product: {
        select: {
          id: true,
          imageUrl: true,
          productName: true,
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
        },
      },
    },
  });

  return products;
};
