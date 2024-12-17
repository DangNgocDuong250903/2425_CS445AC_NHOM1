import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { BlankAvatar } from "~/assets";
import { useEffect, useState } from "react";
import * as FriendService from "~/services/FriendService";
import * as UserService from "~/services/UserService";

const FriendSuggest = () => {
  const { t } = useTranslation();
  const [usersDetails, setUsersDetails] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchUsers = async () => {
    setLoading(true);
    const res = await FriendService.friendSuggesstion();
    if (res?.code === 1000) {
      setLoading(false);
      setUsers(res.result.map((user) => user.id));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUserDetails = async (users) => {
    setLoading(true);
    try {
      const userDetailsPromises = users.map(async (id) => {
        const token = localStorage.getItem("token");
        const res = await UserService.getDetailUserByUserId({ id, token });
        return res?.result;
      });

      const details = await Promise.all(userDetailsPromises);
      setUsersDetails((prevDetails) => [...prevDetails, ...details]);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      fetchUserDetails(users);
    }
  }, [users]);

  return (
    <div className="w-full bg-primary shadow-newFeed rounded-xl border-x-[0.8px] border-y-[0.8px] border-borderNewFeed px-5 py-5">
      <div className="flex items-center justify-between text-lg pb-2 text-ascent-1 border-[#66666645] border-b">
        <span>{t("Bạn bè đề xuất")}</span>
      </div>
      <div className="w-full flex flex-col gap-4 pt-4">
        {usersDetails?.map((user) => (
          <div key={user?.id} className="flex items-center justify-between">
            <Link
              to={"/" + user?.id}
              className="flex w-full gap-4 items-center cursor-pointer"
            >
              <img
                src={user?.profileUrl ?? BlankAvatar}
                alt={user?.firstName}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex-1">
                <p className="text-base font-medium text-ascent-1">
                  {user?.username}
                </p>
                <span className="text-sm text-ascent-2">
                  {user?.profession ?? "No profession"}
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
