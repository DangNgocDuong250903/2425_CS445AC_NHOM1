import {
  FriendCard,
  ProfileCard,
  Button,
  PostCard,
  TopBar,
  GroupCard,
  FriendRequest,
  FriendSuggest,
  DialogCustom,
} from "~/components";
import { user, posts } from "~/assets/mockData/data";
import { useEffect, useState } from "react";
import { NoProfile } from "~/assets/index";
import { BsImages } from "react-icons/bs";
import { FaPhotoVideo } from "react-icons/fa";
import { PiGifThin } from "react-icons/pi";
import { MenuItem, Select, TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { getBase64 } from "~/utils";
import { IoCloseCircle } from "react-icons/io5";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [postState, setPostState] = useState("public");
  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    if (file) {
      getBase64(file)
        .then((result) => setImage(result))
        .catch((error) => console.error(error));
    }
  }, [file]);

  //delete
  const handleDeleteImage = () => {
    setFile(null);
    setImage("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  //submit
  const handleSubmitPost = () => {
    console.log({ status, image, postState });
  };

  const handleCloseDiaLogAdd = () => {
    setIsOpenDialogAdd(false);
  };

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
          <div className="bg-primary px-4 rounded-lg">
            {/* Header */}
            <div className="w-full flex items-center justify-between gap-3 py-4 border-b border-[#66666645]">
              <div className="flex items-center gap-4">
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt="User Image"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <span
                  onClick={() => setIsOpenDialogAdd(true)}
                  className="text-ascent-2 text-sm cursor-pointer hover:text-white"
                >
                  Có gì mới ?
                </span>
              </div>
              <Button
                title="Post"
                onClick={() => setIsOpenDialogAdd(true)}
                containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
              />
            </div>
          </div>

          {/* post */}
          {posts.map((post, i) => (
            <PostCard
              key={i}
              post={post}
              user={user}
              deletePost={() => {}}
              likePost={() => {}}
            />
          ))}
          <div className="flex w-full h-full items-center justify-center">
            <p className="text-lg text-ascent-2">No post available</p>
          </div>
        </div>

        {/* phai */}
        <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
          <FriendRequest />
          <FriendSuggest />
        </div>

        {/* post */}
        <DialogCustom
          isOpen={isOpenDialogAdd}
          theme={theme}
          handleCloseDiaLogAdd={handleCloseDiaLogAdd}
        >
          <div
            className={`w-full ${
              theme === "dark" ? "bg-[rgb(24,24,24)]" : "bg-white"
            } shadow-newFeed`}
          >
            {/* header */}
            <div className="w-full flex items-center justify-between gap-5 px-5 py-4">
              <button
                onClick={() => setIsOpenDialogAdd(false)}
                className={`text-base font-medium hover:text-neutral-500 text-primary ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Hủy
              </button>
              <span
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Bài viết mới
              </span>
              <div />
            </div>
            <div className="w-full border-t-[0.1px] border-borderNewFeed" />

            {/* body */}
            <div className=" w-full flex flex-col px-5 py-4 justify-center gap-y-2">
              {/* 1 */}
              <div className="flex gap-x-3">
                {/* 1 */}
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt="User Image"
                  className="w-14 h-14 rounded-full object-cover border-1 border-borderNewFeed shadow-newFeed"
                />
                {/* 2 */}
                <TextField
                  label="Có gì mới ?"
                  multiline
                  onChange={(e) => setStatus(e.target.value)}
                  maxRows={5}
                  variant="standard"
                  fullWidth
                  sx={{
                    "& .MuiInput-root": {
                      color: theme === "dark" ? "#fff" : "#000",
                      // Bottom border
                      "&:before": {
                        display: "none",
                      },
                      // Border on focus
                      "&:after": {
                        display: "none",
                      },
                      ":hover:not(.Mui-focused)": {
                        color: "",
                        "&:before": {
                          display: "none",
                        },
                      },
                    },
                    // Label
                    "& .MuiInputLabel-standard": {
                      color: "rgb(89, 91, 100)",
                      "&.Mui-focused": {
                        display: "none",
                      },
                    },
                  }}
                />
              </div>
              {/* 2 */}
              <div className="flex gap-x-10 items-center px-6">
                <div className="h-9 border-solid border-borderNewFeed border-[0.1px]" />
                {/* upload */}
                <div className="flex items-center justify-between py-4 gap-x-3">
                  <label
                    htmlFor="imgUpload"
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="imgUpload"
                      data-max-size="5120"
                      accept=".jpg, .png, .jpeg"
                    />
                    <BsImages style={{ width: "20px", height: "20px" }} />
                  </label>
                  <label
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                    htmlFor="videoUpload"
                  >
                    <input
                      type="file"
                      data-max-size="5120"
                      onChange={handleFileChange}
                      className="hidden"
                      id="videoUpload"
                      accept=".mp4, .wav"
                    />
                    <FaPhotoVideo style={{ width: "20px", height: "20px" }} />
                  </label>
                  <label
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                    htmlFor="vgifUpload"
                  >
                    <input
                      type="file"
                      data-max-size="5120"
                      onChange={handleFileChange}
                      className="hidden"
                      id="vgifUpload"
                      accept=".gif"
                    />
                    <PiGifThin style={{ width: "25px", height: "25px" }} />
                  </label>
                  {file && file?.size > 5120 * 1024 && (
                    <span className="text-xs text-red-600">
                      vui lòng tải &lt; file 5mb
                    </span>
                  )}
                </div>
              </div>
              {/* 3 */}
              <div>
                {image && file?.type?.includes("mp4") && (
                  <div className="relative">
                    <video
                      width="100%"
                      controls
                      className="rounded-xl border-1 border-borderNewFeed"
                    >
                      <source src={image} />
                    </video>
                    <IoCloseCircle
                      onClick={handleDeleteImage}
                      className="absolute top-0 right-0 m-2 w-7 h-7 fill-[#8D867F] cursor-pointer"
                    />
                  </div>
                )}

                {image &&
                  (file?.type.includes("jpeg") ||
                    file?.type.includes("png") ||
                    file?.type.includes("gif")) && (
                    <div className="w-full h-[300px] relative">
                      <img
                        src={image}
                        className="rounded-xl border-1 shadow-newFeed border-borderNewFeed"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IoCloseCircle
                        onClick={handleDeleteImage}
                        className="absolute top-0 right-0 m-2 w-7 h-7 fill-[#8D867F] cursor-pointer"
                      />
                    </div>
                  )}
              </div>
              {/* 4 */}
              <div className="w-full flex justify-between">
                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                  variant="standard"
                >
                  <Select
                    disableUnderline="true"
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={postState}
                    onChange={(e) => setPostState(e.target.value)}
                    sx={{
                      boxShadow: "none",
                      "& .MuiSelect-icon": {
                        display: "none",
                      },
                    }}
                  >
                    <MenuItem value={"public"}>
                      <span className="text-ascent-2">Công khai</span>
                    </MenuItem>
                    <MenuItem value={"private"}>
                      <span className="text-ascent-2">Riêng tư</span>
                    </MenuItem>
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  title="Đăng"
                  disable={status === null || !status.trim() ? true : false}
                  onClick={handleSubmitPost}
                  containerStyles="bg-bgColor px-5 py-1 rounded-xl border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed"
                />
              </div>
            </div>
          </div>
        </DialogCustom>
      </div>
    </div>
  );
};

export default HomePage;