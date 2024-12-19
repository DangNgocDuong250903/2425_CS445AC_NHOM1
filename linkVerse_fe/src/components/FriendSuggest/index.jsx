import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { BlankAvatar } from "~/assets";
import { useEffect, useState } from "react";
import * as FriendService from "~/services/FriendService";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const FriendSuggest = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state?.user);

  //fetch user suggest
  const fetchUsers = async (token) => {
    setLoading(true);
    const res = await FriendService.friendSuggesstion(token);
    if (res?.code === 1000) {
      setLoading(false);
      setUsers(res?.result);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(token);
  }, []);

  //request
  const handleRequest = async (id) => {
    const res = await FriendService.request({ id, token });
    return res;
  };

  return (
    <div className="w-full bg-primary shadow-newFeed rounded-xl border-x-[0.8px] border-y-[0.8px] border-borderNewFeed px-5 py-5">
      <div className="flex items-center justify-between text-lg pb-2 text-ascent-1 border-[#66666645] border-b">
        <span>{t("Bạn bè đề xuất")}</span>
      </div>
      <div className="w-full flex h-48 flex-col gap-4 pt-4 overflow-y-auto">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center">
            <CircularProgress />
          </div>
        ) : users.length > 0 ? (
          users
            ?.filter((item) => item?.userId !== user?.id)
            .map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <Link
                  to={"/profile/" + item?.userId}
                  className="flex w-full gap-4 items-center cursor-pointer"
                >
                  <img
                    src={item?.profileUrl ?? BlankAvatar}
                    alt={item?.firstName}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-base font-medium text-ascent-1">
                      {item.username ?? "No name"}
                    </p>
                    <span className="text-sm text-ascent-2">
                      {item?.firstName + " " + item?.lastName ?? "No name"}
                    </span>
                  </div>
                </Link>

                <div className="flex gap-1">
                  <button
                    className="text-sm text-white p-1 rounded"
                    onClick={() => handleRequest(item?.id)}
                  >
                    <BsPersonFillAdd size={20} className="text-[#0444A4]" />
                  </button>
                </div>
              </div>
            ))
        ) : (
          <span className="text-center">Không có bạn bè đề xuất nào</span>
        )}
      </div>
    </div>
  );
};

export default FriendSuggest;
