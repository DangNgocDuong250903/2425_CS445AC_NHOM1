import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [selectedLink, setSelectedLink] = useState(2);
    const navigate = useNavigate()
    const handleLinkClick = (linkIndex) => {
        setSelectedLink(linkIndex);
    };
    return (
        <div className="flex w-[800px] mx-auto mt-20 pb-10 border border-gray-200 shadow-md rounded-lg">
            <div className="w-1/3 p-4 bg-white rounded-md ">
                <ul className="flex flex-col ">

                    <Link
                        to="/update_user"
                        onClick={() => handleLinkClick(1)}
                        className={`mb-4 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-200 px-3 py-2 rounded-lg ${selectedLink === 1 ? 'text-blue-500' : 'text-gray-700'}`}
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
                    <img src="https://mighty.tools/mockmind-api/content/human/5.jpg" alt="User avatar" className="w-10 h-10 mr-4 rounded-full" />
                    <span className="font-bold">test2</span>
                </div>
                <div className="flex gap-5 mb-4">
                    <label className="w-[200px] mb-2">Mật khẩu cũ:</label>
                    <input type="password" className="flex-1 px-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-5 mb-4">
                    <label className="w-[200px] mb-2">Mật khẩu mới:</label>
                    <input type="password" className="flex-1 px-2 border rounded-lg" />
                </div>
                <div className="flex gap-5 mb-4">
                    <label className="w-[200px] mb-2">Xác nhận mật khẩu mới:</label>
                    <input type="password" className="flex-1 px-2 border" />
                </div>

                <button type="submit" className="px-4 py-2 mr-4 font-semibold text-blue-400 bg-transparent border border-gray-300 rounded hover:text-white hover:bg-blue-400">Đổi mật khẩu</button>
                <div className="mt-4">
                    <a href="#" className="text-blue-500">Quên mật khẩu?</a>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;