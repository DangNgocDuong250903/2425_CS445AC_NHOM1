import { Link } from "react-router-dom";
import { NoProfile } from "~/assets/index";
import { friends } from "~/assets/mockData/data";

const FriendCard = () => {
  return (
    <div>
      <div className="w-full bg-primary rounded-lg px-6 py-5 shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
        <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
          <span>Friends</span>
          <span>{friends?.length}</span>
        </div>

        <div className="flex w-full flex-col gap-4 pt-4">
          {friends?.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile"}
              className="flex gap-4 items-center cursor-pointer"
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendCard;