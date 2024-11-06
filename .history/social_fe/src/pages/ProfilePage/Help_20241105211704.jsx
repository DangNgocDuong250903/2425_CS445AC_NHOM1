import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdOutlineErrorOutline } from "react-icons/md";

const Help = () => {
    const [selectedLink, setSelectedLink] = useState(3);
    const navigate = useNavigate()
    const handleLinkClick = (linkIndex) => {
        setSelectedLink(linkIndex);
    };
    return (
        <div className="flex w-[800px] mx-auto mt-20 pb-10 border border-gray-200 shadow-md rounded-lg">
            <div className="w-1/3 p-4 bg-white rounded-md ">
                <ul className="flex flex-col ">

                    <Link
                        to="/update_user"
                        onClick={() => handleLinkClick(1)}
                        className={`mb-4 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg  ${selectedLink === 1 ? 'text-blue-500' : 'text-gray-700'}`}
                    >
                        Chỉnh sửa trang cá nhân
                    </Link>


                    <Link
                        to="/changepassword"
                        onClick={() => handleLinkClick(2)}
                        className={`mb-4 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg ${selectedLink === 2 ? 'text-blue-500' : 'text-gray-700'}`}
                    >
                        Đổi mật khẩu
                    </Link>

                    <Link

                        onClick={() => handleLinkClick(3)}
                        className={`mb-4 font-medium hover:bg-gray-200 px-3 py-2 rounded-lg ${selectedLink === 3 ? 'text-blue-500' : 'text-gray-700'}`}
                    >
                        Trợ giúp & hỗ trợ
                    </Link>
                </ul>
            </div>
            <div className="w-3/4 p-8 ">
                <div>
                    <p>Trung tâm trợ giúp</p>
                </div>
                <div>
                    <p>Hộp thư hổ trợ</p>
                </div>
                <div>
                    <p>Báo cáo sự cáo</p>
                </div>

            </div>
        </div>
    );
};

export default Help;