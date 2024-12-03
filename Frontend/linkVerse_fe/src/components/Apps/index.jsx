import React, { useState } from "react";
import { MdApps } from "react-icons/md";
import { CustomizeMenu } from "..";
import { Divider, MenuItem, useColorScheme } from "@mui/material";
import { GoBellSlash } from "react-icons/go";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";

import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { RiAttachment2 } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { setTheme } from "~/redux/Slices/themeSlice";

const Apps = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const StyledDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.colorSchemes.light.border,
    margin: `${theme.spacing(0.5)} 0`,
    ...theme.applyStyles("dark", {
      borderColor: theme.colorSchemes.dark.border,
    }),
  }));
  const theme = useSelector((state) => state.theme.theme);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //change theme
  const [isChecked, setIsChecked] = useState(false);
  const { mode, setMode } = useColorScheme();

  const handleToggle = () => {
    setIsChecked((prevState) => !prevState);
    const themeValue = isChecked ? "light" : "dark";
    dispatch(setTheme(themeValue));
    setMode(themeValue);
  };

  return (
    <div className="flex justify-center p-1 items-center hover:bg-neutral-100 rounded-full hover:scale-105 transition-transform">
      <MdApps
        size={28}
        className="cursor-pointer "
        onClick={handleClick}
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
      />
      <CustomizeMenu handleClose={handleClose} anchorEl={anchorEl} open={open}>
        <MenuItem onClick={() => navigate("/settings")}>
          <div className="flex items-center justify-between w-full">
            <span className={theme === "light" && "text-black"}>Settings</span>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="flex items-center justify-between w-full">
            <span className={theme === "light" && "text-black"}>Dark mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleToggle}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0444A4] hover:peer-checked:bg-[#0444A4]"></div>
            </label>
          </div>
        </MenuItem>
        <StyledDivider />
        <MenuItem onClick={handleClose} disableRipple>
          <div className="flex items-center justify-between w-full">
            <span className="text-red-600">Edit post</span>
            <FaRegEdit color="red" />
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <div className="flex items-center justify-between w-full">
            <span className="text-red-600">Delete</span>
            <FaRegTrashCan color="red" />
          </div>
        </MenuItem>
        <StyledDivider />
        <MenuItem onClick={handleClose}>
          <div className="flex items-center justify-between w-full">
            <span className={theme === "light" && "text-black"}>
              Copy address
            </span>
            <RiAttachment2 color={theme === "light" && "black"} />
          </div>
        </MenuItem>
      </CustomizeMenu>
    </div>
  );
};

export default Apps;
