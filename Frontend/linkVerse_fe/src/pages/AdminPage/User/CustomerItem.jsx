import { Button } from 'antd';
import React from 'react';

const CustomerItem = ({ item, index }) => {
    return (
        <tr className='items-center justify-center border-b'>
            <td className="px-4 py-2 ">
                <img src={item.images} alt={item.name}
                    className="w-10 h-10 rounded-full" />
            </td>
            <td className="px-4 py-2 font-medium">{item.name}</td>
            <td className="px-4 py-2 font-medium">{item.email}</td>
            <td className="px-4 py-2 font-medium">{item.role}</td>
            <td className="px-4 py-2">
                <Button className="px-4 py-2 font-semibold text-center bg-blue-500 rounded-lg cursor-pointer ">
                    Đặt lại mật khẩu
                </Button>
            </td>
        </tr>
    );
};

export default CustomerItem;