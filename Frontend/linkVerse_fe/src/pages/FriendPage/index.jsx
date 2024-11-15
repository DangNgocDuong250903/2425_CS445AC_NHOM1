import {
  DialogCustom,
  TextInput,
  TopBar,
  Wrapper,
  FriendCard,
  ProfileCard,
  Button,
  PostCard,
  GroupCard,
  FriendRequest,
  FriendSuggest,
} from "~/components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaInstagram } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  Avatar,
  AvatarGroup,
  Divider,
  Fab,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { user, posts } from "~/assets/mockData/data";
import { NoProfile } from "~/assets/index";

import { BsImages } from "react-icons/bs";
import { FaPhotoVideo } from "react-icons/fa";
import { PiGifThin } from "react-icons/pi";
import { getBase64 } from "~/utils";
import { IoCloseCircle } from "react-icons/io5";

const FriendPage = () => {
  const { t } = useTranslation();
  const theme = useSelector((state) => state.theme.theme);
  const [value, setValue] = useState(0);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [postState, setPostState] = useState("public");
  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //tab
  const CustomTabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ height: "screen" }}>{children}</Box>}
      </div>
    );
  };
  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

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

  const handleCloseDiaLogEdit = () => {
    setIsOpenDialogEdit(false);
  };

  return (
    <>
      <Wrapper>
        <div className="w-full bg-bgColor h-screen overflow-hidden">
          <div className="flex-1 h-full flex flex-col ">
            <TopBar title={"Trang cá nhân"} />
            <div className="w-full h-full justify-center flex">
              <div className="max-w-[800px] h-full bg-primary mt-2 rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-y-auto">
                {/* 1 */}
                <div className="w-full h-auto flex flex-col p-10 pb-4 gap-y-5">
                  <div className="flex justify-between">
                    <span className="text-2xl font-semibold text-ascent-1">
                      dhtuan
                    </span>
                    <img
                      src="https://res.cloudinary.com/djs3wu5bg/image/upload/v1683874470/cld-sample.jpg"
                      alt="avatar"
                      className="rounded-full object-cover w-[84px] h-[84px] bg-no-repeat"
                    />
                  </div>
                  {/* 2 */}
                  <div className="flex items-center">
                    <p>{"No story"}</p>
                  </div>
                  {/* 3 */}
                  <div className="flex justify-between items-center">
                    <AvatarGroup total={27}>
                      <Avatar
                        alt="avatar"
                        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Mohamed_Salah_2018.jpg"
                      />
                      <Avatar
                        alt="avatar"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvZ5tlwcyX69noUottK0EDi6CZJS76ds-vqw&s"
                      />
                      <Avatar
                        alt="avatar"
                        src="https://kenh14cdn.com/2017/images685542-a-1489655177057.jpg"
                      />
                    </AvatarGroup>
                    <div className="flex gap-2">
                      <FaInstagram
                        color={theme === "dark" ? "#fff" : "#000"}
                        size="30px"
                      />
                      <CiFacebook
                        color={theme === "dark" ? "#fff" : "#000"}
                        size="30px"
                      />
                    </div>
                  </div>
                  {/* 4 */}
                  <div className="w-full text-center items-center justify-center flex gap-x-2">
                    <Button
                      onClick={() => setIsOpenDialogEdit(true)}
                      title="Bạn bè"
                      containerStyles={
                        "text-textStandard bg-bgStandard w-full py-2 border border-borderNewFeed rounded-xl flex items-center justify-center font-medium"
                      }
                    />
                    <Button
                      onClick={() => setIsOpenDialogEdit(true)}
                      title="Nhắn tin"
                      containerStyles={
                        "text-ascent-1 w-full py-2 border border-borderNewFeed rounded-xl flex items-center justify-center font-medium"
                      }
                    />
                  </div>
                </div>

                {/* 2 */}
                <div className="flex w-full h-auto items-center justify-center">
                  {/* tab */}
                  <div>
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          borderBottom: 1,
                          borderColor: "divider",
                          width: "800px",
                        }}
                      >
                        <Tabs
                          sx={{
                            color: theme === "dark" ? "#fff" : "#000",
                            "& .MuiTabs-indicator": {
                              backgroundColor:
                                theme === "dark" ? "#fff" : "#000",
                              height: "1px",
                            },
                          }}
                          indicatorColor="primary"
                          textColor="inherit"
                          value={value}
                          onChange={handleChange}
                          variant="fullWidth"
                          aria-label="basic tabs example"
                        >
                          <Tab label="Bài đăng" {...a11yProps(0)} />
                          <Tab label="Trả lời" {...a11yProps(1)} />
                          <Tab label="Bài đăng lại" {...a11yProps(2)} />
                        </Tabs>
                      </Box>
                      {/* 1 */}
                      <CustomTabPanel value={value} index={0}>
                        <div className="flex-1 h-full bg-primary px-4 mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto shadow-newFeed">
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
                        </div>
                      </CustomTabPanel>
                      {/* 2 */}
                      <CustomTabPanel value={value} index={1}>
                        <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto">
                          <h1>Chưa có bài đăng nào</h1>
                        </div>
                      </CustomTabPanel>
                      {/* 3 */}
                      <CustomTabPanel value={value} index={2}>
                        Item Three
                      </CustomTabPanel>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
            {/* Add post */}
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
                        <FaPhotoVideo
                          style={{ width: "20px", height: "20px" }}
                        />
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

        <div className="absolute bottom-5 right-5">
          <Fab
            color="primary"
            aria-label="add"
            variant="extended"
            sx={{
              zIndex: 10,
              "&.MuiFab-root": {
                backgroundColor: `${theme === "dark" ? "#fff" : "#000"}`,
              },
            }}
            onClick={() => setIsOpenDialogAdd(true)}
          >
            <AddIcon
              style={{ color: `${theme === "dark" ? "#000" : "#fff"}` }}
            />
          </Fab>
        </div>
      </Wrapper>
    </>
  );
};

export default FriendPage;
