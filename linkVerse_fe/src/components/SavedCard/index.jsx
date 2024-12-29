import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidLike } from "react-icons/bi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BiCommentDetail } from "react-icons/bi";
import { BiSolidLockAlt, BiSolidDislike } from "react-icons/bi";
import { BlankAvatar } from "~/assets";
import { FaEarthAmericas } from "react-icons/fa6";
import { IoPaperPlaneOutline } from "react-icons/io5";
import * as UserService from "~/services/UserService";
import { CustomizeMenu } from "..";
import { MenuItem } from "@mui/material";
import { FiBookmark } from "react-icons/fi";
import { useSelector } from "react-redux";
import { GoBookmarkSlash } from "react-icons/go";

const SavedCard = ({ post }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const theme = useSelector((state) => state?.theme);
  const [showAll, setShowAll] = useState(0);
  const [user, setUser] = useState(null);

  const fetchDetailUser = async ({ id, token }) => {
    const res = await UserService.getDetailUserByUserId({ id, token });
    setUser(res?.result);
  };

  useEffect(() => {
    fetchDetailUser({ id: post?.userId, token });
  }, []);

  //Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderContentWithHashtags = (content) => {
    if (!content) return "";
    const parts = content.split(/(\s+)/);
    return parts.map((part, index) => {
      if (/^#[A-Za-z0-9_]+$/.test(part)) {
        return (
          <span key={index} className="text-blue font-medium cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-primary p-5 rounded-2xl border-e-borderNewFeed border-1 shadow-newFeed">
      <div
        onClick={() => navigate(`/post/${post.id}`)}
        className="flex gap-3 items-center mb-2 cursor-pointer"
      >
        <img
          onClick={(e) => e.stopPropagation()}
          src={user?.imageUrl ?? BlankAvatar}
          alt={"avatar"}
          className="w-14 h-14 object-cover rounded-full"
        />

        <div className="w-full flex justify-between">
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 ">
              <Link to={`/profile/${post?.userId}`}>
                <p className="font-medium text-lg text-ascent-1">
                  {user?.username || "No name"}
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
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                aria-expanded={open ? "true" : undefined}
                variant="contained"
              />
              <CustomizeMenu
                handleClose={handleClose}
                anchorEl={anchorEl}
                open={open}
                anchor={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => handleSavePost(post?.id)}>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-ascent-1">Unsave</span>
                    <GoBookmarkSlash color="black" />
                  </div>
                </MenuItem>
              </CustomizeMenu>
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
    </div>
  );
};

export default SavedCard;
