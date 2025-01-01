import { BlankAvatar } from "~/assets";

const GroupDesc = ({ groupDetail }) => {
  return (
    <div className="w-full bg-primary flex flex-col gap-2 rounded-2xl p-8 shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
      <span className="text-lg font-semibold text-ascent-1">Description</span>
      <span className="text-sm text-ascent-2 tracking-normal leading-6">
        {groupDetail?.description}
      </span>
      <div className="flex w-full justify-between items-start ">
        <div className="flex-1 flex gap-2 flex-col">
          <h3 className="text-sm font-bold text-ascent-1">Group size</h3>
          <p className="text-gray-500 text-sm">
            {groupDetail?.memberCount} members
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-sm font-bold text-ascent-1">Admins</h3>
          <div className="flex items-center space-x-2">
            <img
              src={BlankAvatar}
              alt="Admin 1"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDesc;
