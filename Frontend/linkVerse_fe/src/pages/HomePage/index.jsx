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
import { posts } from "~/assets/mockData/data";
import { useEffect, useState } from "react";
import { BlankAvatar } from "~/assets/index";
import { BsImages } from "react-icons/bs";
import { FaPhotoVideo } from "react-icons/fa";
import { PiGifThin } from "react-icons/pi";
import { MenuItem, Select, TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { getBase64 } from "~/utils";
import { IoCloseCircle } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as PostService from "~/services/PostService";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState("");
  const [text, setText] = useState("");
  const user = useSelector((state) => state.user);
  const [status, setStatus] = useState("public");
  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    if (file) {
      getBase64(file)
        .then((result) => setImg(result))
        .catch((error) => console.error(error));
    }
  }, [file]);

  //delete
  const handleDeleteImg = () => {
    setFile(null);
    setImg("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  //create post
  const mutation = useMutationHook((newPost) => {
    PostService.createPost(newPost);
  });

  const { data: dataCreatedPost, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      console.log(dataCreatedPost);
    } else if (isError) {
      console.log("error");
    }
  }, [isSuccess]);
  //submit
  const handleSubmitPost = () => {
    const newPost = { postedBy: user.id, text, img, status };
    mutation.mutate(newPost);
  };

  const handleCloseDiaLogAdd = () => {
    setIsOpenDialogAdd(false);
  };

  //welcome
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("access_token");
    if (!isLoggedIn) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
        <TopBar title={"Trang chủ"} />
        <div className="w-full flex gap-2 pb-10 lg:gap-4 h-full">
          {/* trai */}
          <div className="hidden w-1/3 md:mx-2 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            {user?.access_token && (
              <div>
                <ProfileCard />
                <FriendCard />
                <GroupCard />
              </div>
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
                    <span
                      onClick={() => setIsOpenDialogAdd(true)}
                      className="text-ascent-2 text-sm cursor-pointer opacity-100  hover:opacity-[0.1] "
                    >
                      Có gì mới?
                    </span>
                  </div>
                  <Button
                    title="Post"
                    onClick={() => setIsOpenDialogAdd(true)}
                    containerStyles="bg-[#0444a4] text-white py-2 px-6 rounded-xl font-medium text-sm  border-borderNewFeed shadow-newFeed hover:scale-105 transition-transform"
                  />
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
            {user?.access_token && (
              <div>
                <FriendRequest />
                <FriendSuggest />
              </div>
            )}
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
                  className={`text-ascent-1 font-medium hover:text-neutral-500 ${
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
                    src={user?.profileUrl ?? BlankAvatar}
                    alt="User Image"
                    className="w-14 h-14 rounded-full object-cover shadow-newFeed"
                  />
                  {/* 2 */}
                  <TextField
                    label="Có gì mới ?"
                    multiline
                    onChange={(e) => setText(e.target.value)}
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
                  {img && file?.type?.includes("mp4") && (
                    <div className="relative">
                      <video
                        width="100%"
                        controls
                        className="rounded-xl border-1 border-borderNewFeed"
                      >
                        <source src={img} />
                      </video>
                      <IoCloseCircle
                        onClick={handleDeleteImg}
                        className="absolute top-0 right-0 m-2 w-7 h-7 fill-[#8D867F] cursor-pointer"
                      />
                    </div>
                  )}

                  {img &&
                    (file?.type.includes("jpeg") ||
                      file?.type.includes("png") ||
                      file?.type.includes("gif")) && (
                      <div className="w-full h-[300px] relative">
                        <img
                          src={img}
                          className="rounded-xl border-1 shadow-newFeed border-borderNewFeed"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IoCloseCircle
                          onClick={handleDeleteImg}
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
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      sx={{
                        boxShadow: "none",
                        "& .MuiSelect-icon": {
                          display: "none",
                        },
                      }}
                    >
                      <MenuItem value={"public"}>
                        <span className="text-ascent-2 opacity-100">
                          Công khai
                        </span>
                      </MenuItem>
                      <MenuItem value={"private"}>
                        <span className="text-ascent-2">Riêng tư</span>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    type="submit"
                    title="Đăng"
                    disable={text === null || !text.trim() ? true : false}
                    onClick={handleSubmitPost}
                    containerStyles="bg-bgColor px-5 py-1 rounded-xl text-ascent-2 border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed hover:bg-[#ccc]"
                  />
                </div>
              </div>
            </div>
          </DialogCustom>

          {/* modal welcome */}
          <DialogCustom
            isOpen={showModal}
            handleCloseDiaLogAdd={handleCloseModal}
          >
            <div className="w-full px-5 py-16 text-center gap-y-7 flex-col rounded-2xl flex items-center justify-center">
              <div>
                <h1 className="text-ascent-1 px-3 tracking-tight text-3xl font-extrabold">
                  Welcome to LinkVerse
                </h1>
                <h1 className="text-ascent-1 px-3 tracking-tight text-3xl font-extrabold">
                  Your Social Universe Awaits!
                </h1>
              </div>
              <div>
                <p className="text-center px-8">
                  Join LinkVerse today to connect, share, and explore endless
                  possibilities with your friends and the community.
                </p>
                <span>Log in now and be part of the conversation!</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/login")}
                class="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-x-2 justify-center dark:focus:ring-[#2557D6]/50 me-2 mb-2"
              >
                <img src="/logoHeader.svg" alt="logo" width={20} height={20} />
                Continue with LinkVerse
              </button>
            </div>
          </DialogCustom>
        </div>
      </div>
    </>
  );
};

export default HomePage;
