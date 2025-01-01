import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Alerts, CustomizeMenu, DialogCustom, TextInput } from "..";
import { BiCommentDetail } from "react-icons/bi";
import { CircularProgress, Divider, MenuItem, styled } from "@mui/material";
import { TbMessageReport } from "react-icons/tb";
import { RiAttachment2 } from "react-icons/ri";
import { ImUserMinus } from "react-icons/im";
import { useSelector } from "react-redux";
import { copyToClipboard, getBase64 } from "~/utils";
import { BiSolidLockAlt, BiDislike, BiSolidDislike } from "react-icons/bi";
import CreateComment from "../CreateComment";
import * as PostService from "~/services/PostService";
import AlertWelcome from "../AlertWelcome";
import { BlankAvatar } from "~/assets";
import { FaEarthAmericas, FaRegTrashCan } from "react-icons/fa6";
import { FiBookmark } from "react-icons/fi";
import { IoPaperPlaneOutline } from "react-icons/io5";
import PostMenu from "../PostMenu";

const PostGroup = ({ post, isShowImage, fetchPosts }) => {
  const theme = useSelector((state) => state.theme.theme);
  const userState = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [likeCount, setLikeCount] = useState(post?.like || 0);
  const [dislikeCount, setDislikeCount] = useState(post?.unlike || 0);
  const [like, setLike] = useState(false);
  const [disLike, setDisLike] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [url, setUrl] = useState("");
  const [typeMessage, setTypeMessage] = useState("success");
  const [message, setMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [type, setType] = useState("");
  const [icon, setIcon] = useState(null);
  const [duration, setDuration] = useState("");

  const handleCloseAlert = () => {
    setOpenAlert(false);
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

  const renderContentWithHashtags = (content) => {
    if (!content) return "";
    const parts = content.split(/(\s+)/);
    return parts.map((part, index) => {
      if (/^#[A-Za-z0-9_]+$/.test(part)) {
        return (
          <span key={index} className="text-blue cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-primary p-5 rounded-2xl border-borderNewFeed border-1 shadow-newFeed">
      <div
        onClick={() => navigate(`/post/${post.id}`)}
        className="flex gap-3 items-center mb-2 cursor-pointer"
      >
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
                <p className="font-medium text-lg text-ascent-1">{"No name"}</p>
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
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="contained"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className={`text-ascent-2 `}>
          {showAll === post?.id
            ? renderContentWithHashtags(post?.content) || ""
            : renderContentWithHashtags(post?.content?.slice(0, 300)) || ""}

          {post?.content &&
            post.content.length > 301 &&
            (showAll === post?.id ? (
              <span
                className="text-blue ml-2 font-medium  cursor-pointer"
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

        {post?.imageUrl && post?.imageUrl?.length > 0 && !isShowImage && (
          <>
            <img
              src={post?.imageUrl}
              alt="post image"
              className="w-full mt-2 rounded-lg cursor-pointer"
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
            <div className="relative group">
              <BiSolidLike
                size={20}
                className="text-blue-500"
                color="#0444A4"
              />
            </div>
            <span>1</span>
          </div>

          <div className="flex gap-2 items-center hover:scale-105 text-base cursor-pointer ">
            <div class="relative group">
              <BiSolidDislike
                size={20}
                color="#0444A4"
                className="text-blue-500"
              />
            </div>
            <span>2</span>
          </div>

          <p className="flex gap-2 items-center text-base cursor-pointer hover:scale-105 transition-transform">
            <BiCommentDetail size={20} className="cursor-pointer" />2
          </p>
        </div>
        <div className="flex gap-2 items-center hover:scale-105 text-base cursor-pointer">
          <IoPaperPlaneOutline size={20} />
        </div>
      </div>
      <div className="py-2 w-full flex gap-3 items-center">
        <img
          src={BlankAvatar}
          alt="avatar"
          className="w-11 h-1w-11 mt-2 rounded-full object-cover"
        />
        <TextInput
          name="username"
          placeholder="Write your comment"
          type="username"
          styles="w-full rounded-full bg-[#FAFAFA]"
        />
      </div>
    </div>
  );
};

export default PostGroup;
