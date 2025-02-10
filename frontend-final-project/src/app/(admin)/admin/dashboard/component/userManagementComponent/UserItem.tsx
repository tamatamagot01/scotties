import React from "react";
import { UserType } from "../UserManagement";

export default function UserItem({
  props,
  onSelectedUser,
}: {
  props: UserType;
  onSelectedUser: (user: UserType) => void;
}) {
  const { id, firstName, lastName, email, role } = props;

  return (
    <tr className="hover cursor-pointer" onClick={() => onSelectedUser(props)}>
      <th>{id}</th>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{email}</td>
      <td>{role.roleName}</td>
    </tr>
  );
}
