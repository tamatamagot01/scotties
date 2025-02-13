import React from "react";
import { OrderType } from "../OrderManagement";

export default function OrderItem({
  props,
  onSelectedOrder,
}: {
  props: OrderType;
  onSelectedOrder: (order: OrderType) => void;
}) {
  const { id, user, status, totalAmount } = props;

  return (
    <tr className="hover cursor-pointer" onClick={() => onSelectedOrder(props)}>
      <th>{id}</th>
      <td>{user.firstName}</td>
      <td>{status}</td>
      <td>{totalAmount}</td>
    </tr>
  );
}
