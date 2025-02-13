import React from "react";
import { ProductType } from "../ProductManagement";

export default function ProductItem({
  props,
  onSelectedProduct,
}: {
  props: ProductType;
  onSelectedProduct: (product: ProductType) => void;
}) {
  const { id, productName, brand, type, price, totalSales } = props;

  return (
    <tr
      className="hover cursor-pointer"
      onClick={() => onSelectedProduct(props)}
    >
      <th>{id}</th>
      <td>
        {productName.length > 15
          ? `${productName.substring(0, 15)}...`
          : productName}
      </td>
      <td>{brand.name}</td>
      <td>{type.typeName}</td>
      <td>{price}</td>
      <td>{totalSales}</td>
    </tr>
  );
}
