import {
  FriendCard,
  ProfileCard,
  Button,
  PostCard,
  TopBar,
  GroupCard,
  FriendRequest,
  FriendSuggest,
  DialogCustom,
  CustomizeMenu,
} from "~/components";
import { posts } from "~/assets/mockData/data";
import { useEffect, useState } from "react";
import { BlankAvatar } from "~/assets/index";
import { BsImages } from "react-icons/bs";
import { FaPhotoVideo } from "react-icons/fa";
import { PiGifThin } from "react-icons/pi";
import { Divider, MenuItem, Select, TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { getBase64 } from "~/utils";
import { IoCloseCircle } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as UserService from "~/services/UserService";
import * as PostService from "~/services/PostService";
import moment from "moment";
import { Link } from "react-router-dom";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import styled from "@emotion/styled";
import { FiBookmark } from "react-icons/fi";
import { TbMessageReport } from "react-icons/tb";
import { ImUserMinus } from "react-icons/im";
import { RiAttachment2 } from "react-icons/ri";

const ReplyPage = () => {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState("");
  const [text, setText] = useState("");
  const user = useSelector((state) => state.user);
  const [status, setStatus] = useState("public");
  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    if (file) {
      getBase64(file)
        .then((result) => setImg(result))
        .catch((error) => console.error(error));
    }
  }, [file]);

  //delete
  const handleDeleteImg = () => {
    setFile(null);
    setImg("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  //create post
  const mutation = useMutationHook((newPost) => {
    PostService.createPost(newPost);
  });

  const { data: dataCreatedPost, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      console.log(dataCreatedPost);
    } else if (isError) {
      console.log("error");
    }
  }, [isSuccess]);
  //submit
  const handleSubmitPost = () => {
    const newPost = { postedBy: user.id, text, img, status };
    mutation.mutate(newPost);
  };

  const handleCloseDiaLogAdd = () => {
    setIsOpenDialogAdd(false);
  };

  //comment
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

  return (
    <>
      <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
        <TopBar title={"Comment"} />
        <div className="w-full flex gap-2 pb-10 lg:gap-4 h-full">
          {/* trai */}
          <div className="hidden w-1/3 md:mx-2 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard />
            <FriendCard />
            <GroupCard />
          </div>

          {/* giua */}
          <div className="flex-1 h-full bg-primary px-4 mx-2 pt-2 lg:m-0 flex flex-col gap-6 overflow-y-auto rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
            <div className="flex flex-col gap-6">
              {/* Post */}
              <div className="flex flex-col gap-6">
                <PostCard
                  key={0}
                  post={posts[0]}
                  user={user}
                  deletePost={() => {}}
                  likePost={() => {}}
                />
              </div>
            </div>

            {/* comment */}
            {posts.map((post, i) => (
              <PostCard
                isShowImage
                key={i}
                post={post}
                user={user}
                deletePost={() => {}}
                likePost={() => {}}
              />
            ))}
            {/* <div className="flex gap-3 items-center mb-2">
              <Link to={"/friend"}>
                <img
                  src={posts[0]?.userId?.profileUrl ?? BlankAvatar}
                  alt={posts[0]?.userId?.firstName}
                  className="w-14 h-14 object-cover rounded-full"
                />
              </Link>

              <div className="w-full flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Link to={"/friend"}>
                      <p className="font-medium text-lg text-ascent-1">
                        {posts[0]?.userId?.firstName}{" "}
                        {posts[0]?.userId?.lastName}
                      </p>
                    </Link>
                    <span className="text-ascent-2">
                      {moment(posts[0]?.createdAt ?? "2024-10-10").fromNow()}
                    </span>
                  </div>
                  <span className="text-ascent-2 text-sm">
                    {posts[0]?.userId?.location}
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <div className="p-1 rounded-full transition-colors duration-20 hover:bg-gradient-to-r hover:from-bgColor hover:via-from-bgColor hover:to-from-bgColor">
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
                      disableElevation
                    />
                    <CustomizeMenu
                      handleClose={handleClose}
                      anchorEl={anchorEl}
                      open={open}
                    >
                      <MenuItem onClick={handleClose} disableRipple>
                        <div className="flex items-center justify-between w-full">
                          <span className={theme === "light" && "text-black"}>
                            Save
                          </span>
                          <FiBookmark color={theme === "light" && "black"} />
                        </div>
                      </MenuItem>
                      <StyledDivider />
                      <MenuItem onClick={handleClose} disableRipple>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-red-600">Report</span>
                          <TbMessageReport color="red" />
                        </div>
                      </MenuItem>
                      <MenuItem onClick={handleClose} disableRipple>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-red-600">Block</span>
                          <ImUserMinus color="red" />
                        </div>
                      </MenuItem>
                      <StyledDivider />
                      <MenuItem onClick={handleClose} disableRipple>
                        <div className="flex items-center justify-between w-full">
                          <span className={theme === "light" && "text-black"}>
                            Copy address
                          </span>
                          <RiAttachment2 color={theme === "light" && "black"} />
                        </div>
                      </MenuItem>
                    </CustomizeMenu>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* phai */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <FriendRequest />
            <FriendSuggest />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReplyPage;
