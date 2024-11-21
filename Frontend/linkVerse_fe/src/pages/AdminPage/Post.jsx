import React, { useState } from 'react';
import { FaRegListAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const Post = () => {
    const [post, setPost] = useState([])
    
    return (

        <div className='px-20'>
            <div className='flex items-center justify-center gap-5 mb-5'>
                <FaRegListAlt className='w-6 h-6' />
                <h1 className='text-2xl font-bold'>QUẢN LÝ BÀI VIẾT</h1>
            </div>
            <div className="flex justify-center gap-5 mb-4 items-cent">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-1/2 px-6 py-3 border rounded-lg "
                />
                <button
                    style={{ backgroundColor: '#3B82F6' }}
                    className="px-2 py-2 text-white rounded-lg ">
                    Tìm kiếm
                </button>
                <div className=''>
                    <select className="px-4 py-2 bg-gray-200 border rounded cursor-pointer">
                        <option value="" className='font-medium'>Tất cả trạng thái</option>
                        <option className='font-medium' value="public">Công khai</option>
                        <option className='font-medium' value="hidden">Ẩn</option>
                    </select>
                </div>
            </div>
            <table className="w-full mt-5 bg-white ">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">STT</th>
                        <th className="px-4 py-2 border-b">TIÊU ĐỀ</th>
                        <th className="px-4 py-2 border-b">TÁC GIẢ</th>
                        <th className="px-4 py-2 border-b">NGÀY ĐĂNG</th>
                        <th className="px-4 py-2 border-b">TRẠNG THÁI</th>
                        <th className="px-4 py-2 border-b">HÀNH ĐỘNG</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='items-center justify-center text-center border-b'>
                        <td className="px-4 py-2">1</td>
                        <td className="px-4 py-2">Bài viết 1</td>
                        <td className="px-4 py-2">Nguyễn Văn A</td>
                        <td className="px-4 py-2">01/01/2023</td>
                        <td className="px-4 py-2">
                            <p className='w-1/2 py-1 mx-auto bg-green-300 rounded-md'>Công Khai</p>
                        </td>
                        <td className="px-4 py-2 text-center align-middle cursor-pointer">
                            <div className="flex items-center justify-center gap-2">
                                <MdDeleteForever className="w-6 h-6 text-red-500" />
                                <p className='text-lg'>Xóa</p>
                            </div>
                        </td>

                    </tr>

                    <tr className='items-center justify-center text-center border-b'>
                        <td className="px-4 py-2">2</td>
                        <td className="px-4 py-2">Bài viết 2</td>
                        <td className="px-4 py-2">Nguyễn Văn B</td>
                        <td className="px-4 py-2">19/02/2023</td>
                        <td className="px-4 py-2">
                            <p className='w-1/2 py-1 mx-auto bg-red-400 rounded-md'>Ẩn</p>
                        </td>
                        <td className="px-4 py-2 text-center align-middle cursor-pointer">
                            <div className="flex items-center justify-center gap-2">
                                <MdDeleteForever className="w-6 h-6 text-red-500" />
                                <p className='text-lg '>Xóa</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Post;