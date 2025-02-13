import React, { useEffect, useState } from "react";
import { getFiveMostViewProduct } from "@/apis/products";
import Link from "next/link";
import { useSearchBar } from "@/store/zustand";

type CategoryProp = {
  category: string;
};

type ProductProp = {
  productName: string;
  brand: {
    name: string;
  };
  imageUrl: string;
  price: number;
  type: Record<string, unknown>;
  id: number;
};

type ProductsResponse = {
  data: ProductProp[];
};

export default function Categories({ category }: CategoryProp) {
  const [isLoading, setIsLoading] = useState(true);
  const [sampleProducts, setSampleProducts] = useState<ProductProp[]>([]);

  const { isOpenSearchBar } = useSearchBar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const res: ProductsResponse = await getFiveMostViewProduct({
          category,
        });
        setSampleProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [category]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-secondary w-[10%]"></span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-3 mt-3 md:flex md:flex-row md:px-10 md:mt-6">
      {sampleProducts.map((product) =>
        isOpenSearchBar ? (
          <div
            className="flex flex-col justify-center md:justify-start items-center w-3/4 border rounded-xl py-2 md:h-80"
            key={product.productName}
          >
            <img
              className="w-full md:h-40 md:object-contain"
              src={product.imageUrl}
              alt={product.productName}
            />
            <div className="font-medium px-3 text-center md:h-32">
              {product.productName.substring(0, 1).toUpperCase() +
                product.productName.substring(1, 20)}
              <span>{product.productName.length > 20 ? "..." : ""}</span>
            </div>
            <div className="text-sm">{product.price} THB</div>
          </div>
        ) : (
          <Link
            href={`/store/product/${product.brand.name.toLowerCase()}?product-id=${
              product.id
            }`}
            className="flex flex-col justify-center md:justify-start items-center w-3/4 border rounded-xl py-2 md:h-80"
            key={product.productName}
          >
            <img
              className="w-full md:h-40 md:object-contain"
              src={product.imageUrl}
              alt={product.productName}
            />
            <div className="font-medium px-3 text-center md:h-32">
              {product.productName.substring(0, 1).toUpperCase() +
                product.productName.substring(1, 20)}
              <span>{product.productName.length > 20 ? "..." : ""}</span>
            </div>
            <div className="text-sm">{product.price} THB</div>
          </Link>
        )
      )}
    </div>
  );
}
