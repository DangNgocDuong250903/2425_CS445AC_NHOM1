import { useSelector } from "react-redux";
import {
  TopBar,
  FriendRequest,
  FriendSuggest,
  Welcome,
  Story,
  Group,
} from "~/components";

const GroupPage = () => {
  const user = useSelector((state) => state?.user);
  const token = localStorage.getItem("token");

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title="Group" />
      <Welcome />
      <div className="w-full flex gap-2 pb-10 lg:gap-4 h-full">
        {/* Left */}
        <div className="hidden w-1/3 md:mx-2 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          {token && (
            <>
              <Group />
            </>
          )}
        </div>

        {/* Center */}
        <div className="flex-1 h-full bg-primary mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
          {/* header */}
          <div className="w-full h-72 bg-pink-50">
            <img
              src="https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/340745400_148080657961623_7995064463007965089_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=2285d6&_nc_eui2=AeFFKFNeQVy6y3DWyghR5zyvnd2tRiuvTiqd3a1GK69OKqgnyTFdaqVrgxgaZQWT7fuHwkmU_Slt_w_QqDa00C2A&_nc_ohc=2E2TPw9zcQMQ7kNvgFdzCtZ&_nc_zt=23&_nc_ht=scontent.fdad3-6.fna&_nc_gid=A9r9u1fplHxjYsnvL04CE6s&oh=00_AYA-UxqnFYlakdnZo5DTifYteiafkDmgwCnh86oZqdx1uA&oe=67735389"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right */}
        <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
          {token && (
            <>
              <Story />
              <FriendRequest />
              <FriendSuggest />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
