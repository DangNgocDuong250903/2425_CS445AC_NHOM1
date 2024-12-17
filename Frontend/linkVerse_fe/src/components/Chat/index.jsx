import { Badge } from "@mui/material";
import React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/chat")}
      className="p-1 cursor-pointer hover:bg-neutral-100 rounded-full hover:scale-105 transition-transform"
    >
      <Badge badgeContent={4} color="warning">
        <IoChatboxEllipsesOutline size={25} />
      </Badge>
    </div>
  );
};

export default Chat;
