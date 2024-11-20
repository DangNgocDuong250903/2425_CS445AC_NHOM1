import React from 'react';

const TopFollow = () => {
    return (
        <div className='w-[30%] p-5 mt-5 bg-white border border-gray-200 rounded-lg shadow-lg '>
            <h2 className='px-4 mb-4 text-lg font-medium'>Top Người Theo Dõi</h2>
            <div className='flex flex-col gap-4 mt-4'>
                <div className="flex">
                    <div className='w-12 h-12 overflow-hidden bg-gray-200 rounded-lg min-w-10'>
                        <img
                            className='object-contain w-full h-full text-center rounded-full'
                            src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/467640283_542208818612442_7799143732821011658_n.jpg?stp=dst-jpg_p526x296&_nc_cat=1&ccb=1-7&_nc_sid=127cfc&_nc_ohc=PUkXrQjii0gQ7kNvgHiPFUQ&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=AI4TYy7jsHjPjZp-JFbZOQn&oh=00_AYD5Om-SK4IL-xJXXHbzdng-7MkZFvCh77FuxAXwEyNb2A&oe=6743E72C"
                            alt="" />
                    </div>
                    <div className='flex-1 ml-4 '>
                        <h2 className='text-sm text-gray-800'>Jone</h2>
                        <div className='flex flex-col'>
                            <span>131 follow</span>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='text-base text-gray-400 center text-'>30 bài viết</div>
                        <span className='text-sm text-green-300'>Hoạt động</span>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default TopFollow;