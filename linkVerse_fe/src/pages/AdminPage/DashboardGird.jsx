import React from 'react';
import { FaUserFriends } from "react-icons/fa";
import { IoChatbubblesSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { FaShare } from "react-icons/fa";

const DashboardGird = () => {
    return (
        <div className="grid grid-cols-4 grid-rows-1 gap-4">
            <div className='flex gap-3 p-4 transition-transform duration-300 bg-white border border-gray-300 rounded-lg cursor-pointer hover:scale-105 hover:border-red-500 '>
                <div className='flex items-center'>
                    <FaUserFriends className='text-[#8e8fa2] ' size={30} />
                </div>
                <div>
                    <span className='text-sm font-light text-gray-500'>Total Users</span>
                    <div className='flex items-center'>
                        <strong className='text-xl font-semibold text-gray-700'>1,234</strong>
                        <span className='pl-2 text-sm text-green-500'>+34</span>
                    </div>
                </div>
            </div>
            <div className='flex gap-3 p-4 transition-transform duration-300 bg-white border border-gray-300 rounded-lg hover:scale-105 hover:border-red-500'>
                <div className='flex items-center'>
                    <IoChatbubblesSharp className='text-blue' size={30} />
                </div>
                <div>
                    <span className='text-sm font-light text-gray-500'>Total Posts</span>
                    <div className='flex items-center'>
                        <strong className='text-xl font-semibold text-gray-700'>12,345</strong>
                        <span className='pl-2 text-sm text-green-500'>+123</span>
                    </div>
                </div>
            </div>
            <div className='flex gap-3 p-4 transition-transform duration-300 bg-white border border-gray-300 rounded-lg hover:scale-105 hover:border-red-500'>
                <div className='flex items-center'>
                    <FaHeart className='text-red-500' size={30} />
                </div>
                <div>
                    <span className='text-sm font-light text-gray-500'>Total Likes</span>
                    <div className='flex items-center'>
                        <strong className='text-xl font-semibold text-gray-700'>54,232</strong>
                        <span className='pl-2 text-sm text-red-500'>-30</span>
                    </div>
                </div>
            </div>
            <div className='flex gap-3 p-4 transition-transform duration-300 bg-white border border-gray-300 rounded-lg hover:scale-105 hover:border-red-500'>
                <div className='flex items-center'>
                    <FaShare className='text-green-500' size={30} />
                </div>
                <div>
                    <span className='text-sm font-light text-gray-500'>Total Shares</span>
                    <div className='flex items-center'>
                        <strong className='text-xl font-semibold text-gray-700'>5,432</strong>
                        <span className='pl-2 text-sm text-red-500'>-41</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardGird;