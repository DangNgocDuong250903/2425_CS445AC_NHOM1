import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiComment, BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { BlankAvatar } from "~/assets";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Alerts, Button, CustomizeMenu, DialogCustom } from "..";
import { BiCommentDetail } from "react-icons/bi";
import {
  Divider,
  FormControl,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import { PiShareFat } from "react-icons/pi";
import { FiBookmark } from "react-icons/fi";
import { TbMessageReport } from "react-icons/tb";
import { RiAttachment2 } from "react-icons/ri";
import { ImUserMinus } from "react-icons/im";
import { useSelector } from "react-redux";
import { copyToClipboard, getBase64 } from "~/utils";
import { PiGifThin } from "react-icons/pi";
import { FaPhotoVideo } from "react-icons/fa";
import { BsImages } from "react-icons/bs";
import { IoCloseCircle } from "react-icons/io5";
import { FaRegTrashCan, FaEarthAmericas } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BiSolidLockAlt, BiDislike, BiSolidDislike } from "react-icons/bi";
import { FaRegGrinStars } from "react-icons/fa";
import * as UserService from "~/services/UserService";
import CreateComment from "../CreateComment";
import * as PostService from "~/services/PostService";

const PostCard = ({ post, isShowImage, fetchPosts }) => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(0);
  const [react, setReact] = useState("👍");
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [like, setLike] = useState(false);
  const [disLike, setDisLike] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [url, setUrl] = useState("");
  const [typeMessage, setTypeMessage] = useState("success");
  const [message, setMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);

  const getComments = async () => {};

  const handleLike = () => {
    setLike(like === true ? false : true);
  };

  //Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.colorSchemes.light.border,
    margin: `${theme.spacing(0.5)} 0`,
    ...theme.applyStyles("dark", {
      borderColor: theme.colorSchemes.dark.border,
    }),
  }));

  //preview img
  const imgRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const handleClickImage = () => {
    setImagePreview(imgRef.current.src);
    setOpenImagePreview(true);
  };

  const handleClosePreview = () => {
    setOpenImagePreview(false);
  };

  //comment
  const [isOpenReply, setIsOpenReply] = useState(false);
  const [textReply, setTextReply] = useState("");
  const [file, setFile] = useState(null);
  const [img, setImg] = useState("");
  const [status, setStatus] = useState("public");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    if (file) {
      getBase64(file)
        .then((result) => setImg(result))
        .catch((error) => console.error(error));
    }
  }, [file]);

  const handleDeleteImg = () => {
    setFile(null);
    setImg("");
  };

  const handleCloseReply = () => {
    setIsOpenReply(false);
  };

  const handleTranslateEn = () => {};
  const handleTranslateVie = () => {};

  // const [user, setUser] = useState(null);

  // const fetchDetailUser = async ({ id, token }) => {
  //   const res = await UserService.getDetailUserByUserId({ id, token });
  //   setUser(res);
  // };

  // useEffect(() => {
  //   fetchDetailUser({ id: post?.userId, token });
  // }, []);

  // const likePost = async ({ id, emoji, token }) => {
  //   const res = await PostService.like({ id, emoji, token });
  //   return res;
  // };

  // useEffect(() => {
  //   const id = post?.id;
  //   const emoji = react;
  //   likePost({ id, emoji, token });
  // }, [react]);

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const handleSaveUrl = (id) => {
    setUrl(`http://localhost:5173/post/${id}`);
    setMessage("Copy to clipboard success!");
    copyToClipboard(url);
    handleClose();
    setOpenMessage(true);
  };

  //share post
  const handleShare = async (id) => {
    const res = await PostService.share({ id, token });
    if (res?.code === 200) {
      setMessage("Share post success!");
      setOpenMessage(true);
    }
  };

  //delete post
  const handleDeletePost = async (id) => {
    const res = await PostService.deletePost({ id, token });
    if (res?.code === 200) {
      handleClose();
      setOpenMessage(true);
      setMessage("Delete post success!");
      fetchPosts();
    }
  };

  //save post
  const handleSavePost = async (id) => {
    const res = await PostService.save({ id, token });
    if (res?.code === 200) {
      setOpenMessage(true);
      setMessage("Save post success!");
      handleClose();
      fetchPosts();
    }
    if (res?.code === 400) {
      setTypeMessage("error");
      setOpenMessage(true);
      setMessage("Post already saved!");
      handleClose();
      fetchPosts();
    }
  };

  return (
    <div className="bg-primary p-2 rounded-xl">
      <Alerts
        type={typeMessage}
        message={message}
        open={openMessage}
        position={{ vertical: "bottom", horizontal: "center" }}
        handleClose={handleCloseMessage}
      />
      <div
        onClick={() => navigate(`/post/${post.id}`)}
        className="flex gap-3 items-center mb-2 cursor-pointer"
      >
        {/* <Link
          to={`/profile/${post?.userId}`}
          className="block w-14 h-14"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={BlankAvatar}
            alt={"avatar"}
            className="w-14 h-14 object-cover"
          />
        </Link> */}
        <img
          onClick={(e) => e.stopPropagation()}
          src={BlankAvatar}
          alt={"avatar"}
          className="w-14 h-14 object-cover rounded-full"
        />

        <div className="w-full flex justify-between">
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 ">
              <Link to={`/profile/${post?.userId}`}>
                <p className="font-medium text-lg text-ascent-1">
                  {user?.username ?? "No name"}
                </p>
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#A4A8AD] text-sm">
                {moment(post?.createdDate).fromNow()}
              </span>
              {post?.visibility && post?.visibility === "PRIVATE" && (
                <BiSolidLockAlt size={14} color="#A4A8AD" />
              )}
              {post?.visibility && post?.visibility === "PUBLIC" && (
                <FaEarthAmericas size={14} color="#A4A8AD" />
              )}
            </div>
          </div>

          <div
            className="flex justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
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
              />
              <CustomizeMenu
                handleClose={handleClose}
                anchorEl={anchorEl}
                open={open}
                anchor={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  disableRipple
                  onClick={() => handleSavePost(post?.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={theme === "light" && "text-black"}>
                      Save
                    </span>
                    <FiBookmark color={theme === "light" && "black"} />
                  </div>
                </MenuItem>
                <StyledDivider />
                {user?.userId !== post?.userId && (
                  <div>
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
                  </div>
                )}
                {user?.id === post?.userId && (
                  <div>
                    <MenuItem onClick={handleClose} disableRipple>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-red-600">Edit post</span>
                        <FaRegEdit color="red" />
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeletePost(post?.id)}
                      disableRipple
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-red-600">Delete</span>
                        <FaRegTrashCan color="red" />
                      </div>
                    </MenuItem>
                  </div>
                )}
                <StyledDivider />
                <MenuItem onClick={() => handleSaveUrl(post?.id)}>
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
      </div>

      <div>
        <p className="text-ascent-2">
          {showAll === post?.id
            ? post?.content || ""
            : post?.content?.slice(0, 300) || ""}

          {post?.content &&
            post.content.length > 301 &&
            (showAll === post?.id ? (
              <span
                className="text-blue ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(0)}
              >
                Show less
              </span>
            ) : (
              <span
                className="text-blue ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(post?.id)}
              >
                Show more
              </span>
            ))}
        </p>
        {/* {post?.language === "en" && (
          <p
            onClick={handleTranslateEn}
            className="cursor-pointer text-sm text-ascent-2"
          >
            Translate to Vietnamese
          </p>
        )}
        {post?.language === "vi" && (
          <p
            onClick={handleTranslateEn}
            className="cursor-pointer text-sm text-ascent-2"
          >
            Translate to English
          </p>
        )} */}

        {post?.imageUrl && post?.imageUrl?.length > 0 && !isShowImage && (
          <>
            <img
              ref={imgRef}
              onClick={handleClickImage}
              src={post?.imageUrl}
              alt="post image"
              className="w-full mt-2 rounded-lg cursor-pointer"
            />
            <DialogCustom
              imageSrc={imagePreview}
              isOpen={openImagePreview}
              handleCloseDiaLogAdd={handleClosePreview}
            />
          </>
        )}

        {post?.video && !isShowImage && (
          <div className="relative">
            <video
              width="100%"
              controls
              className="w-full mt-2 rounded-lg cursor-pointer"
            >
              <source src={post?.video} />
            </video>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]">
        <div className="flex gap-x-3">
          <div className="flex gap-2 items-center hover:scale-105 text-base cursor-pointer ">
            <div>
              {like ? (
                <>
                  <BiSolidLike
                    size={20}
                    color="blue"
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                  />
                </>
              ) : (
                <>
                  <div class="relative group">
                    {react}
                    {/* <BiLike size={20} className="hover:scale-105" /> */}

                    <div class="absolute bottom-8  left-1/2 -translate-x-8 flex space-x-2 bg-primary rounded-full border-borderNewFeed shadow-newFeed p-2 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition duration-300 ease-in-out">
                      <div
                        onClick={() => setReact("👍")}
                        class="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full hover:scale-125 transition-transform duration-200"
                      >
                        👍
                      </div>

                      <div
                        onClick={() => setReact("❤️")}
                        class="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full hover:scale-125 transition-transform duration-200"
                      >
                        ❤️
                      </div>

                      <div
                        onClick={() => setReact("😂")}
                        class="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full hover:scale-125 transition-transform duration-200"
                      >
                        😂
                      </div>

                      <div
                        onClick={() => setReact("😀")}
                        class="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full hover:scale-125 transition-transform duration-200"
                      >
                        😀
                      </div>

                      <div
                        onClick={() => setReact("😢")}
                        class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:scale-125 transition-transform duration-200"
                      >
                        😢
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {post?.like}
          </div>

          <div className="flex gap-2 items-center hover:scale-105 text-base cursor-pointer ">
            <div>
              {disLike ? (
                <BiSolidDislike size={20} color="blue" />
              ) : (
                <span>👎</span>
                // <BiDislike size={20} className="hover:scale-105" />
              )}
            </div>
            {post?.unlike}
          </div>

          {/* BiDislike */}
          <p
            className="flex gap-2 items-center text-base cursor-pointer hover:scale-105 transition-transform"
            onClick={() => {
              setIsOpenReply(true);
              setShowComments(showComments === post.id ? null : post?.id);
              getComments(post?._id);
            }}
          >
            <BiCommentDetail
              size={20}
              onClick={() => setOpenComment(true)}
              className="cursor-pointer"
            />
            {post?.commentCount}
          </p>
          <CreateComment
            open={isOpenReply}
            handleClose={handleCloseReply}
            id={post?.id}
          />
        </div>
        <div
          onClick={() => handleShare(post?.id)}
          className="flex gap-2 items-center hover:scale-105 text-base cursor-pointer"
        >
          <IoPaperPlaneOutline size={20} />
          {post?.sharedPost}Shares
        </div>
      </div>
    </div>
  );
};

export default PostCard;
