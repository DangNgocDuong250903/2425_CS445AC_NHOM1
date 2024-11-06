import React from 'react';

const UpdateUser = () => {
    return (
        <div className="flex w-[800px] mx-auto">
            <div className="p-4 bg-gray-100 w-1/">
                <ul>
                    <li className="mb-4"><a href="#" className="text-blue-500">Chỉnh sửa trang cá nhân</a></li>
                    <li className="mb-4"><a href="#">Đổi mật khẩu</a></li>
                    <li className="mb-4"><a href="#">Trợ giúp</a></li>
                </ul>
            </div>
            <div className="w-3/4 p-8">
                <div className="flex items-center mb-4">
                    <img src="https://placehold.co/50x50" alt="User avatar" className="mr-4 rounded-full" />
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
                        <label className="block text-gray-700">Địa chỉ</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" />
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
                        <button type="submit" className="px-4 py-2 mr-4 text-white bg-blue-500 rounded">Gửi</button>
                        <button type="button" className="text-blue-500">Tạm thời vô hiệu hóa tài khoản</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUser;