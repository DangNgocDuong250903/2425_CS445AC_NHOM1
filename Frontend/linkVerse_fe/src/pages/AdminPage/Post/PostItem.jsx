import axios from 'axios';
import React from 'react';
import { MdDeleteForever } from 'react-icons/md';

const PostItem = ({ item, deletePostItem }) => {
    return (
        <tr className='items-center justify-center text-center border-b'>
            <td className="px-4 py-2">{item.id}</td>
            <td className="px-4 py-2">{item.title}</td>
            <td className="px-4 py-2">{item.author}</td>
            <td className="px-4 py-2">{new Date(item.date).toLocaleDateString('vi-VN')}</td>
            <td className="px-4 py-2">
                <p className={`w-3/4 py-1 font-medium mx-auto rounded-md ${item.status === 'Công Khai' ? 'bg-green-300' : 'bg-red-300'}`}>
                    {item.status}
                </p>
            </td>
            <td className="px-4 py-2 text-center align-middle cursor-pointer">
                <button
                    className="flex items-center justify-center gap-2"
                    onClick={() => deletePostItem(item.id)}>
                    <MdDeleteForever className="w-6 h-6 text-red-500" />
                    <p className='text-lg'>Xóa</p>
                </button>
            </td>
        </tr>
    );
};

export default PostItem;