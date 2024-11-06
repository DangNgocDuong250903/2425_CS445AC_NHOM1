import React from 'react';

const ChangePassword = () => {
    return (
        <div className="flex w-[800px] mx-auto pt-10 pb-10 border border-gray-200 shadow-md rounded-lg">
            <div className="w-1/4 p-4 border-r">
                <ul>
                    <li className="mb-4 font-bold">Chỉnh sửa trang cá nhân</li>
                    <li className="mb-4 font-bold text-blue-500">Đổi mật khẩu</li>
                    <li className="font-bold">Trợ giúp</li>
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