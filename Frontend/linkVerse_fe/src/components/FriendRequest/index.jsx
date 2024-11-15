import { Link } from "react-router-dom";
import { requests } from "~/assets/mockData/data";
import { Button } from "..";
import { useTranslation } from "react-i18next";

const FriendRequest = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-primary shadow-newFeed rounded-xl px-6 py-5 border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
      <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>{t("Lời mời kết bạn")}</span>
        <span>{requests?.length}</span>
      </div>

      <div className="w-full flex flex-col gap-4 pt-4">
        {requests?.map(({ _id, requestFrom: from }) => (
          <div key={_id} className="flex items-center justify-between">
            <Link
              to={"/profile"}
              className="w-full flex gap-4 items-center cursor-pointer"
            >
              <img
                src={from?.profileUrl ?? NoProfile}
                alt={from?.firstName}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex-1 w-full">
                <p
                  id="text-ellipsis"
                  className="text-base font-medium text-ascent-1"
                >
                  {from?.firstName + " " + from?.lastName}
                </p>
                <span id="text-ellipsis" className="text-sm text-ascent-2">
                  {from?.profession ?? "No profession"}
                </span>
              </div>
            </Link>

            <div className="flex gap-1 w-full h-full items-center justify-end">
              <Button
                title={t("Chấp nhận")}
                containerStyles="bg-[#0444A4] text-xs border-borderNewFeed border text-white px-1.5 py-1 rounded-2xl"
              />
              <Button
                title={t("Từ chối")}
                containerStyles="bg-bgColor border border-borderNewFeed text-xs text-ascent-1 px-1.5 py-1 rounded-2xl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequest;
