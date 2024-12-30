import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as PostService from "~/services/PostService";
import { CircularProgress } from "@mui/material";
import {
  FriendCard,
  ProfileCard,
  PostCard,
  TopBar,
  FriendRequest,
  FriendSuggest,
  CreatePost,
  Welcome,
  Story,
  Group,
} from "~/components";
import { BlankAvatar } from "~/assets/index";
import useGetBlockList from "~/hooks/useGetBlockList";

const HomePage = () => {
  const user = useSelector((state) => state?.user);
  let sentiment = useSelector((state) => state.post.sentiment);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { blocks, reload } = useGetBlockList();

  const fetchPosts = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const sentimentParam = sentiment.toUpperCase();
      let res;

      if (sentimentParam === "FOR YOU") {
        res = await PostService.getAllPosts(page);
      } else {
        res = await PostService.getPostsBySentiment({
          page,
          sentiment: sentimentParam,
          token,
        });
      }

      const { code, result } = res;
      if (code === 200 && result) {
        const { data: dataPost, currentPage, totalPage } = result;

        setPosts((prev) => [...prev, ...dataPost]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    fetchPosts();
  }, [sentiment]);

  const filteredPosts = posts.filter(
    (post) =>
      post?.visibility === "PUBLIC" &&
      !blocks.some((blockedUser) => blockedUser?.userId === post?.userId)
  );

  const handleSuccess = () => {
    setPosts([]);
    setPage(1);
    reload();
    fetchPosts();
  };

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={sentiment} selectPosts />
      <Welcome />
      <div className="w-full flex gap-2 pb-10 lg:gap-4 h-full">
        {/* Left */}
        <div className="hidden w-1/4 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          {user?.token && (
            <>
              <ProfileCard />
              <FriendCard />
              <Group />
            </>
          )}
        </div>

        {/* Center */}
        <div className="flex-1 h-full bg-primary px-3 mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
          <div className="flex h-full flex-col gap-6">
            {token ? (
              <div className="w-full flex items-center justify-between gap-3 py-4 px-2 border-b border-[#66666645]">
                <div className="flex items-center gap-4">
                  <img
                    src={user?.avatar ?? BlankAvatar}
                    alt="User Image"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <span className="text-ascent-2 text-sm cursor-pointer">
                    Có gì mới?
                  </span>
                </div>
                <CreatePost homePage onSuccess={handleSuccess} />
              </div>
            ) : (
              <div />
            )}

            {posts.length === 0 ? (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">Không có bài viết nào.</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">Không có bài viết nào.</p>
              </div>
            ) : (
              filteredPosts.map((post, i) => (
                <PostCard key={i} post={post} onSuccess={handleSuccess} />
              ))
            )}

            {isLoading && (
              <div className="w-full h-full flex items-center justify-center">
                <CircularProgress />
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="hidden w-1/4 h-full lg:flex flex-col gap-6 overflow-y-auto">
          {user?.token && (
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

export default HomePage;
