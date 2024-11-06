import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [selectedLink, setSelectedLink] = useState(1);
    const navigate = useNavigate()
    const handleLinkClick = (linkIndex) => {
        setSelectedLink(linkIndex);
    };
    return (
        <div className="flex w-[800px] mx-auto pt-10 pb-10 border border-gray-200 shadow-md rounded-lg">
            <div className="w-1/3 p-4 bg-white rounded-md ">
                <ul className="flex flex-col ">

                    <Link 
                        to="/update_user"
                        onClick={() => handleLinkClick(1)}
                        className={`mb-4 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg ${selectedLink === 1 ? 'text-blue-500' : 'text-gray-700'}`}
                    >
                        Chỉnh sửa trang cá nhân
                    </Link>


                    <Link
                        to="/changepassword"
                        onClick={() => handleLinkClick(2)}
                        className={`mb-4 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg ${selectedLink === 2 ? 'text-blue-500' : 'text-gray-700'}`}
                    >
                        Đổi mật khẩu
                    </Link>

                    <Link

                        onClick={() => handleLinkClick(3)}
                        className={`mb-4 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg ${selectedLink === 3 ? 'text-blue-500' : 'text-gray-700'}`}
                    >
                        Trợ giúp
                    </Link>
                </ul>
            </div>
            <div className="w-3/4 p-8">
                <div className="flex items-center mb-8">
                    <img src="https://placehold.co/50x50" alt="User avatar" className="mr-4 rounded-full" />
                    <span className="font-bold">test2</span>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Mật khẩu cũ</label>
                    <input type="password" className="w-full p-2 border" />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Mật khẩu mới</label>
                    <input type="password" className="w-full p-2 border" />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Xác nhận mật khẩu mới</label>
                    <input type="password" className="w-full p-2 border" />
                </div>
                <button className="px-4 py-2 text-white bg-blue-500 rounded">Đổi mật khẩu</button>
                <div className="mt-4">
                    <a href="#" className="text-blue-500">Quên mật khẩu?</a>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;