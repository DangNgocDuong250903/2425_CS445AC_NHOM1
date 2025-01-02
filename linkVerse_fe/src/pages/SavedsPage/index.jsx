import { CircularProgress, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FiBookmark } from "react-icons/fi";
import { useSelector } from "react-redux";
import { BlankAvatar } from "~/assets";
import { CreatePost, CustomizeMenu, PostCard, TopBar } from "~/components";
import SavedCard from "~/components/SavedCard";
import * as PostService from "~/services/PostService";

const SavedsPage = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [anchorEl, setAnchorEl] = useState(null);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const { t } = useTranslation();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchSaveds = async (token) => {
    setLoading(true);
    try {
      const res = await PostService.getSaveds(token);
      if (res?.code === 200) {
        setLoading(false);
        setPosts(res?.result?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaveds(token);
  }, []);

  const handleSuccess = () => {
    setPosts([]);
    fetchSaveds(token);
  };

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={t("Saved")} iconBack />
      <div className="w-full h-full flex justify-center">
        <div className="w-[680px] h-full px-3 py-2 mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto">
          <div className="flex h-full flex-col gap-6 ">
            {loading ? (
              <div className="flex flex-1 justify-center items-center w-full h-full">
                <CircularProgress />
              </div>
            ) : posts.length > 0 ? (
              posts.map((post, i) => {
                return (
                  <SavedCard key={i} post={post} onSuccess={handleSuccess} />
                );
              })
            ) : (
              <div className="flex flex-1 justify-center items-center w-full h-full">
                {t("Chưa bài viết nào được lưu")}
              </div>
            )}
          </div>
        </div>
      </div>
      <CreatePost buttonRight />
    </div>
  );
};

export default SavedsPage;
// #F2F4F7
