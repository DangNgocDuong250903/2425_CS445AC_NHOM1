import { Link } from "react-router-dom";
import { BlankAvatar } from "~/assets/index";
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFillAdd,
} from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { UpdateUser } from "..";

const ProfileCard = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state?.user);

  return (
    <div className="w-full bg-primary flex flex-col items-center rounded-2xl px-6 py-4 shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed ">
      <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
        <Link to={`/profile/${user?.id}`} className="flex gap-2">
          <div className="relative">
            <img
              src={user?.avatar || BlankAvatar}
              alt={"avatar"}
              className="w-14 h-14 object-cover rounded-full"
            />
            {user?.status === "ONLINE" ? (
              <div className="absolute top-1 right-1 w-3 h-3 bg-[#53C259] rounded-full border-2 border-[#392629]" />
            ) : (
              <div className="absolute top-1 right-1 w-3 h-3 bg-[#ccc] rounded-full border-2 border-[#000]" />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg font-medium text-ascent-1">
              {user?.firstName + " " + user?.lastName || "No name"}
            </p>
            <span className="text-ascent-2">
              {user?.username || "No profession"}
            </span>
          </div>
        </Link>
        <div className="">
          {user?.token ? (
            <UpdateUser profileCard />
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
      <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
        <p className="text-lg text-ascent-1 font-semibold lowercase">
          {user?.friends} {t("Bạn bè")}
        </p>

        <span className="text-base text-blue">
          {user?.emailVerified ? "Verified account" : "Not verified"}
        </span>

        <div className="flex items-center justify-between">
          <span className="text-ascent-2">{t("Tham gia")}</span>
          <span className="text-ascent-1 text-base">
            {moment(user?.createdAt).fromNow() || "none"}
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 py-4 pb-6">
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
