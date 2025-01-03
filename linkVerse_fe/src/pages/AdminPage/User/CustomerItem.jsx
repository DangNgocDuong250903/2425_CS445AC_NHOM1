import { Button } from "antd";
import React from "react";
import { GoBlocked } from "react-icons/go";
import { CiUnlock } from "react-icons/ci";

const CustomerItem = ({ item, index }) => {
  return (
    <tr className="items-center justify-center border-b">
      <td className="px-4 py-2 ">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-10 h-10 rounded-full"
        />
      </td>
      <td className="px-4 py-2 font-medium">{item.username}</td>
      <td className="px-4 py-2 font-medium">{item.email}</td>
      <td className="px-4 py-2 font-medium">{item.roles[0]?.name}</td>
      <td>
        <div className="flex justify-center gap-2 font-semibold cursor-pointer">
          <button className="flex items-center gap-2">
            <GoBlocked className="w-5 h-5 text-red-400" />
            <span className="text-center">Khóa</span>
          </button>
          <button className="flex items-center gap-2">
            <CiUnlock className="w-5 h-5 text-green-400" />
            <span className="text-center">Mở khóa</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerItem;
