import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import * as PostService from "~/services/PostService";
import { CircularProgress, Skeleton } from "@mui/material";
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
  Story,
} from "~/components";
import { BlankAvatar } from "~/assets/index";
import CreateStory from "~/components/CreateStory";
import AlertWelcome from "~/components/AlertWelcome";

const HomePage = () => {
  const user = useSelector((state) => state?.user);
  let sentiment = useSelector((state) => state?.post?.sentiment);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

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
        setPage(currentPage + 1);
        setHasMore(currentPage < totalPage);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sentiment, page, hasMore, isLoading]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 60;
    if (bottom) {
      fetchPosts();
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts();
  }, [sentiment]);

  const handleSuccess = () => {
    setPosts([]);
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={sentiment} selectPosts />
      <Welcome />
      <CreatePost buttonRight onSuccess={handleSuccess} />
      <div className="w-full flex gap-2 pb-10 lg:gap-4 h-full">
        {/* Left */}
        <div className="hidden w-1/3 md:mx-2 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          {user?.token && (
            <>
              <ProfileCard />
              <FriendCard />
              <GroupCard />
            </>
          )}
        </div>

        {/* Center */}
        <div
          onScroll={handleScroll}
          className="flex-1 h-full bg-primary px-3 mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed"
        >
          <div className="flex flex-col gap-6 ">
            {user?.token ? (
              <div className="w-full h-24 flex justify-center bg-primary rounded-lg overflow-x-auto overflow-y-hidden">
                {/* header */}
                <div className="w-full flex items-center justify-between gap-3 py-4 px-2 border-b border-[#66666645]">
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
                  <CreatePost homePage onSuccess={handleSuccess} />
                </div>
              </div>
            ) : (
              <div />
            )}
            {/* {user?.token && <Story />} */}

            {posts.length > 0 &&
              posts
                .filter((post) => post?.visibility === "PUBLIC")
                .map((post, i) => <PostCard key={i} post={post} />)}

            {isLoading && (
              <div className="w-full h-20 flex items-center justify-center">
                <CircularProgress />
              </div>
            )}
            {!hasMore && (
              <div className="flex w-full h-96 items-center justify-center">
                <p className="text-lg text-ascent-2">Không có bài viết nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
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
  );
};

export default HomePage;
