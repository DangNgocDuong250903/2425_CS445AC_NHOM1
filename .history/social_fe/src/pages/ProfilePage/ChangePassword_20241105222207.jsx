import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopBar } from '~/components';

const ChangePassword = () => {
    const [selectedLink, setSelectedLink] = useState(2);
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

export default ChangePassword;