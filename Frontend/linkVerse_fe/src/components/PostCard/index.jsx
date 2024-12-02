import moment from "moment";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiComment, BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { BlankAvatar } from "~/assets";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { CustomizeMenu, CustomizeModal } from "..";
import { Divider, MenuItem, styled } from "@mui/material";
import { FiBookmark } from "react-icons/fi";
import { TbMessageReport } from "react-icons/tb";
import { RiAttachment2 } from "react-icons/ri";
import { ImUserMinus } from "react-icons/im";
import { useSelector } from "react-redux";

const PostCard = ({ post, user, deletePost, likePost, isShowImage }) => {
  const theme = useSelector((state) => state.theme.theme);
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [like, setLike] = useState(false);

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

  return (
    <div className="mb-2 bg-primary p-4 rounded-xl">
      <div className="flex gap-3 items-center mb-2">
        <Link to={"/friend"}>
          <img
            src={post?.userId?.profileUrl ?? BlankAvatar}
            alt={post?.userId?.firstName}
            className="w-14 h-14 object-cover rounded-full"
          />
        </Link>

        <div className="w-full flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Link to={"/friend"}>
                <p className="font-medium text-lg text-ascent-1">
                  {post?.userId?.firstName} {post?.userId?.lastName}
                </p>
              </Link>
              <span className="text-ascent-2">
                {moment(post?.createdAt ?? "2024-10-10").fromNow()}
              </span>
            </div>
            <span className="text-ascent-2 text-sm">
              {post?.userId?.location}
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
      </div>
      <div>
        <p className="text-ascent-2">
          {showAll === post?._id
            ? post?.description
            : post?.description.slice(0, 300)}
          {post?.description.length > 301 &&
            (showAll === post?._id ? (
              <span
                className="text-blue ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(0)}
              >
                Show less
              </span>
            ) : (
              <span
                className="text-blue ml-2 font-medium cursor-pointer"
                onClick={() => setShowAll(post?._id)}
              >
                Show more
              </span>
            ))}
        </p>

        {post?.image && !isShowImage && (
          <>
            <img
              ref={imgRef}
              onClick={handleClickImage}
              src={post?.image}
              alt="post image"
              className="w-full mt-2 rounded-lg cursor-pointer"
            />
            <CustomizeModal
              imageSrc={imagePreview}
              open={openImagePreview}
              handleOpen={handleClickImage}
              handleClose={handleClosePreview}
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
        <div className="flex gap-2 items-center text-base cursor-pointer">
          {/* {post?.like?.includes(user?._id) ? (
            <BiSolidLike size={20} color="blue" />
          ) : (
            <BiLike size={20} />
          )} */}
          <div onClick={handleLike}>
            {like ? (
              <BiSolidLike size={20} color="blue" className="hover:scale-105" />
            ) : (
              <BiLike size={20} className="hover:scale-105" />
            )}
          </div>
          {post?.likes?.length} Likes
        </div>

        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => {
            navigate(`/post/${user?.id}`);
            setShowComments(showComments === post._id ? null : post?._id);
            getComments(post?._id);
          }}
        >
          <BiComment size={20} />
          {post?.comments?.length} Comments
        </p>

        {user?._id === post?.userId?._id && (
          <div
            className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
            onClick={() => deletePost(post?._id)}
          >
            <MdOutlineDelete size={20} />
            <span>Delete</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
