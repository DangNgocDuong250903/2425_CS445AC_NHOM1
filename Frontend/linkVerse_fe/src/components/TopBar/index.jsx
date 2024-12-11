import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Apps,
  Button,
  Chat,
  Notifications,
  TextInput,
} from "~/components/index";
import { useTranslation } from "react-i18next";
import i18n from "~/utils/i18n/i18n";
import { MenuItem, Select, useColorScheme } from "@mui/material";
import { setLanguage } from "~/redux/Slices/languageSlice";
import { setTheme } from "~/redux/Slices/themeSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as UserService from "~/services/UserService";
import { resetUser } from "~/redux/Slices/userSlice";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";

const TopBar = ({ title, iconBack }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const { language } = useSelector((state) => state.language);
  const navigate = useNavigate();

  //language
  const handleChangeLanguage = (e) => {
    const value = e.target.value;
    dispatch(setLanguage(value));
    i18n.changeLanguage(language === "en" ? "vie" : "en");
  };

  //theme
  const { mode, setMode } = useColorScheme();
  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    setMode(theme === "light" ? "dark" : "light");
    dispatch(setTheme(themeValue));
  };

  //logout
  const handleLogOut = async () => {
    await UserService.logout(user?.token);
    dispatch(resetUser());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setPopoverOpen(!popoverOpen);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  //search
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSearch = async (data) => {};

  return (
    <div className="header w-full flex items-center justify-between pt-2 pb-2 px-1 bg-bgColor ">
      {/* 1 */}
      <div className="w-1/4 flex justify-start h-full gap-x-5">
        <Link to="/" className="flex gap-2 items-center">
          <div className="p-1 md:p-2  rounded text-white">
            <svg
              viewBox="0 0 24 24"
              width={45}
              className="hover:scale-105 transition-transform"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M15.8571 12C15.8571 14.1303 14.1302 15.8572 12 15.8572C9.86972 15.8572 8.14282 14.1303 8.14282 12C8.14282 9.86979 9.86972 8.14288 12 8.14288C14.1302 8.14288 15.8571 9.86979 15.8571 12ZM15.8571 12L15.8571 13.2857C15.8571 14.7059 17.0084 15.8571 18.4286 15.8571C19.3408 15.8571 20.1422 15.3821 20.5986 14.6658C20.8528 14.2671 21 13.7936 21 13.2857V12C21 9.3345 19.8412 6.93964 18 5.29168M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C13.9122 21 15.6851 20.4037 17.1429 19.3868"
                  stroke={theme === "dark" ? "#fff" : "#000"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </div>
        </Link>
        <div>
          <form
            className="hidden md:flex items-center justify-center"
            onSubmit={handleSubmit(handleSearch)}
          >
            <TextInput
              placeholder="Search..."
              styles=" lg:w-[16rem] rounded-full py-2"
              iconLeft={<IoIosSearch size={20} />}
              register={register("search")}
            />
          </form>
        </div>
      </div>
      {/* 2 */}
      <div className="flex flex-1 px-8 items-center justify-center h-full my-auto ">
        <div className="flex justify-between w-full">
          {iconBack ? (
            <div
              onClick={() => navigate("/")}
              className="w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:scale-110 cursor-pointer transition-transform border-1 border-borderNewFeed shadow-newFeed"
            >
              <FaArrowLeft size={12} />
            </div>
          ) : (
            <div className="w-6 h-6"></div>
          )}
          <h1 className="text-base text-ascent-1 font-medium cursor-pointer">
            {t(title)}
          </h1>
          <div className="w-6 h-6" />
        </div>
      </div>
      {/* 3 */}
      <div className="w-1/4 flex gap-4 items-center text-ascent-1 text-base md:text-xl justify-end">
        {/* notification */}
        <Notifications />
        {/* change language */}
        <div className="w-10 h-10 flex items-center justify-center">
          <Select
            IconComponent={() => {}}
            sx={{
              padding: 0,
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: 0,
              },
              "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: 0,
                },
              "& .MuiSelect-select": {
                padding: 0,
                "&.css-1pq31d5-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-1pq31d5-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-1pq31d5-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                  {
                    padding: 0,
                  },
              },
            }}
            value={language}
            onChange={handleChangeLanguage}
          >
            <MenuItem value={"vie"}>
              <span className="">VIE</span>
            </MenuItem>
            <MenuItem value={"en"}>
              <span>EN</span>
            </MenuItem>
          </Select>
        </div>
        <Chat />
        {/* app */}
        <Apps />
        {/* log out + log in */}
        <div>
          {user?.token ? (
            <Button
              onClick={handleLogOut}
              title={t("Đăng xuất")}
              containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border-x-[0.8px] border-y-[0.8px] border-solid shadow-newFeed rounded-full border-borderNewFeed"
            />
          ) : (
            <div className="relative inline-flex  group">
              <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <span
                onClick={() => navigate("/login")}
                className="relative inline-flex items-center justify-center px-4 md:px-6 py-1 md:py-2 text-sm text-white transition-all duration-200 bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button"
              >
                {t("Đăng nhập")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
