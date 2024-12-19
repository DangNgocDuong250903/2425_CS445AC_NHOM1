import { CreatePost, PostCard, TopBar } from "~/components";
import { useParams } from "react-router-dom";
import * as PostService from "~/services/PostService";
import { useQuery } from "@tanstack/react-query";
import CommentCard from "~/components/CommentCard";

const ReplyPage = () => {
  const { id } = useParams();

  const getPost = async () => {
    const token = localStorage.getItem("token");
    const res = await PostService.getPostById({ id, token });
    return res?.result;
  };

  const queryPost = useQuery({
    queryKey: ["post"],
    queryFn: getPost,
  });

  const { isLoading, data: post } = queryPost;

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={"Comment"} iconBack />
      <CreatePost buttonRight />
      <div className="w-full flex justify-center gap-2 pb-10 lg:gap-4 h-full">
        {/* giua */}
        <div className="w-[680px] h-full bg-primary px-4 mx-2 pt-2 lg:m-0 flex flex-col gap-6 overflow-y-auto rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
          {/* Post */}
          <PostCard post={post} />
          {/* comment */}
          {post?.comments.map((comment, i) => (
            <CommentCard isShowImage key={i} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReplyPage;
