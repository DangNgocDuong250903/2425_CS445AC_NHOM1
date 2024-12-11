import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiComment, BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { BlankAvatar } from "~/assets";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Button, CustomizeMenu, DialogCustom } from "..";
import {
  Divider,
  FormControl,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import { FiBookmark } from "react-icons/fi";
import { TbMessageReport } from "react-icons/tb";
import { RiAttachment2 } from "react-icons/ri";
import { ImUserMinus } from "react-icons/im";
import { useSelector } from "react-redux";
import { getBase64 } from "~/utils";
import { PiGifThin } from "react-icons/pi";
import { FaPhotoVideo } from "react-icons/fa";
import { BsImages } from "react-icons/bs";
import { IoCloseCircle } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";

const PostCard = ({ post, deletePost, likePost, isShowImage }) => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
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

  return (
    <div className="bg-primary p-2 rounded-xl">
      <div
        onClick={() => navigate(`/post/${post._id}`)}
        className="flex gap-3 items-center mb-2 cursor-pointer"
      >
        <Link
          to={`/profile/${post?.postedBy}`}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={post?.userId?.profileUrl ?? BlankAvatar}
            alt={post?.userId?.firstName}
            className="w-14 h-14 object-cover rounded-full"
          />
        </Link>

        <div className="w-full flex justify-between">
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 ">
              <Link to={`/profile/${post?.postedBy}`}>
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
              >
                <MenuItem onClick={handleClose}>
                  <div className="flex items-center justify-between w-full">
                    <span className={theme === "light" && "text-black"}>
                      Save
                    </span>
                    <FiBookmark color={theme === "light" && "black"} />
                  </div>
                </MenuItem>
                <StyledDivider />
                {user?.id !== post?._id && (
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
                {user?.id === post?._id && (
                  <div>
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
                  </div>
                )}
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
        <div className="flex gap-2 items-center hover:scale-105 text-base cursor-pointer ">
          <div onClick={handleLike}>
            {like ? (
              <BiSolidLike size={20} color="blue" />
            ) : (
              <BiLike size={20} className="hover:scale-105" />
            )}
          </div>
          {post?.likes?.length} Likes
        </div>

        <p
          className="flex gap-2 items-center text-base cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {
            setIsOpenReply(true);
            setShowComments(showComments === post._id ? null : post?._id);
            getComments(post?._id);
          }}
        >
          <BiComment size={20} />
          {post?.comments?.length} Comments
        </p>
      </div>
      {/* deletpost */}
      {/* {user?._id === post?.userId?._id && (
          <div
            className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
            onClick={() => deletePost(post?._id)}
          >
            <MdOutlineDelete size={20} />
            <span>Delete</span>
          </div>
        )} */}

      {/* post */}
      <DialogCustom
        isOpen={isOpenReply}
        theme={theme}
        handleCloseDiaLogAdd={handleCloseReply}
      >
        <div
          className={`w-full ${
            theme === "dark" ? "bg-[rgb(24,24,24)]" : "bg-white"
          } shadow-newFeed`}
        >
          {/* header */}
          <div className="w-full flex items-center justify-between gap-5 px-5 py-4">
            <button
              onClick={() => setIsOpenReply(false)}
              className={`text-ascent-1 font-medium hover:text-neutral-500 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Hủy
            </button>
            <span
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Reply
            </span>
            <div />
          </div>
          <div className="w-full border-t-[0.1px] border-borderNewFeed" />

          {/* body */}
          <div className=" w-full flex flex-col px-5 py-4 justify-center gap-y-2">
            <div>
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
            </div>
            {/* 1 */}
            <div className="flex gap-x-3">
              {/* 1 */}
              <img
                src={user?.profileUrl ?? BlankAvatar}
                alt="User Image"
                className="w-14 h-14 rounded-full object-cover shadow-newFeed"
              />
              {/* 2 */}
              <TextField
                label={`Trả lời ${user?.firstName + user?.lastName}`}
                multiline
                onChange={(e) => setTextReply(e.target.value)}
                maxRows={5}
                variant="standard"
                fullWidth
                sx={{
                  "& .MuiInput-root": {
                    color: theme === "dark" ? "#fff" : "#000",
                    // Bottom border
                    "&:before": {
                      display: "none",
                    },
                    // Border on focus
                    "&:after": {
                      display: "none",
                    },
                    ":hover:not(.Mui-focused)": {
                      color: "",
                      "&:before": {
                        display: "none",
                      },
                    },
                  },
                  // Label
                  "& .MuiInputLabel-standard": {
                    color: "rgb(89, 91, 100)",
                    "&.Mui-focused": {
                      display: "none",
                    },
                  },
                }}
              />
            </div>
            {/* 2 */}
            <div className="flex gap-x-10 items-center px-6">
              <div className="h-9 border-solid border-borderNewFeed border-[0.1px]" />
              {/* upload */}
              <div className="flex items-center justify-between py-4 gap-x-3">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="imgUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                  />
                  <BsImages style={{ width: "20px", height: "20px" }} />
                </label>
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  htmlFor="videoUpload"
                >
                  <input
                    type="file"
                    data-max-size="5120"
                    onChange={handleFileChange}
                    className="hidden"
                    id="videoUpload"
                    accept=".mp4, .wav"
                  />
                  <FaPhotoVideo style={{ width: "20px", height: "20px" }} />
                </label>
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  htmlFor="vgifUpload"
                >
                  <input
                    type="file"
                    data-max-size="5120"
                    onChange={handleFileChange}
                    className="hidden"
                    id="vgifUpload"
                    accept=".gif"
                  />
                  <PiGifThin style={{ width: "25px", height: "25px" }} />
                </label>
                {file && file?.size > 5120 * 1024 && (
                  <span className="text-xs text-red-600">
                    vui lòng tải &lt; file 5mb
                  </span>
                )}
              </div>
            </div>
            {/* 3 */}
            <div>
              {img && file?.type?.includes("mp4") && (
                <div className="relative">
                  <video
                    width="100%"
                    controls
                    className="rounded-xl border-1 border-borderNewFeed"
                  >
                    <source src={img} />
                  </video>
                  <IoCloseCircle
                    onClick={handleDeleteImg}
                    className="absolute top-0 right-0 m-2 w-7 h-7 fill-[#8D867F] cursor-pointer"
                  />
                </div>
              )}

              {img &&
                (file?.type.includes("jpeg") ||
                  file?.type.includes("png") ||
                  file?.type.includes("gif")) && (
                  <div className="w-full h-[300px] relative">
                    <img
                      src={img}
                      className="rounded-xl border-1 shadow-newFeed border-borderNewFeed"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IoCloseCircle
                      onClick={handleDeleteImg}
                      className="absolute top-0 right-0 m-2 w-7 h-7 fill-[#8D867F] cursor-pointer"
                    />
                  </div>
                )}
            </div>
            {/* 4 */}
            <div className="w-full flex justify-between">
              <FormControl
                sx={{ m: 1, minWidth: 120 }}
                size="small"
                variant="standard"
              >
                <Select
                  disableUnderline="true"
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{
                    boxShadow: "none",
                    "& .MuiSelect-icon": {
                      display: "none",
                    },
                  }}
                >
                  <MenuItem value={"public"}>
                    <span className="text-ascent-2">Công khai</span>
                  </MenuItem>
                  <MenuItem value={"private"}>
                    <span className="text-ascent-2">Riêng tư</span>
                  </MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                title="Đăng"
                disable={textReply === null || !textReply.trim() ? true : false}
                // onClick={handleSubmitPost}
                containerStyles="bg-bgColor px-5 py-1 rounded-xl text-ascent-2 border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed hover:bg-[#ccc]"
              />
            </div>
          </div>
        </div>
      </DialogCustom>
    </div>
  );
};

export default PostCard;
