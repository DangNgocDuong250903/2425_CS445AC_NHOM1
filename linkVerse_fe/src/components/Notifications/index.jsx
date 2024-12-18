import React, { useState } from "react";
import { CustomizeMenu } from "..";
import { Badge } from "@mui/material";
import { useSelector } from "react-redux";
import { BlankAvatar } from "~/assets";
import { GoBell } from "react-icons/go";
import { GoBellFill } from "react-icons/go";

const Notifications = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="hidden lg:flex p-1 cursor-pointer hover:bg-neutral-100 rounded-full hover:scale-105 transition-transform">
      <Badge variant="dot" color="warning">
        <GoBell
          size={24}
          onClick={handleClick}
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="contained"
          className="text-bgStandard"
        />
      </Badge>

      <CustomizeMenu
        anchor={{ vertical: "top", horizontal: "center" }}
        handleClose={handleClose}
        anchorEl={anchorEl}
        open={open}
        styles={{ marginTop: "10px" }}
      >
        <div className="w-96 flex items-center justify-center flex-col">
          <div className="w-full py-5 px-5 flex items-center justify-between border-b">
            <span className="font-bold text-ascent-1">Notifications</span>
            <span className="text-blue text-sm font-semibold cursor-pointer">
              Mark all as read
            </span>
          </div>

          <div className="w-full max-h-96 overflow-y-auto overflow-x-hidden">
            {/* 1 */}
            <div className="w-full py-6 px-5 flex items-center justify-between border-b cursor-pointer hover:bg-[#F3F8FE]">
              <img
                src={BlankAvatar}
                alt="avatar"
                className="w-10 h-10 object-cover  bg-no-repeat"
              />
              <div>
                <span className="font-semibold text-ascent-1">dhtuan</span>
                <span className="text-sm text-ascent-2"> đã nhắc đến bạn</span>
              </div>
              <span className="text-xs text-ascent-2">1 minutes ago</span>
            </div>
          </div>

          <div className="w-full py-5 cursor-pointer px-4 flex items-center justify-center text-blue text-sm font-semibold">
            View all notifications
          </div>
        </div>
      </CustomizeMenu>
    </div>
  );
};

export default Notifications;
