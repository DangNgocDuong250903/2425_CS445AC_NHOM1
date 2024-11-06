import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdOutlineError } from "react-icons/md";
import { FaEnvelope } from "react-icons/fa6";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { TopBar } from '~/components';

const Help = () => {
    const [selectedLink, setSelectedLink] = useState(3);
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

export default Help;