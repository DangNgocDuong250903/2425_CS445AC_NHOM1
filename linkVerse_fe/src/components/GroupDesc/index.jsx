import { BlankAvatar, GroupAvatar } from "~/assets";

const GroupDesc = () => {
  return (
    <div className="w-full bg-primary flex flex-col gap-2 rounded-2xl p-8 shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
      <span className="text-lg font-semibold">Description</span>
      <span className="text-sm text-ascent-2 tracking-normal leading-6">
        Learn to create sequences that feel effortless yet empowering,
        nourishing yet energizing, creative yet logical. Invite your friends to
        experience the magic of intelligent sequences that allow the body to
        open up to the flow of Prana, life energy.
      </span>
      <div className="flex w-full justify-between items-start ">
        <div className="flex-1 flex gap-2 flex-col">
          <h3 className="text-sm font-bold ">Group size</h3>
          <p className="text-gray-500 text-sm">1,648 members</p>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-sm font-bold ">Admins</h3>
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
