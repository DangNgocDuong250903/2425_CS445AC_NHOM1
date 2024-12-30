import { Badge } from "@mui/material";
import React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  return (
    <div
      onClick={() => navigate(user?.token ? "/chat" : "/login")}
      className="p-1 cursor-pointer hover:bg-neutral-100 rounded-full "
    >
      <Badge badgeContent={4} color="warning">
        <IoChatboxEllipsesOutline
          size={25}
          className=" hover:scale-105 transition-transform active:scale-90"
        />
      </Badge>
    </div>
  );
};

export default Chat;
