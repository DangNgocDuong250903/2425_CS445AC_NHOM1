import React from 'react';
import { Menu } from 'antd';
import { CiAt } from "react-icons/ci";
import { PiFileText } from "react-icons/pi";

import {
    DashboardOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    TransactionOutlined,
    MessageOutlined,
    SettingOutlined,
    QuestionCircleOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const Sidebar = () => {
    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '15%', }}>
            <Menu
                mode="inline"
                theme="dark"
                defaultSelectedKeys={['dashboard']}
                style={{ flexGrow: 1, backgroundColor: '#1a1a1a' }}

            >
                <div className='flex items-center gap-2 px-5 py-5'>
                    <CiAt />
                    <span className='text-xl'>LinkVerse</span>
                </div>
                <Menu.Item key="dashboard" icon={<DashboardOutlined />} style={{ color: 'white' }}>
                    <Link to="/admin">Trang Chủ</Link>
                </Menu.Item>
                <Menu.Item key="products" icon={<PiFileText />} style={{ color: 'white' }}>
                    <Link to="/post">Bài Viết</Link>
                </Menu.Item>
                <Menu.Item key="orders" icon={<ShoppingCartOutlined />} style={{ color: 'white' }}>
                    <Link to="/orders">Orders</Link>
                </Menu.Item>
                <Menu.Item key="customers" icon={<UserOutlined />} style={{ color: 'white' }}>
                    <Link to="/customers">Người Dùng</Link>
                </Menu.Item>
                <Menu.Item key="transactions" icon={<TransactionOutlined />} style={{ color: 'white' }}>
                    <Link to="/transactions">Transactions</Link>
                </Menu.Item>
                <Menu.Item key="messages" icon={<MessageOutlined />} style={{ color: 'white' }}>
                    <Link to="/messages">Messages</Link>
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default Sidebar;