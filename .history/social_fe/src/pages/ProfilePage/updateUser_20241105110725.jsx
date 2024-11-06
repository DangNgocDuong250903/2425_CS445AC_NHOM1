import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";

const UpdateUser = () => {
    const [selectedLink, setSelectedLink] = useState(null);
    const navigate = useNavigate()
    const handleLinkClick = (linkIndex) => {
        setSelectedLink(linkIndex);
    };
    return (
        <div className="flex w-[800px] mx-auto pt-10 pb-10 border border-gray-200 shadow-md rounded-lg ">
            <IoIosCloseCircleOutline onClick={() => navigate("/")} className="absolute w-8 h-8 cursor-pointer top-10 right-[400px] hover:text-red-400 " />
            <div className="w-1/3 p-4 bg-gray-200 rounded-md">
                <ul className="flex flex-col">

                    <Link
                        href="#"
                        onClick={() => handleLinkClick(1)}
                        className={`mb-4 font-medium ${selectedLink === 1 ? 'text-blue-500' : 'text-gray-700'}`}
                    >
                        Chỉnh sửa trang cá nhân
                    </Link>


                    <Link
                        href="#"
                        onClick={() => handleLinkClick(2)}
                        className={`mb-4 font-medium ${selectedLink === 2 ? 'text-blue-500' : 'text-gray-700'}`}
                    >
                        Đổi mật khẩu
                    </Link>


                    <Link
                        href="#"
                        onClick={() => handleLinkClick(3)}
                        className={`mb-4 font-medium ${selectedLink === 3 ? 'text-blue-500' : 'text-gray-700'}`}
                    >
                        Trợ giúp
                    </Link>
                </ul>
            </div>
            <div className="w-3/4 p-8">
                <div className="flex items-center mb-4">
                    <img src="https://mighty.tools/mockmind-api/content/human/5.jpg" alt="User avatar" className="w-10 h-10 mr-4 rounded-full" />
                    <div>
                        <div className="font-bold">test2</div>
                        <a href="#" className="text-blue-500">Thay đổi ảnh đại diện</a>
                    </div>
                </div>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700">Tên</label>
                        <input type="text" value="test2" className="w-full p-2 border border-gray-300 rounded" />
                        <small className="text-gray-500">Hãy lấy tên mà bạn thường dùng để tài khoản của bạn dễ tìm thấy hơn. Đó có thể là tên đầy đủ, biệt danh hoặc tên doanh nghiệp.</small>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" value="kiara96.shippo@gmail.com" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Tiểu sử</label>
                        <textarea className="w-full p-2 border border-gray-300 rounded"></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Số điện thoại</label>
                        <input type="text" value="phone" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Giới tính</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Gợi ý tài khoản tương tự</label>
                        <div className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Bao gồm tài khoản của bạn khi đề xuất tài khoản tương tự mà mọi người muốn theo dõi</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button type="submit" className="px-4 py-2 mr-4 font-semibold text-blue-400 bg-transparent border border-gray-300 rounded hover:t hover:bg-blue-400">Gửi</button>
                        <button type="button" className="text-blue-500">Tạm thời vô hiệu hóa tài khoản</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUser;