import { data } from 'autoprefixer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { get } from 'react-hook-form';
import { CiUnlock } from 'react-icons/ci';
import { GoBlocked } from 'react-icons/go';
import { GrGroup } from "react-icons/gr";

const Group = () => {
    const [group, setGroup] = useState([])

    const getGroup = async () => {
        try {
            const res = await axios.get("http://localhost:3000/Group")
            setGroup(res.data)
        } catch (err) {
            console.error("Lỗi kết nối với server:", error);
            alert("Lỗi kết nối với server");
        }
    }
    useEffect(() => {
        getGroup()
    }, [])
    return (
        <div className='px-20'>
            <div className='flex items-center justify-center gap-5 mb-5'>
                <GrGroup className='w-6 h-6' />
                <h1 className='text-2xl font-bold'>QUẢN LÝ NHÓM</h1>
            </div>
            <div className="flex justify-center gap-5 mb-4 items-cent">
                <input
                    type="text"
                    placeholder="Tìm kiếm tên nhóm..."
                    className="w-1/2 px-6 py-3 border rounded-lg "

                />
                <button
                    style={{ backgroundColor: '#3B82F6' }}
                    className="px-2 py-2 text-white rounded-lg "

                >
                    Tìm kiếm
                </button>

            </div>
            <table className="w-full mt-5 bg-white ">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">ẢNH</th>
                        <th className="px-4 py-2 border-b">TÊN NHÓM</th>
                        <th className="px-4 py-2 border-b">THÀNH VIÊN</th>
                        <th className="px-4 py-2 border-b">TRẠNG THÁI</th>
                        <th className="px-4 py-2 border-b">NGÀY TẠO NHÓM</th>
                        <th className="px-4 py-2 border-b">THAO TÁC</th>
                    </tr>
                </thead>
                <tbody>
                    {group.map((item, index) => (
                        <tr key={index} className='items-center justify-center text-center border-b'>
                            <td className="px-4 py-2 ">
                                <img src={item.images} alt={item.name}
                                    className="w-10 h-10 rounded-full" />
                            </td>
                            <td className="px-4 py-2 font-medium">{item.name}</td>
                            <td className="px-4 py-2 font-medium">{item.members} người</td>
                            <td className="px-4 py-2">
                                <p className={` font-medium mx-auto  ${item.status === 'công khai' ? 'text-green-500' : 'text-red-500'}`}>
                                    {item.status}
                                </p>
                            </td>
                            <td className="px-4 py-2">{new Date(item.created_date).toLocaleDateString('vi-VN')}</td>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Group;