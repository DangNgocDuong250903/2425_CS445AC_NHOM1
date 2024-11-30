import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { Button, PopperCustom, TextInput } from "~/components/index";
import { useTranslation } from "react-i18next";
import i18n from "~/utils/i18n/i18n";
import { Badge, MenuItem, Select } from "@mui/material";
import { VieIcon, EnIcon } from "~/assets";
import { setLanguage } from "~/redux/Slices/languageSlice";
import { setTheme } from "~/redux/Slices/themeSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as UserService from "~/services/UserService";
import { resetUser } from "~/redux/Slices/userSlice";

const TopBar = ({ title }) => {
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
  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(setTheme(themeValue));
  };

  //logout
  const handleLogOut = async () => {
    await UserService.logout(user?.id, user?.access_token);
    dispatch(resetUser());
    localStorage.removeItem("access_token");
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
      <div className=" flex-1 flex w-[400px] justify-start h-full gap-x-5">
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
              styles=" lg:w-[12rem] rounded-l-full py-2"
              register={register("search")}
            />

            <Button
              title="Search"
              type="submit"
              containerStyles="border-1 border-borderNewFeed px-3 py-2 mt-2 rounded-r-full text-ascent-1"
            />
          </form>
        </div>
      </div>
      {/* 2 */}
      <div className="flex  items-center justify-center w-fit h-full my-auto">
        <h1 className="text-base text-ascent-1 font-medium cursor-pointer">
          {t(title)}
        </h1>
      </div>
      {/* 3 */}
      <div className="flex-1 w-full flex gap-4 items-center text-ascent-1 text-base md:text-xl justify-end">
        {/* notification */}
        <div className="hidden lg:flex">
          <Badge variant="dot" color="warning">
            <svg
              fill={
                popoverOpen
                  ? theme === "dark"
                    ? "#fff"
                    : "#000"
                  : theme === "dark"
                  ? "#000"
                  : "#fff"
              }
              onClick={handleClick}
              className="cursor-pointer"
              aria-describedby={id}
              width={23}
              height={23}
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke={theme === "dark" ? "#fff" : "#000"}
                strokeWidth="50"
              >
                <path d="M256,480a80.09,80.09,0,0,0,73.3-48H182.7A80.09,80.09,0,0,0,256,480Z"></path>
                <path d="M400,288V227.47C400,157,372.64,95.61,304,80l-8-48H216l-8,48c-68.88,15.61-96,76.76-96,147.47V288L64,352v48H448V352Z"></path>
              </g>
              <g id="SVGRepo_iconCarrier">
                <path d="M256,480a80.09,80.09,0,0,0,73.3-48H182.7A80.09,80.09,0,0,0,256,480Z"></path>
                <path d="M400,288V227.47C400,157,372.64,95.61,304,80l-8-48H216l-8,48c-68.88,15.61-96,76.76-96,147.47V288L64,352v48H448V352Z"></path>
              </g>
            </svg>
            <PopperCustom open={open} id={id} anchorEl={anchorEl}>
              <div
                class={`relative w-[380px] overflow-hidden h-[600px] mt-3 rounded-2xl p-5 border-1 ${
                  theme === "dark"
                    ? "border-[rgb(45,45,45)]"
                    : "border-[rgb(213,213,213)]"
                }  ${
                  theme === "dark"
                    ? "bg-[rgb(24,24,24)]"
                    : "bg-[rgb(255,255,255)]"
                }`}
              >
                {/* header */}
                <div
                  className={`${
                    theme === "dark" ? "text-white" : "text-black"
                  } pb-5 text-2xl font-semibold`}
                >
                  <h1>Thông báo</h1>
                </div>

                <div className="flex flex-col w-full h-full gap-4 overflow-y-auto p-2">
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <img
                      src="https://img.a.transfermarkt.technology/portrait/big/148455-1727337594.jpg?lm=1"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover bg-no-repeat"
                    />
                    <div className="flex-1">
                      <p className="text-ascent-2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </p>
                    </div>
                  </div>
                </div>

                <span className="text-white">Xem thêm</span>
                {/* footer */}
                {/* <div className="py-2">
                  <span className="text-white">Xem thêm</span>
                </div> */}
              </div>
            </PopperCustom>
          </Badge>
        </div>

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
              <img src={VieIcon} alt="icon" />
            </MenuItem>
            <MenuItem value={"en"}>
              <img src={EnIcon} alt="icon" />
            </MenuItem>
          </Select>
        </div>

        {/* change theme */}
        <button onClick={handleTheme}>
          {theme === "dark" ? <BsMoon /> : <BsSunFill />}
        </button>
        <div>
          {user?.access_token ? (
            <Button
              onClick={handleLogOut}
              title={t("Đăng xuất")}
              containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border-x-[0.8px] border-y-[0.8px] border-solid shadow-newFeed rounded-full border-borderNewFeed"
            />
          ) : (
            <Button
              onClick={() => navigate("/login")}
              title={t("Đăng nhập")}
              containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border-x-[0.8px] border-y-[0.8px] border-solid shadow-newFeed rounded-full border-borderNewFeed"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
