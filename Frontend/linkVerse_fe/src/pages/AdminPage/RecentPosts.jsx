import React from 'react';

const RecentPosts = () => {
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
                        <tr className='border-b'>
                            <td className="px-4 py-2 font-medium">1</td>
                            <td className="px-4 py-2 font-medium">Thanh</td>
                            <td className="px-4 py-2 font-medium">Angular vs React</td>
                            <td className="px-4 py-2 font-medium">2023-09-05</td>
                            <td className="px-4 py-2 font-medium">Công khai</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium">2</td>
                            <td className="px-4 py-2 font-medium">An</td>
                            <td className="px-4 py-2 font-medium">GraphQL Introduction</td>
                            <td className="px-4 py-2 font-medium">2023-08-25</td>
                            <td className="px-4 py-2 font-medium">Cá nhân</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentPosts;
