import {
  FriendCard,
  ProfileCard,
  Button,
  TopBar,
  GroupCard,
  DialogCustom,
  TextInput,
  CustomizeMenu,
} from "~/components";
import { user, posts, messages } from "~/assets/mockData/data";
import { useEffect, useRef, useState } from "react";
import { BsImages } from "react-icons/bs";
import { FaPhotoVideo } from "react-icons/fa";
import { PiGifThin } from "react-icons/pi";
import { Divider, MenuItem, Select, TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { getBase64 } from "~/utils";
import { IoCloseCircle } from "react-icons/io5";
import { useSelector } from "react-redux";
import Message from "~/components/Message";
import { GoDotFill } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { BlankAvatar } from "~/assets";
import { IoIosSearch } from "react-icons/io";
import { FiBookmark, FiSend } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import styled from "@emotion/styled";
import { GoBellSlash } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";
import { ImUserMinus } from "react-icons/im";

const ChatPage = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [fileMessage, setFileMessage] = useState(null);
  const [imageMessage, setImageMessage] = useState("");
  const [status, setStatus] = useState("");
  const [postState, setPostState] = useState("public");
  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    if (file) {
      getBase64(file)
        .then((result) => setImage(result))
        .catch((error) => console.error(error));
    }
  }, [file]);

  //delete
  const handleDeleteImage = () => {
    setFile(null);
    setImage("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  //submit
  const handleSubmitPost = () => {
    console.log({ status, image, postState });
  };

  const handleCloseDiaLogAdd = () => {
    setIsOpenDialogAdd(false);
  };

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //message
  const handleChangeFileMessage = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileMessage(selectedFile);
    }
  };

  useEffect(() => {
    if (fileMessage) {
      getBase64(fileMessage)
        .then((result) => setImageMessage(result))
        .catch((error) => console.error(error));
    }
  }, [fileMessage]);

  //setting
  const StyledDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.colorSchemes.light.border,
    margin: `${theme.spacing(0.5)} 0`,
    ...theme.applyStyles("dark", {
      borderColor: theme.colorSchemes.dark.border,
    }),
  }));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //click message
  const [clickMessage, setClickMessage] = useState("");
  const handleClickMessage = (i) => {
    setClickMessage(i);
  };

  return (
    <>
      <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
        <TopBar title={"Chat"} />
        <div className="w-full flex gap-2 pb-10 lg:gap-4 h-full">
          {/* trai */}
          <div className="hidden w-1/3 md:mx-2 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard />
            <FriendCard />
            <GroupCard />
          </div>

          {/* phai */}
          <div className="flex-1 h-full bg-primary px-4 mx-2 lg:m-0 py-2 flex  gap-6 overflow-y-auto rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-hidden">
            {/* trai */}

            <div className="w-1/3 h-full overflow-y-auto">
              <div className="sticky bg-primary w-full py-2 pb-3 top-0 z-10">
                <TextInput
                  placeholder="Search..."
                  iconLeft={<IoIosSearch size={20} />}
                  styles="rounded-full w-full"
                />
              </div>

              <div className="gap-y-2 flex flex-col">
                {messages.map((item, i) => (
                  <Message
                    onClick={() => handleClickMessage(i)}
                    key={i}
                    name={item?.firstName + " " + item?.lastName}
                    status={item?.status}
                    message={item?.message}
                    avatar={item?.profileUrl}
                  />
                ))}
              </div>
            </div>

            {/* phai */}
            <div className="flex-1 flex flex-col overflow-y-hidden">
              {clickMessage && (
                <>
                  {/* header */}
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-x-2 relative py-3">
                      <img
                        src={messages[clickMessage].profileUrl}
                        alt="avt"
                        className="h-12 w-12 rounded-full shadow-md object-cover"
                      />
                      <span className="text-ascent-1 font-semibold">
                        {messages[clickMessage].firstName +
                          " " +
                          messages[clickMessage].lastName}
                      </span>
                    </div>
                    {/* setting */}
                    <div className="flex justify-center items-center">
                      <div className="p-1 rounded-full transition-colors duration-20 hover:bg-gradient-to-r hover:from-bgColor hover:via-from-bgColor hover:to-from-bgColor">
                        <BiDotsHorizontalRounded
                          size={25}
                          color="#686868"
                          className="cursor-pointer "
                          onClick={handleClick}
                          id="demo-customized-button"
                          aria-controls={
                            open ? "demo-customized-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          variant="contained"
                        />
                        <CustomizeMenu
                          handleClose={handleClose}
                          anchorEl={anchorEl}
                          open={open}
                        >
                          <MenuItem onClick={handleClose} disableRipple>
                            <div className="flex items-center gap-2 w-full">
                              <GoBellSlash
                                color={theme === "light" && "black"}
                              />
                              <span
                                className={theme === "light" && "text-black"}
                              >
                                Tắt thông báo
                              </span>
                            </div>
                          </MenuItem>
                          <StyledDivider />
                          <MenuItem onClick={handleClose} disableRipple>
                            <div className="flex items-center gap-2 w-full">
                              <RiDeleteBinLine
                                color={theme === "light" && "black"}
                              />
                              <span
                                className={theme === "light" && "text-black"}
                              >
                                Xóa đoạn chat
                              </span>
                            </div>
                          </MenuItem>
                          <MenuItem onClick={handleClose} disableRipple>
                            <div className="flex items-center gap-2 w-full">
                              <ImUserMinus
                                color={theme === "light" && "black"}
                              />
                              <span
                                className={theme === "light" && "text-black"}
                              >
                                Chặn
                              </span>
                            </div>
                          </MenuItem>
                        </CustomizeMenu>
                      </div>
                    </div>
                  </div>
                  {/* body */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="gap-y-2 flex flex-col"></div>
                  </div>
                  {/* footer */}
                  <div className="flex text-ascent-1 w-full">
                    <TextInput
                      styles="w-full py-4 px-10 rounded-full"
                      placeholder="Type a message..."
                      iconRight={
                        <FiSend size={20} className="cursor-pointer" />
                      }
                      iconLeft={
                        <FiUpload
                          size={20}
                          onClick={handleUploadClick}
                          className="cursor-pointer"
                        />
                      }
                      iconLeftStyles="left-4"
                      iconRightStyles="right-6"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleChangeFileMessage}
                      className="hidden"
                      id="imgUpload"
                      data-max-size="5120"
                      accept=".jpg, .jpeg, .png, .gif, .mp4, .avi, .mkv"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
