import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CreatePost, CustomizeMenu, TextInput, TopBar } from "~/components";
import { IoIosSearch } from "react-icons/io";
import { BiFilterAlt } from "react-icons/bi";
import { BsFilterRight } from "react-icons/bs";
import { MenuItem } from "@mui/material";
import { useDebounceHook } from "~/hooks/useDebounceHook";
import * as SearchService from "~/services/SearchService";
import { BlankAvatar } from "~/assets";

const SearchPage = () => {
  const location = useLocation();
  const { stateKeyword } = location?.state;
  const token = localStorage.getItem("token");
  const theme = useSelector((state) => state.theme.theme);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sort, setSort] = useState(null);
  const handleClickSort = (event) => {
    setSort(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const openSort = Boolean(sort);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseSort = () => {
    setSort(null);
  };

  const searchItems = [
    { id: 1, name: "Search user" },
    { id: 2, name: "Search post by hashtag" },
  ];
  const [selectSearch, setSelectSearch] = useState(searchItems[0]?.name);
  const handleMenuItemClick = (e, i) => {};

  //search
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchUser = useDebounceHook(keyword, 1000);
  const [searchResults, setSearchResults] = useState([]);
  const handleChangeSearch = (e) => {
    setKeyword(e.target.value);
  };

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
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchUser]);

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={"Search"} iconBack />
      <CreatePost />

      <div className="w-full h-full flex justify-center">
        <div className="w-[660px] flex flex-col h-full bg-primary p-5 rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-y-auto">
          {/* input */}
          <TextInput
            placeholder="Search..."
            styles="w-full rounded-full py-2"
            iconLeft={<IoIosSearch size={20} />}
            iconRightStyles="right-5"
            value={keyword}
            onChange={handleChangeSearch}
          />
          {/* sort */}
          <div className="w-full flex justify-end items-center mt-5 px-1">
            <div className="w-full flex gap-3 justify-end">
              <BiFilterAlt
                size={23}
                onClick={handleClick}
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                className="cursor-pointer"
                aria-expanded={open ? "true" : undefined}
                variant="contained"
              />
              <CustomizeMenu
                anchor={{ vertical: "top", horizontal: "right" }}
                handleClose={handleClose}
                anchorEl={anchorEl}
                open={open}
                styles={{ marginTop: "8px" }}
              >
                <MenuItem>
                  <div className="flex items-center justify-between w-full">
                    <span className={theme === "light" && "text-black"}>
                      Search user
                    </span>
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="flex items-center justify-between w-full">
                    <span className={theme === "light" && "text-black"}>
                      Search post by hashtag
                    </span>
                  </div>
                </MenuItem>
              </CustomizeMenu>
              <BsFilterRight
                size={25}
                className="cursor-pointer"
                onClick={handleClickSort}
                aria-controls={openSort ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openSort ? "true" : undefined}
                variant="contained"
              />
              <CustomizeMenu
                anchor={{ vertical: "top", horizontal: "right" }}
                handleClose={handleCloseSort}
                anchorEl={sort}
                open={openSort}
                styles={{ marginTop: "8px" }}
              >
                {searchItems.map((option, i) => (
                  <div key={i}>
                    <MenuItem
                      onClick={(e) => handleMenuItemClick(e, i)}
                      selected={selectSearch}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={theme === "light" && "text-black"}>
                          {option?.name}
                        </span>
                      </div>
                    </MenuItem>
                  </div>
                ))}
              </CustomizeMenu>
            </div>
          </div>
          {/* search result */}
          <div className="w-full flex items-center">
            {isLoading ? (
              <div className="p-4 text-bgStandard ">Loading...</div>
            ) : searchResults.length > 0 ? (
              <ul>
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => navigate(`/profile/${user.userId}`)}
                    className=" w-full py-2 flex gap-2 items-center hover:bg-gray-100 bg-primary cursor-pointer"
                  >
                    <img
                      src={BlankAvatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm text-bgStandard">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-bgStandard">{user.username}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-sm text-bgStandard">
                No results found...
              </div>
            )}
          </div>
        </div>
      </div>
      <CreatePost buttonRight />
    </div>
  );
};

export default SearchPage;
