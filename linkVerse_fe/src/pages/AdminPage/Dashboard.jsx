import React from 'react';
import DashboardGird from './DashboardGird';
import TransactionChart from './TransactionChart';
import RecentPosts from './RecentPosts';
import TopFollow from './TopFollow';

const Dashboard = () => {
    return (
        <div className='h-screen p-4 overflow-x-auto overflow-y-auto'>
            <div className='flex flex-col gap-4'> {/* Đặt min-width đủ lớn để giữ các thành phần trên một dòng */}
                <DashboardGird></DashboardGird>
                <TransactionChart></TransactionChart>
                <div className='flex justify-between w-full gap-5 '>
                    <RecentPosts></RecentPosts>
                    <TopFollow></TopFollow>
                </div>
                <div className='flex flex-row gap-4'>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;