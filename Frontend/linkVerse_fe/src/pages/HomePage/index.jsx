import {
  FriendCard,
  ProfileCard,
  PostCard,
  TopBar,
  GroupCard,
  FriendRequest,
  FriendSuggest,
  CreatePost,
  Welcome,
} from "~/components";
import { posts } from "~/assets/mockData/data";
import { BlankAvatar } from "~/assets/index";
import { useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((state) => state.user);

  return (
    <>
      <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
        <TopBar title={"Trang chủ"} />
        <Welcome />
        <div className="w-full flex gap-2 pb-10 lg:gap-4 h-full">
          {/* trai */}
          <div className="hidden w-1/3 md:mx-2 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            {user?.token && (
              <>
                <ProfileCard />
                <FriendCard />
                <GroupCard />
              </>
            )}
          </div>

          {/* giua */}
          <div className="flex-1 h-full bg-primary px-3 mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
            <div className="flex flex-col gap-6 ">
              <div className="w-full h-24 flex justify-center bg-primary rounded-lg overflow-x-auto overflow-y-hidden">
                {/* story */}
                {/* <div className="flex w-full p-3 justify-center items-center">
                  <div className="w-20 h-full flex justify-center relative mr-4">
                    <img
                      src={user?.profileUrl}
                      alt="User Image"
                      className="w-16 h-16 rounded-full object-cover shadow-newFeed border-1 border-borderNewFeed"
                    />
                    <BsFillPlusCircleFill
                      className="absolute bottom-0 right-0"
                      color="#0444A4"
                    />
                  </div>
                  <DragToScroll
                    className={"gap-5 flex justify-center items-center"}
                  >
                    {items.map((item, i) => (
                      <Story key={i} item={item} />
                    ))}
                  </DragToScroll>
                </div> */}
                <div className="w-full flex items-center justify-between gap-3 py-4 px-1 border-b border-[#66666645]">
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.avatar || BlankAvatar}
                      alt="User Image"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <span className="text-ascent-2 text-sm cursor-pointer">
                      Có gì mới?
                    </span>
                  </div>
                  <CreatePost homePage />
                </div>
              </div>

              {/* Post */}
              <div className="flex flex-col gap-6">
                {posts.map((post, i) => (
                  <PostCard
                    key={i}
                    post={post}
                    user={user}
                    deletePost={() => {}}
                    likePost={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* phai */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            {user?.token && (
              <>
                <FriendRequest />
                <FriendSuggest />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
