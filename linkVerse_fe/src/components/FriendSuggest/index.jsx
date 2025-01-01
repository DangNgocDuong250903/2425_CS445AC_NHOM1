import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { BlankAvatar } from "~/assets";
import { useEffect, useState } from "react";
import * as FriendService from "~/services/FriendService";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Alerts } from "..";
import useGetMyFriend from "~/hooks/useGetMyFriend";
import { FaUserClock } from "react-icons/fa6";
import useGetBlockList from "~/hooks/useGetBlockList";
import useGetFriendSuggest from "~/hooks/useGetFriendSuggest";

const FriendSuggest = () => {
  const { t } = useTranslation();
  const { users, loading } = useGetFriendSuggest();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state?.user);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("success");
  const { friends } = useGetMyFriend();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const { blocks } = useGetBlockList();

  const handleClose = () => setOpen(false);

  // request send
  const fetchRequestSend = async () => {
    try {
      const res = await FriendService.getRequestSend(token);
      if (res && res?.length > 0) {
        setRequests(res);
      }
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  };

  useEffect(() => {
    fetchRequestSend();
  }, []);

  // request
  const handleRequest = async (id) => {
    try {
      setPendingUsers((prev) => [...prev, id]);
      const res = await FriendService.request({ id, token });
      if (res?.status === "PENDING") {
        setRequests((prev) => [...prev, { userId: id }]);
      }
    } catch (error) {
      setMessage("Something went wrong!");
      setType("error");
      setOpen(true);
    } finally {
      setPendingUsers((prev) => prev.filter((userId) => userId !== id));
    }
  };

  return (
    <div className="w-full bg-primary shadow-newFeed rounded-2xl border-x-[0.8px] border-y-[0.8px] border-borderNewFeed px-5 py-5">
      <Alerts
        message={message}
        type={type}
        open={open}
        handleClose={handleClose}
        position={{ vertical: "bottom", horizontal: "center" }}
        duration={1000}
      />
      <div className="flex items-center justify-between text-lg pb-2 text-ascent-1 border-[#66666645] border-b">
        <span className="text-xl font-medium">{t("Bạn bè đề xuất")}</span>
      </div>
      <div className="w-full flex max-h-48 flex-col gap-4 pt-4 overflow-y-auto">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          (() => {
            const filteredUsers = users?.filter(
              (item) =>
                item?.userId !== user?.id &&
                !friends.some((friend) => friend.userId === item?.userId) &&
                !blocks.some(
                  (blockedUser) => blockedUser?.userId === item?.userId
                )
            );

            if (filteredUsers.length > 0) {
              return filteredUsers.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Link
                    to={"/profile/" + item?.userId}
                    className="flex w-full gap-4 items-center cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={item?.imageUrl ?? BlankAvatar}
                        alt={item?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      {item?.status === "ONLINE" ? (
                        <div className="absolute right-0 top-7 w-3 h-3 bg-[#53C259] rounded-full border-2 border-primary" />
                      ) : (
                        <div className="absolute right-0 top-7 w-2 h-2 bg-[#ccc] rounded-full border-2 border-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-medium text-ascent-1">
                        {item?.firstName + " " + item?.lastName ?? "No name"}
                      </p>
                      <span className="text-sm text-ascent-2">
                        {item.username ?? "No name"}
                      </span>
                    </div>
                  </Link>
                  <div className="flex gap-1">
                    {pendingUsers.includes(item.userId) ||
                    requests.some(
                      (request) => request?.userId === item?.userId
                    ) ? (
                      <FaUserClock size={20} className="text-bluePrimary" />
                    ) : (
                      <button
                        className="text-sm text-white p-1 rounded"
                        onClick={() => handleRequest(item?.userId)}
                      >
                        <BsPersonFillAdd
                          size={20}
                          className="text-bluePrimary"
                        />
                      </button>
                    )}
                  </div>
                </div>
              ));
            } else {
              return (
                <span className="text-center text-ascent-1">
                  Không có bạn bè đề xuất nào
                </span>
              );
            }
          })()
        )}
      </div>
    </div>
  );
};

export default FriendSuggest;
