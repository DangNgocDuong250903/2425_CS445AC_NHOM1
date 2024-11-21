import React, { useEffect, useState } from 'react';
import { FaHouseUser } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Button } from 'antd';
import { IoIosAddCircleOutline } from "react-icons/io";
import axios from 'axios';
import { data } from 'autoprefixer';
const Customer = () => {
    const [user, setUser] = useState([])

    const getUser = async () => {
        try {
            const res = await axios.get("https://673def430118dbfe86096cf6.mockapi.io/user");
            setUser(res.data);
        } catch (error) {
            alert("lỗi kết nối với Server")
        }
    }
    useEffect(() => {
        getUser();
    }, [])
    return (
        <div className='h-[calc(100vh-150px)] overflow-y-auto'>
            <div className="container px-20 ">
                <div className='flex items-center justify-center gap-5 mb-5'>
                    <FaHouseUser className='w-6 h-6' />
                    <h1 className='text-2xl font-bold'>QUẢN LÝ NGƯỜI DÙNG</h1>
                </div>
                <div className="flex items-center justify-center gap-5 mb-4">
                    {/* <div className=' w-[200px] bg-gray-300 rounded-md p-2 flex justify-center items-center gap-2 cursor-pointer '>
                        <IoIosAddCircleOutline className='w-6 h-6' />
                        <p className='text-lg font-medium'>Thêm Người Dùng</p>
                    </div> */}
                    <input
                        type="text"
                        placeholder="Nhập tên và email người dùng..."
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
                        {user.map((item, index) => (
                            <tr key={index} className='items-center justify-center border-b'>
                                <td className="px-4 py-2 ">
                                    <img src={item.images} alt={item.name}
                                        className="w-10 h-10 rounded-full" />
                                </td>
                                <td className="px-4 py-2 font-medium">{item.name}</td>
                                <td className="px-4 py-2 font-medium">{item.email}</td>
                                <td className="px-4 py-2 font-medium">2</td>
                                <td className="px-4 py-2">
                                    <Button className="px-4 py-2 font-semibold text-center bg-blue-500 rounded-lg cursor-pointer ">
                                        Đặt lại mật khẩu
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-center py-5 bg-gray-100">
                <Button className="mx-2">Trước</Button>
                <Button className="mx-2">1</Button>
                <Button className="mx-2">2</Button>
                <Button className="mx-2">Tiếp</Button>
            </div>
        </div>
    );
};

export default Customer;