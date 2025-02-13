import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  roleId: number;
};

type UserStore = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  roleId: number;
  setUser: (user: UserState) => void;
  clearUser: () => void;
};

type ProductManagementState = {
  createProduct: boolean;
};

type ProductManagementStore = {
  createProduct: boolean;
  setProductManagement: (selected: keyof ProductManagementState) => void;
};

type UserManagementState = {
  createUser: boolean;
};

type UserManagementStore = {
  createUser: boolean;
  setUserManagement: (selected: keyof UserManagementState) => void;
};

type SearchBar = {
  isOpenSearchBar: boolean;
  setIsOpenSearchBar: () => void;
};

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      profileImage: "",
      roleId: 0,
      setUser: (user) => {
        set(user);
      },
      clearUser: () => {
        set({
          id: 0,
          firstName: "",
          lastName: "",
          email: "",
          profileImage: "",
          roleId: 0,
        });
        localStorage.removeItem("user-store");
      },
    }),
    {
      name: "user-store",
    }
  )
);

export const useProductManagementStore = create<ProductManagementStore>()(
  (set) => ({
    createProduct: false,
    setProductManagement: (selected) =>
      set((prevState) => ({
        createProduct: !prevState[selected],
      })),
  })
);

export const useUserManagementStore = create<UserManagementStore>()((set) => ({
  createUser: false,
  setUserManagement: (selected) =>
    set((prevState) => ({
      createUser: !prevState[selected],
    })),
}));

export const useSearchBar = create<SearchBar>()((set) => ({
  isOpenSearchBar: false,
  setIsOpenSearchBar: () =>
    set((prevState) => ({ isOpenSearchBar: !prevState.isOpenSearchBar })),
}));

type OrderItemState = {
  productId: number;
  optionId: number;
  quantity: number;
};

type OrderStore = {
  thisOrders: OrderItemState[];
  addOrderItem: (orderItem: OrderItemState) => void;
  deleteOrderItem: (productId: number) => void;
  clearOrder: () => void;
};

export const useOrderStore = create(
  persist<OrderStore>(
    (set) => ({
      thisOrders: [],
      addOrderItem: (orderItem: OrderItemState) =>
        set((state) => ({
          thisOrders: [...state.thisOrders, orderItem],
        })),
      deleteOrderItem: (productId: number) =>
        set((state) => ({
          thisOrders: state.thisOrders.filter(
            (order) => order.productId !== productId
          ),
        })),
      clearOrder: () => {
        set({ thisOrders: [] });
      },
    }),
    {
      name: "order-store",
    }
  )
);
