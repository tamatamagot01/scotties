import React, { useEffect, useState } from "react";
import closeButton from "@public/assets/icons/admin/reject.png";
import leftArrow from "@public/assets/icons/arrow-small-left.svg";
import { defaultProductValue, ProductType } from "../ProductManagement";
import Image from "next/image";
import { getAllBrand, getAllType } from "@/apis/productManagement";
import { deleteProduct, editProduct, getProductById } from "@/apis/products";

export default function SelectProduct({
  productId,
  onSelectedProduct,
}: {
  productId: number;
  onSelectedProduct: (product: ProductType) => void;
}) {
  // fetch product
  const [thisProduct, setThisProduct] = useState<ProductType>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById({ productId });

        setThisProduct(res.data);
      } catch (error) {
        console.error("Error to fetch product", error);
      }
    };

    fetchProduct();
  }, [productId]);

  // จัดการ message (success & fail ไว้ใช้ตอน alert)
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");

  // จัดการการ edit product
  const [isEditProduct, setIsEditProduct] = useState(false);

  const [selectedEdit, setSelectedEdit] = useState("");

  const [selectedOption, setSelectedOption] = useState("");
  const [editQuantityType, setEditQuantityType] = useState("");

  const [editContent, setEditContent] = useState("");

  const [brands, setBrands] = useState<{ name: string }[]>([]);
  const [types, setTypes] = useState<{ typeName: string }[]>([]);

  const handleClickEdit = async () => {
    setIsEditProduct(!isEditProduct);

    try {
      const brandResponse = await getAllBrand();
      const typeResponse = await getAllType();

      setBrands(brandResponse.data);
      setTypes(typeResponse.data);
    } catch (error) {
      console.error("Error to fetch data", error);
    }
  };

  const handleConfirmEdit = async () => {
    try {
      const res = await editProduct({
        productId,
        editType: selectedEdit,
        editContent,
      });

      setSuccessMessage(res.data.message);
      setThisProduct(res.data.editedProduct);
    } catch (error: any) {
      console.error("Error to edit product", error);
      setFailMessage(error.response.data.error);
    } finally {
      setInterval(() => {
        setSuccessMessage("");
        setFailMessage("");
      }, 5000);
    }
  };

  // จัดการการ delete product
  const [clickedDelete, setClickedDelete] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteProduct({
        productId,
        status: "delete",
      });

      setSuccessMessage(res.data.message);
      setThisProduct(res.data.deletedProduct);
      setClickedDelete(false);
    } catch (error: any) {
      console.error("Error to delete product", error);
      setFailMessage(error.response.data.error);
    } finally {
      setInterval(() => {
        setSuccessMessage("");
        setFailMessage("");
      }, 5000);
    }
  };

  // จัดการกรณีอยากให้ product กลับมา available
  const handleConfirmAvailable = async () => {
    try {
      const res = await deleteProduct({
        productId,
        status: "available",
      });

      setSuccessMessage(res.data.message);
      setThisProduct(res.data.deletedProduct);
      setClickedDelete(false);
    } catch (error: any) {
      console.error("Error to delete product", error);
      setFailMessage(error.response.data.error);
    } finally {
      setInterval(() => {
        setSuccessMessage("");
        setFailMessage("");
      }, 5000);
    }
  };

  return (
    thisProduct && (
      <div className="sm:mx-3">
        <div className="hidden sm:flex justify-between gap-2 sm:my-3">
          <div className="flex gap-2">
            <button className="btn sm:btn-xs">{`<`}</button>
            <button className="btn sm:btn-xs">{`>`}</button>
          </div>

          <div className="flex gap-2">
            {!clickedDelete && thisProduct.isActive && (
              <>
                <button className="btn sm:btn-xs" onClick={handleClickEdit}>
                  Edit Product
                </button>
                <button
                  className="btn sm:btn-xs btn-error"
                  onClick={() => setClickedDelete(true)}
                >
                  Delete Product
                </button>
              </>
            )}
            {clickedDelete && thisProduct.isActive && (
              <>
                <button
                  className="btn sm:btn-xs btn-error"
                  onClick={handleConfirmDelete}
                >
                  Confirm Delete
                </button>
                <button
                  className="btn sm:btn-xs btn-info"
                  onClick={() => setClickedDelete(false)}
                >
                  Not Now
                </button>
              </>
            )}
            {!thisProduct.isActive && (
              <>
                <button
                  className="btn btn-xs btn-success"
                  onClick={handleConfirmAvailable}
                >
                  Change product to available
                </button>
              </>
            )}
          </div>
        </div>

        <div className="sm:relative py-2 bg-indigo-100 sm:rounded-lg">
          <button
            className="w-full flex sm:absolute top-0 right-0 justify-end p-1"
            onClick={() => onSelectedProduct(defaultProductValue)}
          >
            <Image
              className="w-4"
              src={closeButton}
              alt="close-button"
              width={0}
              height={0}
            />
          </button>

          {successMessage !== "" && (
            <div className="flex justify-center">
              <div
                role="alert"
                className="absolute alert alert-success z-10 w-fit sm:px-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {failMessage !== "" && (
            <div className="flex justify-center">
              <div
                role="alert"
                className="absolute alert alert-error z-10 w-fit sm:px-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{failMessage}</span>
              </div>
            </div>
          )}

          <div className="sm:flex gap-5 sm:px-5">
            <div className="flex justify-center items-center">
              <img
                className="w-44 h-40"
                src={thisProduct.imageUrl}
                alt="product-image"
              />
            </div>

            <div
              className={`overflow-x-auto sm:w-[80%] ${
                !thisProduct.isActive && "opacity-40"
              }`}
            >
              <table className="table">
                <tbody>
                  <tr className="hover">
                    <th>ID:</th>
                    <td>{thisProduct.id}</td>
                  </tr>
                  <tr className="hover">
                    <th>Name:</th>
                    <td>{thisProduct.productName}</td>
                  </tr>
                  <tr className="hover">
                    <th>Brand:</th>
                    <td>{thisProduct.brand.name}</td>
                  </tr>
                  <tr className="hover">
                    <th>Type:</th>
                    <td>{thisProduct.type.typeName}</td>
                  </tr>
                  <tr className="hover">
                    <th>Price:</th>
                    <td>{thisProduct.price}</td>
                  </tr>
                  <tr className="hover">
                    <th>Description:</th>
                    <td>{thisProduct.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="sm:hidden px-3 flex justify-center gap-2">
            {!clickedDelete && thisProduct.isActive && (
              <>
                <button className="btn btn-sm" onClick={handleClickEdit}>
                  Edit Product
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => setClickedDelete(true)}
                >
                  Delete Product
                </button>
              </>
            )}
            {clickedDelete && thisProduct.isActive && (
              <>
                <button
                  className="btn btn-sm btn-error"
                  onClick={handleConfirmDelete}
                >
                  Confirm Delete
                </button>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => setClickedDelete(false)}
                >
                  Not Now
                </button>
              </>
            )}
            {!thisProduct.isActive && (
              <>
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleConfirmAvailable}
                >
                  Change product to available
                </button>
              </>
            )}
          </div>
        </div>

        <div className="w-full px-1 sm:px-0">
          <div className="stats shadow overflow-scroll w-full mt-3">
            {thisProduct.productOptions.map((option) => (
              <div className="stat p-3 sm:p-2">
                <div className="stat-title text-sm">{option.optionName}</div>
                <div className="stat-value text-lg">
                  {option.quantity}{" "}
                  <span className="stat-desc text-xs">Items</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isEditProduct && selectedEdit === "" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3">
            <div className="text-lg sm:text-xl mb-3 font-semibold">
              Select Edit
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                className="btn btn-sm sm:btn"
                onClick={() => setSelectedEdit("productName")}
              >
                Name
              </button>
              <button
                className="btn btn-sm sm:btn"
                onClick={() => setSelectedEdit("brand")}
              >
                Brand
              </button>
              <button
                className="btn btn-sm sm:btn"
                onClick={() => setSelectedEdit("type")}
              >
                Type
              </button>
              <button
                className="btn btn-sm sm:btn"
                onClick={() => setSelectedEdit("price")}
              >
                Price
              </button>
              <button
                className="btn btn-sm sm:btn"
                onClick={() => setSelectedEdit("quantity")}
              >
                Quantity
              </button>
              <button
                className="btn btn-sm sm:btn"
                onClick={() => setSelectedEdit("description")}
              >
                Description
              </button>
            </div>
          </div>
        )}

        {selectedEdit === "productName" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3">
            <div className="relative">
              <button
                className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                onClick={() => setSelectedEdit("")}
              >
                <Image
                  className="w-3 h-3"
                  src={leftArrow}
                  alt="back-icon"
                  width={0}
                  height={0}
                />
              </button>

              <div className="text-lg sm:text-xl font-semibold">Edit Name</div>
            </div>

            <input
              type="text"
              placeholder="Type here"
              className="input input-sm input-bordered w-full max-w-xs mt-2"
              onChange={(e) => setEditContent(e.target.value)}
            />
            <button className="btn btn-sm mt-4" onClick={handleConfirmEdit}>
              Confirm Edit
            </button>
          </div>
        )}

        {selectedEdit === "brand" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3">
            <div className="relative">
              <button
                className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                onClick={() => setSelectedEdit("")}
              >
                <Image
                  className="w-3 h-3"
                  src={leftArrow}
                  alt="back-icon"
                  width={0}
                  height={0}
                />
              </button>

              <div className="text-lg sm:text-xl font-semibold">Edit Brand</div>
            </div>

            <select
              className="select select-sm w-full max-w-xs mt-2"
              onChange={(e) => setEditContent(e.target.value)}
            >
              <option disabled selected>
                Select brand
              </option>
              {brands.map((brand) => (
                <option key={brand.name} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
            <button className="btn btn-sm mt-4" onClick={handleConfirmEdit}>
              Confirm Edit
            </button>
          </div>
        )}

        {selectedEdit === "type" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3">
            <div className="relative">
              <button
                className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                onClick={() => setSelectedEdit("")}
              >
                <Image
                  className="w-3 h-3"
                  src={leftArrow}
                  alt="back-icon"
                  width={0}
                  height={0}
                />
              </button>

              <div className="text-lg sm:text-xl font-semibold">Edit Type</div>
            </div>

            <select
              className="select select-sm w-full max-w-xs mt-2"
              onChange={(e) => setEditContent(e.target.value)}
            >
              <option disabled selected>
                Select type
              </option>
              {types.map((type) => (
                <option key={type.typeName} value={type.typeName}>
                  {type.typeName}
                </option>
              ))}
            </select>
            <button className="btn btn-sm mt-4" onClick={handleConfirmEdit}>
              Confirm Edit
            </button>
          </div>
        )}

        {selectedEdit === "price" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3">
            <div className="relative">
              <button
                className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                onClick={() => setSelectedEdit("")}
              >
                <Image
                  className="w-3 h-3"
                  src={leftArrow}
                  alt="back-icon"
                  width={0}
                  height={0}
                />
              </button>

              <div className="text-lg sm:text-xl font-semibold">Edit Price</div>
            </div>

            <input
              type="number"
              placeholder="Type here"
              className="input input-sm input-bordered w-full max-w-xs mt-2"
              onChange={(e) => setEditContent(String(e.target.value))}
            />
            <button className="btn btn-sm mt-4" onClick={handleConfirmEdit}>
              Confirm Edit
            </button>
          </div>
        )}

        {selectedEdit === "quantity" && (
          <div
            className={`${
              selectedOption !== "" && editQuantityType !== "" && "hidden"
            } flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3`}
          >
            <div className="relative">
              <button
                className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                onClick={() => setSelectedEdit("")}
              >
                <Image
                  className="w-3 h-3"
                  src={leftArrow}
                  alt="back-icon"
                  width={0}
                  height={0}
                />
              </button>

              <div className="text-lg sm:text-xl font-semibold">
                Edit Quantity
              </div>
            </div>

            <select
              className="select select-sm w-full max-w-xs mt-2"
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option disabled selected>
                Select option
              </option>
              {thisProduct.productOptions.map((option) => (
                <option
                  key={option.optionName}
                  value={option.optionName}
                >{`${option.optionName} ${option.quantity} item`}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                className="btn btn-sm mt-4"
                onClick={() => setEditQuantityType("Add")}
              >
                Add Quantity
              </button>
              <button
                className="btn btn-sm mt-4"
                onClick={() => setEditQuantityType("New")}
              >
                New Quantity
              </button>
            </div>
          </div>
        )}

        {selectedEdit === "quantity" &&
          selectedOption !== "" &&
          editQuantityType !== "" && (
            <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3">
              <div className="relative">
                <button
                  className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                  onClick={() => {
                    setSelectedOption("");
                    setEditQuantityType("");
                  }}
                >
                  <Image
                    className="w-3 h-3"
                    src={leftArrow}
                    alt="back-icon"
                    width={0}
                    height={0}
                  />
                </button>

                <div className="text-lg sm:text-xl font-semibold">
                  {editQuantityType} Quantity
                </div>
              </div>

              <input
                type="number"
                placeholder={`${editQuantityType} Quantity`}
                className="input input-sm input-bordered w-full max-w-xs mt-2"
                onChange={(e) =>
                  setEditContent(
                    editQuantityType +
                      " " +
                      selectedOption +
                      " " +
                      e.target.value
                  )
                }
              />

              <button className="btn btn-sm mt-4" onClick={handleConfirmEdit}>
                Confirm Edit
              </button>
            </div>
          )}

        {selectedEdit === "description" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3">
            <div className="relative">
              <button
                className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                onClick={() => setSelectedEdit("")}
              >
                <Image
                  className="w-3 h-3"
                  src={leftArrow}
                  alt="back-icon"
                  width={0}
                  height={0}
                />
              </button>

              <div className="text-lg sm:text-xl font-semibold">
                Edit Description
              </div>
            </div>

            <textarea
              className="textarea textarea-sm textarea-bordered w-full max-w-xs mt-2"
              placeholder="Type here"
              onChange={(e) => setEditContent(e.target.value)}
            ></textarea>
            <button className="btn btn-sm mt-4" onClick={handleConfirmEdit}>
              Confirm Edit
            </button>
          </div>
        )}
      </div>
    )
  );
}
