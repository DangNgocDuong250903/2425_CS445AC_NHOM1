import Item from 'antd/es/list/Item';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TopFollow = () => {
    // const [topFollow, setTopFollow] = useState([]);

    // const getTopFollow = async () => {
    //     try {
    //         const res = await axios.get("  http://localhost:3000/topfollow");
    //         setTopFollow(res.data);
    //     } catch (error) {
    //         console.error("Lỗi kết nối với server:", error);
    //         alert("Lỗi kết nối với server");
    //     }
    // }
    // useEffect(() => {
    //     getTopFollow()
    // }, [])
    return (
        <div className='w-[30%] p-5 mt-5 bg-white border border-gray-200 rounded-lg shadow-lg '>
            <h2 className='px-2 mb-4 text-lg font-medium'>Hoạt Động Gần Đây</h2>
            <div className='flex flex-col gap-4 mt-4'>
                {/* {topFollow.map((item, index) => (
                    <div className="flex">
                        <div className='w-12 h-12 overflow-hidden rounded-lg min-w-10'>
                            <img
                                className='object-cover w-full h-full text-center rounded-full'
                                src={item.images}
                                alt="" />
                        </div>
                        <div className='flex-1 ml-4 '>
                            <h2 className='text-sm text-gray-800'>{item.name}</h2>
                            <div className='flex flex-col'>
                                <span>{item.follow} theo dõi</span>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='text-base text-gray-600 center text-'>{item.post} Bài đăng</div>
                            <span className={`text-sm font-semibold text-center ${item.status === "online" ? "text-green-500" : "text-gray-400"}`}>{item.status}</span>
                        </div>
                    </div>
                ))} */}
            </div>
        </div>
    );
};

export default TopFollow;