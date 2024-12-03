import { Link, useNavigate } from "react-router-dom";
import { BlankAvatar } from "~/assets/index";
import { LiaEditSolid } from "react-icons/lia";
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFillAdd,
} from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import { FiBookmark } from "react-icons/fi";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import styled from "@emotion/styled";

const ProfileCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);

  //Update profile
  const handleUpdateProfile = () => {};

  //acordition
  const StyledAcordion = styled(Accordion)(({ theme }) => ({
    boxShadow: "none",
    borderRadius: 20,
    "& .MuiButtonBase-root": {
      padding: 0,
    },

    // ...theme.applyStyles("dark", {
    //   borderColor: theme.colorSchemes.dark.border,
    // }),
  }));

  return (
    <div className="w-full bg-primary flex flex-col items-center rounded-xl px-6 py-4 shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed ">
      {/* tren */}
      <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
        <Link to={"/profile/" + user?.id} className="flex gap-2">
          <img
            src={user?.avatar || BlankAvatar}
            alt={user?.email}
            className="w-14 h-14 object-cover rounded-full"
          />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-medium text-ascent-1">
              {user?.firstName} {user?.lastName}
            </p>
            <span className="text-ascent-1">
              {user?.profession || "No profession"}
            </span>
          </div>
        </Link>
        {/* update profile */}
        <div className="">
          {user?.id ? (
            <LiaEditSolid
              size={22}
              className="text-blue cursor-pointer"
              onClick={() => navigate(`/profile/${user?.id}`)}
            />
          ) : (
            <button
              className="bg-[#0444a430] text-sm text-white p-1 rounded"
              onClick={() => {}}
            >
              <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
            </button>
          )}
        </div>
      </div>
      {/* Thong tin ca nhan */}
      <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
        <div className="flex gap-2 items-center text-ascent-2">
          <CiLocationOn className="text-xl text-ascent-1" />
          <span>{user?.address || "Thêm địa chỉ"}</span>
        </div>

        <div className="flex gap-2 items-center text-ascent-2">
          <BsBriefcase className="text-lg text-ascent-1" />
          <span>{user?.profession || "Thêm nghề nghiệp"}</span>
        </div>
      </div>
      {/* Friends */}
      <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
        <p className="text-lg text-ascent-1 font-semibold lowercase">
          {user?.following.length} {t("Bạn bè")}
        </p>

        {/* <div className="flex items-center justify-between">
          <span className="text-ascent-2">
            {t("Ai đã xem tài khoản của bạn")}
          </span>
          <span className="text-ascent-1 text-lg">{user?.views?.length}</span>
        </div> */}

        <span className="text-base text-blue">
          {user?.isActive ? "Verified account" : "Not verified"}
        </span>

        <div className="flex items-center justify-between">
          <span className="text-ascent-2">{t("Tham gia")}</span>
          <span className="text-ascent-1 text-base">
            {moment(user?.createdAt).fromNow() || "none"}
          </span>
        </div>
      </div>
      {/* Chat */}
      {/* <div className="flex flex-col w-full justify-between items-center py-2">
        <div
          onClick={() => navigate("/chat")}
          className="w-full flex justify-between items-center py-3 rounded-2xl hover:bg-slate-50 cursor-pointer"
        >
          <p className="text-lg text-ascent-1 font-semibold">Chat</p>
          <IoChatboxEllipsesOutline className="text-xl text-ascent-1 cursor-pointer" />
        </div>

        <StyledAcordion className="hover:bg-slate-50 w-full">
          <AccordionSummary
            expandIcon={<FiBookmark />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Save
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col">
              <h1>test</h1>
              <h1>test</h1>
            </div>
          </AccordionDetails>
        </StyledAcordion>
      </div> */}
      {/* <div className="flex flex-col w-full py-2 gap-y-2">
        <div
          onClick={() => navigate("/chat")}
          className="w-full flex justify-between items-center p-2 py-3 rounded-2xl hover:bg-slate-50 cursor-pointer"
        >
          <p className="text-lg text-ascent-1 font-semibold">Chat</p>
          <IoChatboxEllipsesOutline className="text-xl text-ascent-1 cursor-pointer" />
        </div>
        <div className="w-full flex justify-between items-center p-2 py-3 rounded-2xl hover:bg-slate-50 cursor-pointer">
          <p className="text-lg text-ascent-1 font-semibold">Save</p>
          <FiBookmark
            className="text-xl text-ascent-1 cursor-pointer"
            onClick={() => navigate("/chat")}
          />
        </div>
      </div> */}
      {/* Social profile */}
      <div className="w-full flex flex-col gap-4 py-4 pb-6 border-t border-[#66666645]">
        <p className="text-ascent-1 text-lg font-semibold">
          {t("Mạng xã hội")}
        </p>

        <div className="flex gap-2 items-center text-ascent-2">
          <BsInstagram className="text-xl text-ascent-1" />
          <a target="_blank" href="https://www.instagram.com/">
            Instagram
          </a>
        </div>
        <div className="flex gap-2 items-center text-ascent-2">
          <BsFacebook className="text-xl text-ascent-1" />
          <a target="_blank" href="https://www.facebook.com/">
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
