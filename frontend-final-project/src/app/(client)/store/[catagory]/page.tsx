"use client";

import Image from "next/image";
import filterIcon from "@public/assets/icons/filter.png";
import minusIcon from "@public/assets/icons/minus.png";
import plusIcon from "@public/assets/icons/plus.png";
import { useEffect, useState, useMemo } from "react";
import { getAllBrand, getAllType } from "@/apis/productManagement";
import { getProducts } from "@/apis/products";
import ProductItem from "./components/ProductItem";
import { useSearchBar } from "@/store/zustand";

export default function StoreBrand({
  params,
}: {
  params: { catagory: string };
}) {
  // ใช้กำหนด catagory ที่ต้องการแสดง จาก params ที่ส่งมา
  const selectedCatagory =
    params.catagory[0].toUpperCase() +
    params.catagory.substring(1, params.catagory.length);

  const [isLoading, setIsLoading] = useState(true);

  const { isOpenSearchBar } = useSearchBar();

  const [isOpenFilter, setIsOpenFilter] = useState(false);

  // ใช้จัดการกำหนด filter ตาม brand, type, gender สำหรับแสดงบน front-end ว่าเลือก filter อะไรบ้าง
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  // ใช้จัดการกำหนด filter ตาม brand, type, gender สำหรับส่งไป backend ในการ filter
  const [groupFilter, setGroupFilter] = useState({
    brand: [],
    type: [],
    gender: [],
  });
  const [selectPage, setSelectPage] = useState(1);

  const [brands, setBrands] = useState<Record<string, string>[]>([]);
  const [types, setTypes] = useState<Record<string, string>[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);

  // ใช้จัดการการ fetch data จาก backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandNameData = await getAllBrand();
        const typeNameData = await getAllType();
        const products = await getProducts(selectedCatagory);

        setBrands(brandNameData.data);
        setTypes(typeNameData.data);
        setProducts(products.data);
      } catch (error) {
        console.error("Error to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCatagory]);

  // ใช้จัดการ Sort by
  const sortedProducts = useMemo(() => {
    if (sortBy === "latest") {
      return [...products];
    } else if (sortBy === "lowToHigh") {
      return [...products].sort(
        (a, b) =>
          (a as { price: number }).price - (b as { price: number }).price
      );
    } else if (sortBy === "highToLow") {
      return [...products].sort(
        (a, b) =>
          (b as { price: number }).price - (a as { price: number }).price
      );
    }
    return products;
  }, [products, sortBy]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-secondary w-[10%]"></span>
      </div>
    );
  }

  // ใช้จัดการเพิ่ม filter ตาม checkbox ที่ถูกเลือก
  const handleSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
    group: "brand" | "type" | "gender"
  ) => {
    if (event.target.checked) {
      setSelectedFilter((prev) => [...prev, event.target.value]);
      setGroupFilter((prev) => ({
        ...prev,
        [group]: [...prev[group], event.target.value],
      }));
    } else {
      setSelectedFilter((prev) =>
        prev.filter((selected) => selected !== event.target.value)
      );
      setGroupFilter((prev) => ({
        ...prev,
        [group]: prev[group].filter((item) => item !== event.target.value),
      }));
    }
  };

  // หากมีการเลือก filter เมื่อกด Show Result จะดึง products ผ่าน function นี้แทน
  const handleShowResult = async () => {
    const selectedFilter = groupFilter;

    const products = await getProducts("", selectedFilter);
    setProducts(products.data);
    setIsOpenFilter(false);
  };

  const handleResetFilter = () => {
    setSelectedFilter([]);
    setGroupFilter({
      brand: [],
      type: [],
      gender: [],
    });
  };

  return (
    <div className={`${isOpenSearchBar && "opacity-30"}`}>
      {/* header */}
      <div className="relative px-3">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li className="underline">{selectedCatagory}</li>
          </ul>
        </div>

        <div className="flex justify-between items-center pb-3">
          <h1 className="text-xl font-medium">{selectedCatagory}</h1>
          <div className="text-sm">{`${products.length} Results`}</div>
        </div>

        <div className="flex justify-between items-center">
          <button
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-secondary"
            onClick={() => setIsOpenFilter(!isOpenFilter)}
            disabled={isOpenSearchBar}
          >
            <Image
              className="w-4"
              src={filterIcon}
              alt="filter-icon"
              width={0}
              height={0}
            />
            {selectedFilter.length > 0 && (
              <div className="bg-primary text-text px-1 rounded-sm">
                {selectedFilter.length}
              </div>
            )}
          </button>

          <div className="flex gap-1 items-center text-xs">
            <div className="text-sm">Sort by:</div>
            <select
              className="select select-xs max-w-24 truncate bg-secondary"
              onChange={(e) => setSortBy(e.target.value)}
              disabled={isOpenSearchBar}
            >
              <option className="truncate" value="latest">
                Latest
              </option>
              <option className="truncate" value="lowToHigh">
                Price low to high
              </option>
              <option className="truncate" value="highToLow">
                Price high to low
              </option>
            </select>
          </div>
        </div>
      </div>

      <hr className="w-full mt-2" />

      {/* หน้าสำหรับเลือกการ filter */}
      {isOpenFilter && !isOpenSearchBar && (
        <div className="absolute border border-black bg-white w-full flex flex-col gap-5 pt-2 pb-7 px-3 z-10">
          <div className="flex flex-row justify-between">
            <div className="text-lg font-medium">Filter</div>
            {/* แก้ตรง reset filter ให้ checkbox กลับไปเป็นแบบไม่ติ๊กถูก (อาจต้องใช้ useMemo ไปศึกษาดู) */}
            <button className="underline" onClick={handleResetFilter}>
              Reset Filter
            </button>
          </div>
          {/* flex flex-row gap-1 */}
          <div className="grid grid-cols-2">
            {selectedFilter.map((select, index) => (
              <div
                className="border px-2 rounded-2xl flex justify-between items-center bg-slate-100"
                key={`filter${index + 1}`}
              >
                <div>{select}</div>
                <button className="bg-slate-400 rounded-btn h-1/2 text-xs flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="text-base font-medium">Brand</div>
            <ul>
              {brands.map((brand) => (
                <div
                  className={`flex ${
                    selectedFilter.includes(brand.name)
                      ? "opacity-100"
                      : "opacity-50"
                  } justify-between`}
                  key={brand.name}
                >
                  <li className="text-sm">{brand.name}</li>
                  <input
                    type="checkbox"
                    value={brand.name}
                    checked={selectedFilter.includes(brand.name)}
                    onChange={(e) => handleSelected(e, "brand")}
                  />
                </div>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-base font-medium">Type</div>
            <ul>
              {types.map((type) => (
                <div
                  // ใส่ condition ว่าถ้าเลือกอันไหน ให้ opacity กลายเป็น 100
                  className={`flex ${
                    selectedFilter.includes(type.typeName)
                      ? "opacity-100"
                      : "opacity-50"
                  } justify-between`}
                  key={type.typeName}
                >
                  <li className="text-sm">{type.typeName}</li>
                  <input
                    type="checkbox"
                    value={type.typeName}
                    checked={selectedFilter.includes(type.typeName)}
                    onChange={(e) => handleSelected(e, "type")}
                  />
                </div>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-base font-medium">Gender</div>
            <ul>
              <div
                // ใส่ condition ว่าถ้าเลือกอันไหน ให้ opacity กลายเป็น 100
                className={`flex ${
                  selectedFilter.includes("Men") ? "opacity-100" : "opacity-50"
                } justify-between`}
              >
                <li className="text-sm">Men</li>
                <input
                  type="checkbox"
                  value="Men"
                  checked={selectedFilter.includes("Men")}
                  onChange={(e) => handleSelected(e, "gender")}
                />
              </div>
              <div
                // ใส่ condition ว่าถ้าเลือกอันไหน ให้ opacity กลายเป็น 100
                className={`flex ${
                  selectedFilter.includes("Women")
                    ? "opacity-100"
                    : "opacity-50"
                } justify-between`}
              >
                <li className="text-sm">Women</li>
                <input
                  type="checkbox"
                  value="Women"
                  checked={selectedFilter.includes("Women")}
                  onChange={(e) => handleSelected(e, "gender")}
                />
              </div>
              <div
                // ใส่ condition ว่าถ้าเลือกอันไหน ให้ opacity กลายเป็น 100
                className={`flex ${
                  selectedFilter.includes("Kids") ? "opacity-100" : "opacity-50"
                } justify-between`}
              >
                <li className="text-sm">Kids</li>
                <input
                  type="checkbox"
                  value="Kids"
                  checked={selectedFilter.includes("Kids")}
                  onChange={(e) => handleSelected(e, "gender")}
                />
              </div>
            </ul>
          </div>

          <div className="border rounded-md bg-secondary w-full py-1 text-center">
            <button onClick={handleShowResult}>Show Results</button>
          </div>
        </div>
      )}

      {/* พื้นที่แสดงสินค้า (ProductItems) */}
      <div
        className={`flex flex-col justify-center items-center gap-5 bg-slate-100 pt-5 ${
          isOpenFilter && "opacity-30"
        }`}
      >
        {sortedProducts
          .slice(10 * selectPage - 10, 10 * selectPage)
          .map((product: Record<string, unknown>) => (
            <ProductItem
              key={product.productName as string}
              productName={product.productName as string}
              brand={(product.brand as Record<string, unknown>).name as string}
              price={product.price as number}
              imageUrl={product.imageUrl as string}
              productId={product.id as number}
            />
          ))}
      </div>

      <div className="w-full flex flex-col justify-center items-center bg-slate-100 py-5">
        <div className="flex justify-center items-center gap-3">
          <button
            className="btn btn-xs bg-secondary"
            onClick={() => setSelectPage((currentPage) => currentPage - 1)}
            disabled={selectPage === 1}
          >
            <Image
              className="w-2"
              src={minusIcon}
              alt="minus-button"
              width={0}
              height={0}
            />
          </button>
          <button
            className="btn btn-xs bg-secondary"
            onClick={() => setSelectPage((currentPage) => currentPage + 1)}
            disabled={selectPage === Math.floor((products.length + 10) / 10)}
          >
            <Image
              className="w-2"
              src={plusIcon}
              alt="plus-button"
              width={0}
              height={0}
            />
          </button>
        </div>
        <div className="text-xs pt-2">Page {selectPage}</div>
      </div>
    </div>
  );
}
