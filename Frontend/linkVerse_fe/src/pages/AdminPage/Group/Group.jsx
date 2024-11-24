import React from 'react';
import { GrGroup } from "react-icons/gr";

const Group = () => {
    return (
        <div className='px-20'>
            <div className='flex items-center justify-center gap-5 mb-5'>
                <GrGroup className='w-6 h-6' />
                <h1 className='text-2xl font-bold'>QUẢN LÝ NHÓM</h1>
            </div>
            <div className="flex justify-center gap-5 mb-4 items-cent">
                <input
                    type="text"
                    placeholder="Tìm kiếm tên nhóm..."
                    className="w-1/2 px-6 py-3 border rounded-lg "

                />
                <button
                    style={{ backgroundColor: '#3B82F6' }}
                    className="px-2 py-2 text-white rounded-lg "

                >
                    Tìm kiếm
                </button>

            </div>
            <table className="w-full mt-5 bg-white ">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">ẢNH</th>
                        <th className="px-4 py-2 border-b">TÊN NHÓM</th>
                        <th className="px-4 py-2 border-b">THÀNH VIÊN</th>
                        <th className="px-4 py-2 border-b">TRẠNG THÁI</th>
                        <th className="px-4 py-2 border-b">NGÀY TẠO NHÓM</th>
                        <th className="px-4 py-2 border-b">THAO TÁC</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    );
};

export default Group;