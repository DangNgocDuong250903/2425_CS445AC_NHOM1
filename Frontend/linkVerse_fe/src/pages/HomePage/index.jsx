import {
  FriendCard,
  ProfileCard,
  TextInput,
  Button,
  PostCard,
  TopBar,
  GroupCard,
  FriendRequest,
  FriendSuggest,
} from "~/components";
import { user, posts } from "~/assets/mockData/data";
import { useState } from "react";
import { NoProfile } from "~/assets/index";
import { BsImages } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { FaPhotoVideo } from "react-icons/fa";
import { PiGifThin } from "react-icons/pi";

const HomePage = () => {
  // const [friendRequest, setFriendRequest] = useState(requests);
  // const [suggestedFriends, setSuggestedFriends] = useState(suggest);
  // const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  // const [posting, setPosting] = useState(false);
  // const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handlePostSubmit = async (data) => {};

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={"Trang chủ"} />
      <div className="w-full flex gap-2 pb-10 lg:gap-4 h-full">
        {/* trai */}
        <div className="hidden w-1/3 md:mx-2 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <ProfileCard />
          <FriendCard />
          <GroupCard />
        </div>

        {/* giua */}
        <div className="flex-1 h-full bg-primary px-4 mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
          <form
            onSubmit={handleSubmit(handlePostSubmit)}
            className="bg-primary px-4 rounded-lg"
          >
            {/* Header */}
            <div className="w-full flex items-center gap-3 py-4 border-b border-[#66666645]">
              <img
                src={user?.profileUrl ?? NoProfile}
                alt="User Image"
                className="w-14 h-14 rounded-full object-cover"
              />
              <TextInput
                styles="w-full rounded-full py-4"
                placeholder="What's on your mind...."
                name="description"
                register={register("description", {
                  required: "Write something about post",
                })}
                error={errors.description ? errors.description.message : ""}
              />
            </div>
            {/* {errMsg?.message && (
              <span
                role="alert"
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )} */}

            <div className="flex items-center justify-between py-4">
              <label
                htmlFor="imgUpload"
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="imgUpload"
                  data-max-size="5120"
                  accept=".jpg, .png, .jpeg"
                />
                <BsImages />
                <span>Image</span>
              </label>

              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                htmlFor="videoUpload"
              >
                <input
                  type="file"
                  data-max-size="5120"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="videoUpload"
                  accept=".mp4, .wav"
                />
                <FaPhotoVideo />
                <span>Video</span>
              </label>

              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                htmlFor="vgifUpload"
              >
                <input
                  type="file"
                  data-max-size="5120"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="vgifUpload"
                  accept=".gif"
                />
                <PiGifThin />
                <span>Gif</span>
              </label>

              <Button
                type="submit"
                title="Post"
                containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
              />

              {/* <div>
                {posting ? (
                  <Loading />
                ) : (
                  <Button
                    type="submit"
                    title="Post"
                    containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                  />
                )}
              </div> */}
            </div>
          </form>

          {posts.map((post) => (
            <PostCard
              key={post?._id}
              post={post}
              user={user}
              deletePost={() => {}}
              likePost={() => {}}
            />
          ))}

          {/* {loading ? (
            <Loading />
          ) : posts?.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post?._id}
                post={post}
                user={user}
                deletePost={() => {}}
                likePost={() => {}}
              />
            ))
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">No post availabel</p>
            </div>
          )} */}
        </div>

        {/* phai */}
        <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
          <FriendRequest />
          <FriendSuggest />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
