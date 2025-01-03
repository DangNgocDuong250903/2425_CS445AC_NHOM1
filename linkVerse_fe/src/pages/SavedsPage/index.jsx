import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreatePost, TopBar } from "~/components";
import SavedCard from "~/components/SavedCard";
import * as PostService from "~/services/PostService";

const SavedsPage = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const { t } = useTranslation();

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
              <div className="flex text-ascent-1 flex-1 justify-center items-center w-full h-full">
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
