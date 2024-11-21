import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaRegListAlt } from "react-icons/fa";
import PostItem from './PostItem';

const Post = () => {
    const [post, setPost] = useState([])
    const getPost = async () => {
        try {
            const res = await axios.get("https://673def430118dbfe86096cf6.mockapi.io/post")
            setPost(res.data)
        } catch (error) {
            alert("Lỗi kết nối với server")
        }
    }
    useEffect(() => {
        getPost()
    }, [])
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
                    {post.map((item, index) => (
                        <PostItem key={index} item={item}></PostItem>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Post;