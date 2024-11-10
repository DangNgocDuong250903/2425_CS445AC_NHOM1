import { Link } from "react-router-dom";
import { suggests } from "~/assets/mockData/data";
import { BsPersonFillAdd } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const FriendSuggest = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-primary shadow-newFeed rounded-xl border-x-[0.8px] border-y-[0.8px] border-borderNewFeed px-5 py-5">
      <div className="flex items-center justify-between text-lg text-ascent-1 border-[#66666645] border-b">
        <span>{t("Bạn bè đề xuất")}</span>
      </div>
      <div className="w-full flex flex-col gap-4 pt-4">
        {suggests?.map((friend) => (
          <div key={friend?._id} className="flex items-center justify-between">
            <Link
              to={"/profile/" + friend?._id}
              className="flex w-full gap-4 items-center cursor-pointer"
            >
              <img
                src={friend?.profileUrl ?? NoProfile}
                alt={friend?.firstName}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex-1">
                <p className="text-base font-medium text-ascent-1">
                  {friend?.firstName} {friend?.lastName}
                </p>
                <span className="text-sm text-ascent-2">
                  {friend?.profession ?? "No profession"}
                </span>
              </div>
            </Link>

            <div className="flex gap-1">
              <button
                className="text-sm text-white p-1 rounded"
                onClick={() => {}}
              >
                <BsPersonFillAdd size={20} className="text-[#0444A4]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSuggest;
