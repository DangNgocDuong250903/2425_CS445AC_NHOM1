import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";

const UpdateUser = () => {
    const [selectedLink, setSelectedLink] = useState(1);
    const navigate = useNavigate()
    const handleLinkClick = (linkIndex) => {
        setSelectedLink(linkIndex);
    };

    return (
        <>
                  <TopBar></TopBar>

        </>
       
    );
};

export default UpdateUser;