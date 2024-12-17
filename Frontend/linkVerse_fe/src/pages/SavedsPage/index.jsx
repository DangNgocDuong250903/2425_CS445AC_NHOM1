import styled from "@emotion/styled";
import { Divider, MenuItem } from "@mui/material";
import { useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FiBookmark } from "react-icons/fi";
import { useSelector } from "react-redux";
import { BlankAvatar } from "~/assets";
import { CreatePost, CustomizeMenu, TopBar } from "~/components";

const SavedsPage = () => {
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
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={"Saveds"} iconBack />
      <div className="w-full h-full flex justify-center">
        <div className="w-[680px] flex flex-col gap-y-4 h-full bg-[#F2F4F7] p-5 rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-y-auto">
          <div className="w-full flex p-3 gap-x-2 rounded-2xl bg-primary">
            <div class="w-16 h-16 flex items-center">
              <img
                src={BlankAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center flex-1">
              <h1>Nevalearntocode - Overview</h1>

              <BiDotsHorizontalRounded
                size={25}
                color="#686868"
                className="cursor-pointer "
                onClick={handleClick}
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="contained"
              />
              <CustomizeMenu
                handleClose={handleClose}
                anchorEl={anchorEl}
                open={open}
                anchor={{ vertical: "top", horizontal: "left" }}
              >
                <MenuItem onClick={handleClose}>
                  <div className="flex items-center justify-between w-full">
                    <span className={theme === "light" && "text-black"}>
                      Unsave
                    </span>
                    <FiBookmark color={theme === "light" && "black"} />
                  </div>
                </MenuItem>
              </CustomizeMenu>
            </div>
          </div>
        </div>
      </div>
      <CreatePost buttonRight />
    </div>
  );
};

export default SavedsPage;
