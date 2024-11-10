import { Link } from "react-router-dom";
import { groups } from "~/assets/mockData/data";

const GroupCard = () => {
  return (
    <div>
      <div className="w-full bg-primary rounded-lg px-6 py-5 shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
        <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
          <span>Group</span>
          <span>{groups?.length}</span>
        </div>

        <div className="flex w-full flex-col gap-4 pt-4">
          {groups?.map((group) => (
            <Link
              key={group._id}
              to={"/group"}
              className="flex gap-4 items-center cursor-pointer"
            >
              <img
                src={group?.groupUrl}
                alt={group?.name}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex-1">
                <p className="text-base font-medium text-ascent-1">
                  {group?.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
