// FriendCard.js
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { BlankAvatar } from "~/assets/index";
import useGetMyFriend from "~/hooks/useGetMyFriend";
import { updateFriends } from "~/redux/Slices/userSlice";
import * as FriendService from "~/services/FriendService";

const FriendCard = () => {
  const { friends, loading } = useGetMyFriend();

  return (
    <div className="w-full bg-primary rounded-2xl px-6 py-5 shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
      <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Friends</span>
        <span>{friends?.length}</span>
      </div>

      <div className="flex items-center w-full flex-col gap-4 pt-4">
        {loading ? (
          <CircularProgress size={30} />
        ) : friends?.length > 0 ? (
          friends?.map((friend) => (
            <Link
              key={friend.id}
              to={"/profile/" + friend?.userId}
              className="flex gap-4 w-full items-center cursor-pointer"
            >
              <img
                src={friend?.imageUrl ?? BlankAvatar}
                alt={friend?.firstName}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex-1">
                <p className="text-base font-medium text-ascent-1">
                  {friend?.firstName} {friend?.lastName}
                </p>
                <span className="text-sm text-ascent-2">
                  {friend?.username ?? "No profession"}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <span>Chưa có bạn nào</span>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
