import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import CreateStory from "../CreateStory";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { StoryCard } from "..";
import * as StoryService from "~/services/StoryService";

const Story = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [page, setPage] = useState(1);

  const fetchAllStories = async ({ page, token }) => {
    setLoading(true);
    try {
      const res = await StoryService.getAllStory({ page, token });
      if (res?.code === 200) {
        setStories(res?.result?.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStories({ page, token });
  }, []);

  //refresh
  const hanldeSuccess = () => {
    fetchAllStories({ page, token });
  };

  return (
    <div className="w-full bg-primary shadow-newFeed rounded-2xl px-5 py-5 border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
      <div className="flex items-center justify-between text-xl text-ascent-1 pb-4 border-b border-[#66666645]">
        <span className="text-lg font-medium">Stories</span>
      </div>
      <CreateStory
        open={open}
        handleClose={handleClose}
        onSuccess={hanldeSuccess}
      />

      <div className="w-full items-center max-h-[360px] flex flex-col gap-4 pt-4 overflow-hidden">
        <div className="flex gap-4 w-full items-center cursor-pointer">
          <div
            onClick={() => setOpen(true)}
            className="w-12 h-12 rounded-full border-1 border-borderNewFeed opacity-100 hover:opacity-80 hover:scale-105 transition-transform shadow-2xl flex items-center justify-center"
          >
            <GoPlus size={30} color="#005DFF" />
          </div>
          <div className="flex-1">
            <p className="text-base font-medium text-ascent-1">
              Create Your Story
            </p>
            <span className="text-sm text-ascent-2">
              Click button beside to create yours.
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 overflow-y-auto">
          {stories.length > 0 &&
            stories.map((story) => <StoryCard key={story?.id} story={story} />)}
        </div>
      </div>
    </div>
  );
};

export default Story;
