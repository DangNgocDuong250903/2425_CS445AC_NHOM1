import React from 'react';
import { FaHouseUser } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Customer = () => {
    return (
        <div className="container px-20 ">
            <div className='flex items-center justify-center gap-5 mb-5'>
                <FaHouseUser className='w-6 h-6' />
                <h1 className='text-2xl font-bold'>QUẢN LÝ NGƯỜI DÙNG</h1>
            </div>
            <div className="flex justify-center gap-5 mb-4 items-cent">
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    className="w-1/2 px-6 py-3 border rounded-lg "
                />
                <button
                    style={{ backgroundColor: '#3B82F6' }}
                    className="px-2 py-2 text-white rounded-lg ">
                    Tìm kiếm
                </button>
            </div>

            <table className="w-full mt-5 bg-white ">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left border-b">ẢNH</th>
                        <th className="px-4 py-2 text-left border-b">TÊN NGƯỜI DÙNG</th>
                        <th className="px-4 py-2 text-left border-b">EMAIL</th>
                        <th className="px-4 py-2 text-left border-b">VAI TRÒ</th>
                        <th className="px-4 py-2 text-left border-b">THAO TÁC</th>
                    </tr>
                </thead>

                <tbody>
                    <tr className='items-center justify-center border-b'>
                        <td className="px-4 py-2 ">
                            <img src="https://mighty.tools/mockmind-api/content/human/49.jpg" alt="Ảnh của Lê Thị Mỹ Linh"
                                className="w-10 h-10 rounded-full" />
                        </td>
                        <td className="px-4 py-2">Lê Thị Mỹ Linh</td>
                        <td className="px-4 py-2">mylinh.le@gmail.com</td>
                        <td className="px-4 py-2">2</td>
                        <td className="px-4 py-2">
                            <Button className="px-4 py-2 font-semibold text-center bg-blue-500 rounded-lg cursor-pointer ">
                                Đặt lại mật khẩu
                            </Button>
                        </td>
                    </tr>
                    <tr className='border-b'>
                        <td className="px-4 py-2 border-b">
                            <img src="https://mighty.tools/mockmind-api/content/human/60.jpg" alt="Ảnh của Phạm Minh Tuấn" className="w-10 h-10 rounded-full" />
                        </td>
                        <td className="px-4 py-2 ">Phạm Minh Tuấn</td>
                        <td className="px-4 py-2 ">tuan.pham@gmail.com</td>
                        <td className="px-4 py-2 ">2</td>
                        <td className="px-4 py-2">
                            <Button className="px-4 py-2 font-semibold text-center bg-blue-500 rounded-lg cursor-pointer ">
                                Đặt lại mật khẩu
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Customer;