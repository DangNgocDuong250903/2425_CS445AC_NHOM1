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
import { FaUserCheck } from "react-icons/fa";

const FriendSuggest = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state?.user);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("success");
  const { friends } = useGetMyFriend();
  const [sendStatus, setSendStatus] = useState({});

  // Close message
  const handleClose = () => setOpen(false);

  // Fetch user suggestions
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await FriendService.friendSuggesstion(token);
      if (res?.code === 1000 && res?.result.length > 0) {
        setUsers(res?.result);
      }
    } catch (error) {
      console.error("Error fetching friend suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRequest = async (id) => {
    try {
      setSendStatus((prev) => ({ ...prev, [id]: true }));
      const res = await FriendService.request({ id, token });
      console.log(res);
      if (res?.status === "PENDING") {
        fetchUsers();
        // setMessage("Đã gửi lời mời kết bạn");
        // setType(res?.code === 9999 ? "error" : "success");
        // setOpen(true);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      setMessage("Không thể gửi lời mời kết bạn");
      setType("error");
      setOpen(true);
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
        ) : users.length > 0 ? (
          users
            ?.filter(
              (item) =>
                item?.userId !== user?.id &&
                !friends.some((friend) => friend.userId === item.userId)
            )
            .map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <Link
                  to={"/profile/" + item?.userId}
                  className="flex w-full gap-4 items-center cursor-pointer"
                >
                  <img
                    src={item?.imageUrl ?? BlankAvatar}
                    alt={item?.firstName}
                    className="w-10 h-10 object-cover rounded-full"
                  />
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
                  {sendStatus[item?.userId] ? (
                    <button className="text-sm text-white p-1 rounded">
                      <FaUserCheck size={20} className="text-[#0444A4]" />
                    </button>
                  ) : (
                    <button
                      className="text-sm text-white p-1 rounded"
                      onClick={() => handleRequest(item?.userId)}
                    >
                      <BsPersonFillAdd size={20} className="text-[#0444A4]" />
                    </button>
                  )}
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
