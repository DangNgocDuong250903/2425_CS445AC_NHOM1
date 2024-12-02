import axios from 'axios';
import React, { useEffect, useState } from 'react';

const RecentPosts = () => {
    const [recentPost, setRecentPost] = useState([]);

    const getRecentPost = async () => {
        try {
            const res = await axios.get("http://localhost:3000/recentpost");
            setRecentPost(res.data);
        } catch (error) {
            console.error("Lỗi kết nối với server:", error);
            alert("Lỗi kết nối với server");
        }
    }
    useEffect(() => {
        getRecentPost()
    }, [])
    return (
        <div className='w-[65%] h-screen p-5 mt-5 bg-white border border-gray-200 rounded-lg shadow-lg '>
            <h2 className='px-4 mb-4 text-lg font-medium'>Bài Đăng Gần Đây</h2>
            <div className="mt-3 overflow-y-auto max-h-96 text-nowrap">
                <table className="min-w-full border-collapse table-auto">
                    <thead>
                        <tr className="text-left text-black bg-gray-200">
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Tác Giả</th>
                            <th className="px-4 py-2">Tiêu Đề Bài Đăng</th>
                            <th className="px-4 py-2">Ngày Đăng</th>
                            <th className="px-4 py-2">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentPost.map((item, index) => (
                            <tr key={index} className='border-b'>
                                <td className="px-4 py-2 font-medium">{item.id}</td>
                                <td className="px-4 py-2 font-medium">{item.author}</td>
                                <td className="px-4 py-2 font-medium">{item.title}</td>
                                <td className="px-4 py-2">{new Date(item.postdate).toLocaleDateString('vi-VN')}</td>
                                <td className="px-4 py-2">
                                    <p className={` font-medium mx-auto  ${item.status === 'công khai' ? 'text-green-500' : 'text-red-500'}`}>
                                        {item.status}
                                    </p>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentPosts;
