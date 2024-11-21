import React, { useEffect, useState } from 'react';
import { FaHouseUser } from "react-icons/fa";
import { Button } from 'antd';
import axios from 'axios';
import CustomerItem from './CustomerItem';

const Customer = () => {
    const [user, setUser] = useState([]); // ds all
    const [searchUser, setSearchUser] = useState(""); // từ khóa tìm kiếm
    const [filteredUsers, setFilteredUsers] = useState([]); // ds người dùng đã lọc

    const getUser = async () => {
        try {
            const res = await axios.get("https://673def430118dbfe86096cf6.mockapi.io/user");
            setUser(res.data);
        } catch (error) {
            alert("Lỗi kết nối với Server");
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleSearch = () => {
        const results = user.filter(
            (item) =>
                item.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                item.email.toLowerCase().includes(searchUser.toLowerCase())
        );
        setFilteredUsers(results);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchUser(value);
        if (value.trim() === "") {
            setFilteredUsers(user); // Khi ô input trống, hiển thị toàn bộ danh sách
        }
    };

    return (
        <div className='h-[calc(100vh-150px)] overflow-y-auto'>
            <div className="container px-20 ">
                <div className='flex items-center justify-center gap-5 mb-5'>
                    <FaHouseUser className='w-6 h-6' />
                    <h1 className='text-2xl font-bold'>QUẢN LÝ NGƯỜI DÙNG</h1>
                </div>
                <div className="flex items-center justify-center gap-5 mb-4">
                    <input
                        type="text"
                        placeholder="Nhập tên và email người dùng..."
                        className="w-1/2 px-6 py-3 border rounded-lg"
                        value={searchUser}
                        onChange={handleInputChange}
                    />
                    <button
                        style={{ backgroundColor: '#3B82F6' }}
                        className="px-2 py-2 text-white rounded-lg"
                        onClick={handleSearch}
                    >
                        Tìm kiếm
                    </button>
                </div>
                <table className="w-full mt-5 bg-white">
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
                        {filteredUsers.map((item, index) => (
                            <CustomerItem key={index} item={item} />
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
