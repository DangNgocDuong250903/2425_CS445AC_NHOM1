import { CreatePost, PostCard, TopBar } from "~/components";
import { useParams } from "react-router-dom";
import * as PostService from "~/services/PostService";
import * as UserService from "~/services/UserService";
import { useQuery } from "@tanstack/react-query";
import CommentCard from "~/components/CommentCard";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Dropdown, Space } from "antd";
import { useTranslation } from "react-i18next";

const ReplyPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [selectedKey, setSelectedKey] = useState("0");
  const { t } = useTranslation();
  const [sortedComments, setSortedComments] = useState([]);

  const items = [
    {
      key: "0",
      label: t("Mới nhất"),
    },
    {
      key: "1",
      label: t("Cũ nhất"),
    },
    {
      key: "2",
      label: t("Nhiều like nhất"),
    },
    {
      key: "3",
      label: t("Nhiều unlike nhất"),
    },
  ];

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const getPost = async () => {
    const res = await PostService.getPostById({ id, token });
    return res?.result;
  };

  const queryPost = useQuery({
    queryKey: ["post"],
    queryFn: getPost,
  });

  const { isLoading, data: post, refetch: refetchPost } = queryPost;

  const fetchDetailUser = async ({ id, token }) => {
    const res = await UserService.getDetailUserByUserId({ id, token });
    setUser(res?.result);
  };

  useEffect(() => {
    fetchDetailUser({ id: post?.userId, token });
  }, []);

  useEffect(() => {
    if (post?.comments) {
      let sorted = [...post.comments];
      switch (selectedKey) {
        case "0":
          sorted.sort(
            (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
          );
          break;
        case "1":
          sorted.sort(
            (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
          );
          break;
        case "2":
          sorted.sort((a, b) => b.like - a.like);
          break;
        case "3":
          sorted.sort((a, b) => b.unlike - a.unlike);
          break;
        default:
          break;
      }
      setSortedComments(sorted);
    }
  }, [selectedKey, post?.comments]);

  const handleSuccess = () => {
    refetchPost();
  };

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={t("Trả lời")} iconBack />
      <CreatePost buttonRight />
      <div className="w-full flex justify-center gap-2 pb-10 lg:gap-4 h-full">
        {/* giua */}
        <div className="w-[680px] h-full bg-primary mx-2 pt-2 lg:m-0 flex flex-col gap-6 overflow-y-auto rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
          {/* Post */}
          <div className="px-4">
            <PostCard post={post} />
          </div>
          {/* sort */}
          <div className="w-full flex flex-col">
            <div className="px-6">
              <span className="font-semibold text-ascent-1">
                {t("Trả lời")}
              </span>
            </div>
            <div className="w-full flex gap-2 px-1 items-center">
              <div className="flex-1 border-t border-borderNewFeed"></div>
              <div className="flex-shrink-0">
                <span className="text-sm text-ascent-2">{t("Sắp xếp")}: </span>
                <Dropdown
                  className="cursor-pointer"
                  placement="bottomRight"
                  menu={{
                    items,
                    selectable: true,
                    onSelect: handleMenuClick,
                  }}
                >
                  <Space>
                    <span className="text-sm text-ascent-2">
                      {items[selectedKey].label}
                    </span>
                    <IoIosArrowDown size={18} className="text-ascent-1" />
                  </Space>
                </Dropdown>
              </div>
            </div>
          </div>
          {/* comment */}
          <div className="px-4">
            {sortedComments.map((comment, i) => (
              <CommentCard
                isShowImage
                key={i}
                comment={comment}
                postId={post?.id}
                onSuccess={handleSuccess}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyPage;
