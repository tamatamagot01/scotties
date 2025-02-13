"use client";

import React, { useEffect, useState } from "react";
import { useProductManagementStore } from "@/store/zustand";
import { getProductInRange } from "@/apis/products";
import filterIcon from "@public/assets/icons/filter.png";
import closeIcon from "@public/assets/icons/admin/reject.png";
import brandIcon from "@public/assets/icons/admin/brand.png";
import typeIcon from "@public/assets/icons/admin/tshirt.png";
import priceIcon from "@public/assets/icons/admin/label.png";
import searchIcon from "@public/assets/icons/admin/search.png";
import totalSaleIcon from "@public/assets/icons/admin/invoice.png";
import ProductItem from "./productManagementComponent/ProductItem";
import CreateProduct from "./productManagementComponent/CreateProduct";
import SelectProduct from "./productManagementComponent/SelectProduct";
import Image from "next/image";

export type ProductType = {
  id: number;
  productName: string;
  description: string;
  imageUrl: string;
  brand: {
    name: string;
  };
  brandId: number;
  type: {
    typeName: string;
  };
  typeId: number;
  productOptions: {
    optionName: string;
    quantity: number;
  }[];
  totalSales: number;
  price: number;
  viewCount: number;
  isActive: string;
};

export const defaultProductValue = {
  id: 0,
  productName: "",
  description: "",
  imageUrl: "",
  brand: {
    name: "",
  },
  brandId: 0,
  type: {
    typeName: "",
  },
  typeId: 0,
  productOptions: [],
  totalSales: 0,
  price: 0,
  viewCount: 0,
  isActive: "",
};

export default function ProductManagement() {
  const { createProduct, setProductManagement } = useProductManagementStore();

  const [page, setPage] = useState(1);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [filterResult, setFilterResult] = useState<number>();

  const [selectedProduct, setSelectedProduct] =
    useState<ProductType>(defaultProductValue);

  // จัดการการ filter
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [filter, setFilter] = useState({
    brand: true,
    type: false,
    price: false,
    totalSale: false,
  });

  // // brand filter
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string[]>([]);

  const [selectedAllBrand, setSelectedAllBrand] = useState(false);

  const handleSelectedBrandFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    filter: string
  ) => {
    if (e.target.checked) {
      setSelectedBrandFilter((prevSelect) => [...prevSelect, filter]);
    } else {
      setSelectedBrandFilter((prevSelect) => [
        ...prevSelect.filter((select) => select !== filter),
      ]);
    }
  };

  // // type filter
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string[]>([]);

  const [selectedAllType, setSelectedAllType] = useState(false);

  const handleSelectedTypeFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    filter: string
  ) => {
    if (e.target.checked) {
      setSelectedTypeFilter((prevSelect) => [...prevSelect, filter]);
    } else {
      setSelectedTypeFilter((prevSelect) => [
        ...prevSelect.filter((select) => select !== filter),
      ]);
    }
  };

  // // price filter
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string[]>([]);

  const [selectedAllPrice, setSelectedAllPrice] = useState(false);

  const handleSelectedPriceFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    filter: string
  ) => {
    if (e.target.checked) {
      setSelectedPriceFilter((prevSelect) => [...prevSelect, filter]);
    } else {
      setSelectedPriceFilter((prevSelect) => [
        ...prevSelect.filter((select) => select !== filter),
      ]);
    }
  };

  // // price total sale
  const [selectedTotalSalesFilter, setSelectedTotalSalesFilter] = useState<
    string[]
  >([]);

  const [selectedAllTotalSales, setSelectedAllTotalSales] = useState(false);

  const handleSelectedTotalSalesFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    filter: string
  ) => {
    if (e.target.checked) {
      setSelectedTotalSalesFilter((prevSelect) => [...prevSelect, filter]);
    } else {
      setSelectedTotalSalesFilter((prevSelect) => [
        ...prevSelect.filter((select) => select !== filter),
      ]);
    }
  };

  // // ปุ่ม reset filter
  const handleResetFilter = () => {
    setSelectedBrandFilter([]);
    setSelectedAllBrand(false);

    setSelectedTypeFilter([]);
    setSelectedAllType(false);

    setSelectedPriceFilter([]);
    setSelectedAllPrice(false);

    setSelectedTotalSalesFilter([]);
    setSelectedAllTotalSales(false);
  };

  // // ปุ่ม find สำหรับ submit filter

  const [filterProduct, setFilterProduct] = useState({});

  const handleSubmitFilter = async () => {
    const filterObj = {
      brand: {
        all: selectedAllBrand,
        value: [...selectedBrandFilter],
      },
      type: {
        all: selectedAllType,
        value: [...selectedTypeFilter],
      },
      price: {
        all: selectedAllPrice,
        value: [...selectedPriceFilter],
      },
      totalSales: {
        all: selectedAllTotalSales,
        value: [...selectedTotalSalesFilter],
      },
    };

    setFilterProduct(filterObj);
  };

  // จัดการการ sort ในแต่ละหมวด (asc = น้อย -> มาก, desc = มาก -> น้อย)
  const [sortProduct, setSortProduct] = useState("id,asc");

  const handleSortId = async () => {
    if (sortProduct === "id,asc") {
      setSortProduct("id,desc");
    } else {
      setSortProduct("id,asc");
    }
  };

  const handleSortBrand = async () => {
    if (sortProduct === "brandId,asc") {
      setSortProduct("brandId,desc");
    } else {
      setSortProduct("brandId,asc");
    }
  };

  const handleSortType = async () => {
    if (sortProduct === "typeId,asc") {
      setSortProduct("typeId,desc");
    } else {
      setSortProduct("typeId,asc");
    }
  };

  const handleSortPrice = async () => {
    if (sortProduct === "price,asc") {
      setSortProduct("price,desc");
    } else {
      setSortProduct("price,asc");
    }
  };

  const handleSortTotalSales = async () => {
    if (sortProduct === "totalSales,asc") {
      setSortProduct("totalSales,desc");
    } else {
      setSortProduct("totalSales,asc");
    }
  };

  // จัดการการ search product
  const [searchInput, setSearchInput] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  const handleSubmitSearchProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchProduct(searchInput);
    setPage(1);
  };

  // fetch products ตาม page และ sort ที่เลือกมา
  useEffect(() => {
    const fetchSortedProducts = async () => {
      try {
        const res = await getProductInRange({
          page,
          sortProduct,
          searchProduct,
          filterProduct,
        });

        setProducts(res.data.products);
        setFilterResult(res.data.countProducts._count._all);
      } catch (error) {
        console.error("Error to sort price", error);
      }
    };

    fetchSortedProducts();
  }, [page, sortProduct, searchProduct, filterProduct]);

  return (
    <div className="relative w-full">
      {/* Product Controller Zone */}
      <div className="sm:flex justify-between gap-5 sm:mt-5 px-2 sm:px-5">
        <div className="relative sm:flex flex-row gap-5">
          <div className="sm:hidden w-full text-end my-2">
            <button
              className="btn btn-xs border-0"
              onClick={() => setProductManagement("createProduct")}
            >
              Create Product
            </button>
          </div>

          {isOpenFilter && (
            <div className="absolute z-20 bg-white shadow rounded-lg w-full h-fit">
              <div className="flex gap-1 justify-between items-center py-2 px-5">
                <div className="flex gap-1 items-center">
                  <Image
                    className="w-4 h-4"
                    src={filterIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div>Filter</div>
                </div>

                <button onClick={() => setIsOpenFilter(false)}>
                  <Image
                    className="w-4 h-4"
                    src={closeIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                </button>
              </div>

              <hr />

              <div className="flex gap-1 justify-between items-center py-2 px-5">
                <button
                  className={`flex gap-1 items-center ${
                    filter.brand && "border-b-2 border-indigo-400"
                  }`}
                  onClick={() =>
                    setFilter({
                      brand: true,
                      type: false,
                      price: false,
                      totalSale: false,
                    })
                  }
                >
                  <Image
                    className="hidden sm:block w-4 h-4"
                    src={brandIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div>Brand</div>
                </button>

                <button
                  className={`flex gap-1 items-center ${
                    filter.type && "border-b-2 border-emerald-400"
                  }`}
                  onClick={() =>
                    setFilter({
                      brand: false,
                      type: true,
                      price: false,
                      totalSale: false,
                    })
                  }
                >
                  <Image
                    className="hidden sm:block w-4 h-4"
                    src={typeIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div>Type</div>
                </button>

                <button
                  className={`flex gap-1 items-center ${
                    filter.price && "border-b-2 border-yellow-400"
                  }`}
                  onClick={() =>
                    setFilter({
                      brand: false,
                      type: false,
                      price: true,
                      totalSale: false,
                    })
                  }
                >
                  <Image
                    className="hidden sm:block w-4 h-4"
                    src={priceIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div>Price</div>
                </button>

                <button
                  className={`flex gap-1 items-center ${
                    filter.totalSale && "border-b-2 border-rose-400"
                  }`}
                  onClick={() =>
                    setFilter({
                      brand: false,
                      type: false,
                      price: false,
                      totalSale: true,
                    })
                  }
                >
                  <Image
                    className="hidden sm:block w-4 h-4"
                    src={totalSaleIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div>Total Sales</div>
                </button>
              </div>

              <hr />

              {(selectedAllBrand ||
                selectedAllType ||
                selectedAllPrice ||
                selectedAllTotalSales ||
                selectedBrandFilter.length > 0 ||
                selectedTypeFilter.length > 0 ||
                selectedPriceFilter.length > 0 ||
                selectedTotalSalesFilter.length > 0) && (
                <div className="flex gap-1 items-center py-2 px-5 overflow-scroll">
                  {selectedAllBrand && (
                    <div className="bg-indigo-300 shadow px-2 rounded-xl whitespace-nowrap">
                      {selectedAllBrand && "All Brand"}
                    </div>
                  )}

                  {!selectedAllBrand && (
                    <>
                      {selectedBrandFilter.map((filter, index) => (
                        <div
                          key={index}
                          className="border border-indigo-400 shadow px-2 rounded-xl whitespace-nowrap"
                        >
                          {filter}
                        </div>
                      ))}
                    </>
                  )}

                  {selectedAllType && (
                    <div className="bg-emerald-300 shadow px-2 rounded-xl whitespace-nowrap">
                      {selectedAllType && "All Type"}
                    </div>
                  )}

                  {!selectedAllType && (
                    <>
                      {selectedTypeFilter.map((filter, index) => (
                        <div
                          key={index}
                          className="border border-emerald-400 shadow px-2 rounded-xl whitespace-nowrap"
                        >
                          {filter}
                        </div>
                      ))}
                    </>
                  )}

                  {selectedAllPrice && (
                    <div className="bg-yellow-300 shadow px-2 rounded-xl whitespace-nowrap">
                      {selectedAllPrice && "All Price"}
                    </div>
                  )}

                  {!selectedAllPrice && (
                    <>
                      {selectedPriceFilter.map((filter, index) => (
                        <div
                          key={index}
                          className="border border-yellow-400 shadow px-2 rounded-xl whitespace-nowrap"
                        >
                          {filter}
                        </div>
                      ))}
                    </>
                  )}

                  {selectedAllTotalSales && (
                    <div className="bg-rose-300 shadow px-2 rounded-xl whitespace-nowrap">
                      {selectedAllTotalSales && "All Total Sales"}
                    </div>
                  )}

                  {!selectedAllTotalSales && (
                    <>
                      {selectedTotalSalesFilter.map((filter, index) => (
                        <div
                          key={index}
                          className="border border-rose-400 shadow px-2 rounded-xl whitespace-nowrap"
                        >
                          {filter}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {(selectedAllBrand ||
                selectedAllType ||
                selectedAllPrice ||
                selectedAllTotalSales ||
                selectedBrandFilter.length > 0 ||
                selectedTypeFilter.length > 0 ||
                selectedPriceFilter.length > 0 ||
                selectedTotalSalesFilter.length > 0) && <hr />}

              {filter.brand && (
                <div className="form-control grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 px-5 py-2">
                  <label className="label cursor-pointer">
                    <span className="label-text font-bold">All Brand</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={selectedAllBrand}
                      onChange={(e) => {
                        setSelectedAllBrand(e.target.checked ? true : false);
                      }}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Adidas</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Adidas") ||
                        selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) => handleSelectedBrandFilter(e, "Adidas")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Asics</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Asics") ||
                        selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) => handleSelectedBrandFilter(e, "Asics")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Converse</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Converse") ||
                        selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) => handleSelectedBrandFilter(e, "Converse")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Fila</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Fila") || selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) => handleSelectedBrandFilter(e, "Fila")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Jordan</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Jordan") ||
                        selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) => handleSelectedBrandFilter(e, "Jordan")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">New-Balance</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("New-Balance") ||
                        selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) =>
                        handleSelectedBrandFilter(e, "New-Balance")
                      }
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Nike</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Nike") || selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) => handleSelectedBrandFilter(e, "Nike")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Puma</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Puma") || selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) => handleSelectedBrandFilter(e, "Puma")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Reebok</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Reebok") ||
                        selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) => handleSelectedBrandFilter(e, "Reebok")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Timberland</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Timberland") ||
                        selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) =>
                        handleSelectedBrandFilter(e, "Timberland")
                      }
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Vans</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedBrandFilter.includes("Vans") || selectedAllBrand
                      }
                      disabled={selectedAllBrand}
                      onChange={(e) => handleSelectedBrandFilter(e, "Vans")}
                    />
                  </label>
                </div>
              )}

              {filter.type && (
                <div className="form-control grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 px-5 py-2">
                  <label className="label cursor-pointer">
                    <span className="label-text font-bold">All Type</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={selectedAllType}
                      onChange={(e) =>
                        setSelectedAllType(e.target.checked ? true : false)
                      }
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Shoes</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedTypeFilter.includes("Shoes") || selectedAllType
                      }
                      disabled={selectedAllType}
                      onChange={(e) => handleSelectedTypeFilter(e, "Shoes")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">T-Shirt</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedTypeFilter.includes("T-Shirt") ||
                        selectedAllType
                      }
                      disabled={selectedAllType}
                      onChange={(e) => handleSelectedTypeFilter(e, "T-Shirt")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Pants</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedTypeFilter.includes("Pants") || selectedAllType
                      }
                      disabled={selectedAllType}
                      onChange={(e) => handleSelectedTypeFilter(e, "Pants")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Hoodies</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedTypeFilter.includes("Hoodies") ||
                        selectedAllType
                      }
                      disabled={selectedAllType}
                      onChange={(e) => handleSelectedTypeFilter(e, "Hoodies")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Jacket</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedTypeFilter.includes("Jacket") || selectedAllType
                      }
                      disabled={selectedAllType}
                      onChange={(e) => handleSelectedTypeFilter(e, "Jacket")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Acc</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedTypeFilter.includes("Acc") || selectedAllType
                      }
                      disabled={selectedAllType}
                      onChange={(e) => handleSelectedTypeFilter(e, "Acc")}
                    />
                  </label>
                </div>
              )}

              {filter.price && (
                <>
                  <div className="form-control gap-1 sm:gap-2 px-5 py-2">
                    <label className="label cursor-pointer">
                      <span className="label-text font-bold">All Price</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={selectedAllPrice}
                        onChange={(e) =>
                          setSelectedAllPrice(e.target.checked ? true : false)
                        }
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text">{`< 3000`}</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={
                          selectedPriceFilter.includes("< 3000") ||
                          selectedAllPrice
                        }
                        disabled={selectedAllPrice}
                        onChange={(e) => handleSelectedPriceFilter(e, "< 3000")}
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text">3001-5000</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={
                          selectedPriceFilter.includes("3001 - 5000") ||
                          selectedAllPrice
                        }
                        disabled={selectedAllPrice}
                        onChange={(e) =>
                          handleSelectedPriceFilter(e, "3001 - 5000")
                        }
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text">5001-7000</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={
                          selectedPriceFilter.includes("5001 - 7000") ||
                          selectedAllPrice
                        }
                        disabled={selectedAllPrice}
                        onChange={(e) =>
                          handleSelectedPriceFilter(e, "5001 - 7000")
                        }
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text">7001-10000</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={
                          selectedPriceFilter.includes("7001 - 10000") ||
                          selectedAllPrice
                        }
                        disabled={selectedAllPrice}
                        onChange={(e) =>
                          handleSelectedPriceFilter(e, "7001 - 10000")
                        }
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text">{`> 10000`}</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={
                          selectedPriceFilter.includes("> 10000") ||
                          selectedAllPrice
                        }
                        disabled={selectedAllPrice}
                        onChange={(e) =>
                          handleSelectedPriceFilter(e, "> 10000")
                        }
                      />
                    </label>
                  </div>
                </>
              )}

              {filter.totalSale && (
                <>
                  <div className="form-control gap-1 sm:gap-2 px-5 py-2">
                    <label className="label cursor-pointer">
                      <span className="label-text font-bold">
                        All Total Sales
                      </span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={selectedAllTotalSales}
                        onChange={(e) =>
                          setSelectedAllTotalSales(
                            e.target.checked ? true : false
                          )
                        }
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text">{`< 10`}</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={
                          selectedTotalSalesFilter.includes("< 10") ||
                          selectedAllTotalSales
                        }
                        disabled={selectedAllTotalSales}
                        onChange={(e) =>
                          handleSelectedTotalSalesFilter(e, "< 10")
                        }
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text">11-50</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={
                          selectedTotalSalesFilter.includes("11 - 50") ||
                          selectedAllTotalSales
                        }
                        disabled={selectedAllTotalSales}
                        onChange={(e) =>
                          handleSelectedTotalSalesFilter(e, "11 - 50")
                        }
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text">51-100</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={
                          selectedTotalSalesFilter.includes("51 - 100") ||
                          selectedAllTotalSales
                        }
                        disabled={selectedAllTotalSales}
                        onChange={(e) =>
                          handleSelectedTotalSalesFilter(e, "51 - 100")
                        }
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text">{`> 100`}</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs sm:checkbox-sm"
                        checked={
                          selectedTotalSalesFilter.includes("> 100") ||
                          selectedAllTotalSales
                        }
                        disabled={selectedAllTotalSales}
                        onChange={(e) =>
                          handleSelectedTotalSalesFilter(e, "> 100")
                        }
                      />
                    </label>
                  </div>
                </>
              )}

              <hr />

              <div className="flex gap-1 justify-between items-center py-2 px-5">
                <button
                  className="btn btn-sm"
                  disabled={
                    !selectedAllBrand &&
                    !selectedAllType &&
                    !selectedAllPrice &&
                    !selectedAllTotalSales &&
                    selectedBrandFilter.length === 0 &&
                    selectedTypeFilter.length === 0 &&
                    selectedPriceFilter.length === 0 &&
                    selectedTotalSalesFilter.length === 0
                  }
                  onClick={handleResetFilter}
                >
                  Reset
                </button>

                <button
                  className="btn btn-neutral btn-sm flex items-center gap-1"
                  disabled={
                    !selectedAllBrand &&
                    !selectedAllType &&
                    !selectedAllPrice &&
                    !selectedAllTotalSales &&
                    selectedBrandFilter.length === 0 &&
                    selectedTypeFilter.length === 0 &&
                    selectedPriceFilter.length === 0 &&
                    selectedTotalSalesFilter.length === 0
                  }
                  onClick={handleSubmitFilter}
                >
                  <Image
                    className="w-4 h-4"
                    src={searchIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div className="text-sm sm:text-vase">Find</div>
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              className="btn btn-sm"
              onClick={() => setIsOpenFilter(true)}
            >
              Filter
            </button>
            <form onSubmit={handleSubmitSearchProduct}>
              <input
                className="input input-sm input-bordered w-full sm:w-96 max-w-xs"
                type="text"
                placeholder="Search Product ID/ Name"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          </div>

          <div className="mt-2 sm:mt-0 text-sm flex justify-center items-center">
            Filter result {filterResult} items
          </div>

          <div className="mt-1 sm:mt-0 flex gap-1 items-center justify-center">
            <button
              className="btn btn-xs"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >{`<`}</button>
            <input
              className="bg-white w-7 h-fit text-center rounded-lg"
              type="number"
              value={page}
              min={1}
              onChange={(e) => setPage(Number(e.target.value))}
            />
            <button
              className="btn btn-xs"
              onClick={() => setPage(page + 1)}
            >{`>`}</button>
          </div>
        </div>

        <div className="hidden sm:block">
          <button
            className="btn btn-sm"
            onClick={() => setProductManagement("createProduct")}
          >
            Create Product
          </button>
        </div>
      </div>

      {/* Product Display Zone */}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <button
                  className="flex items-center gap-2"
                  onClick={handleSortId}
                >
                  <div>ID</div>
                  <div>
                    <div
                      className={`${
                        sortProduct === "id,desc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortProduct === "id,asc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                  </div>
                </button>
              </th>
              <th>Name</th>
              <th>
                <button
                  className="flex items-center gap-2"
                  onClick={handleSortBrand}
                >
                  <div>Brand</div>
                  <div>
                    <div
                      className={`${
                        sortProduct === "brandId,desc"
                          ? "text-red-500"
                          : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortProduct === "brandId,asc"
                          ? "text-red-500"
                          : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                  </div>
                </button>
              </th>
              <th>
                <button
                  className="flex items-center gap-2"
                  onClick={handleSortType}
                >
                  <div>Type</div>
                  <div>
                    <div
                      className={`${
                        sortProduct === "typeId,desc"
                          ? "text-red-500"
                          : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortProduct === "typeId,asc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                  </div>
                </button>
              </th>
              <th>
                <button
                  className="flex items-center gap-2"
                  onClick={handleSortPrice}
                >
                  <div>Price</div>
                  <div>
                    <div
                      className={`${
                        sortProduct === "price,desc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortProduct === "price,asc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                  </div>
                </button>
              </th>
              <th>
                <button
                  className="flex items-center gap-2"
                  onClick={handleSortTotalSales}
                >
                  <div>Total Sales</div>
                  <div>
                    <div
                      className={`${
                        sortProduct === "totalSales,desc"
                          ? "text-red-500"
                          : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortProduct === "totalSales,asc"
                          ? "text-red-500"
                          : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                  </div>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductItem
                key={product.id}
                props={product}
                onSelectedProduct={setSelectedProduct}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedProduct.id !== 0 && (
        <div className="absolute top-0 bg-indigo-200 w-full h-full">
          <SelectProduct
            productId={selectedProduct.id}
            onSelectedProduct={setSelectedProduct}
          />
        </div>
      )}

      {createProduct ? <CreateProduct /> : null}
    </div>
  );
}
