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
      <IoChatboxEllipsesOutline size={25} />
    </div>
  );
};

export default Chat;
