import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Apps,
  ChangeLanguage,
  Chat,
  Logout,
  Notifications,
  SelectPosts,
  TextInput,
} from "~/components/index";
import { useTranslation } from "react-i18next";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import * as SearchService from "~/services/SearchService";
import { useDebounceHook } from "~/hooks/useDebounceHook";

const TopBar = ({ title, iconBack, selectPosts }) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");
  const searchUser = useDebounceHook(keyword, 1000);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const res = await SearchService.searchUser({
        token,
        keyword: searchUser,
      });
      if (res.code === 1000) {
        setSearchResults(res.result.items || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchUser) {
      setIsDropdownOpen(true);
      handleSearch();
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  }, [searchUser]);

  const handleFocus = (e) => {
    e.target.classList.remove("w-12");
    e.target.classList.add("w-64");
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      e.target.classList.remove("w-64");
      e.target.classList.add("w-12");
    }
  };

  return (
    <div className="header w-full flex items-center justify-between pt-2 pb-2 px-1 bg-bgColor ">
      {/* 1 */}
      <div className="w-1/4 flex justify-start h-full gap-x-4">
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

        <div className="relative">
          <TextInput
            placeholder="Search..."
            styles=" lg:w-[16rem]  rounded-full py-2"
            iconLeft={<IoIosSearch size={20} />}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {isDropdownOpen && (
            <div className="absolute -bottom-31 mt-1 left-0 w-[16rem] bg-primary border-1 border-borderNewFeed shadow-newFeed rounded-2xl shadow-md z-50 max-h-60 overflow-auto">
              {isLoading ? (
                <div className="p-4 text-bgStandard ">{t("Loading...")}</div>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => navigate(`/profile/${user.userId}`)}
                      className="px-4 py-2 hover:bg-gray-100 bg-primary cursor-pointer"
                    >
                      <p className="text-sm text-bgStandard">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-bgStandard">{user.username}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-sm text-bgStandard">
                  {t("No results found...")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* 2 */}
      <div className="flex flex-1 px-8 items-center justify-center h-full my-auto ">
        <div className="flex justify-between w-full ">
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
          <div className="flex gap-x-4 items-center justify-center">
            <h1 className="text-base text-ascent-1 font-medium cursor-pointer">
              {t(title)}
            </h1>
            {selectPosts && user?.token && <SelectPosts />}
          </div>
          <div className="w-6 h-6" />
        </div>
      </div>
      {/* 3 */}
      <div className="w-1/4 flex gap-4 items-center text-ascent-1 text-base md:text-xl justify-end">
        <Notifications />
        <ChangeLanguage />
        <Chat />
        <Apps />
        <Logout primary />
      </div>
    </div>
  );
};

export default TopBar;
