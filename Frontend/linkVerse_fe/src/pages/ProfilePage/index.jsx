import {
  DialogCustom,
  TextInput,
  TopBar,
  Button,
  PostCard,
  DragToScroll,
  CreatePost,
} from "~/components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaInstagram } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  Avatar,
  AvatarGroup,
  CircularProgress,
  Divider,
  Fab,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import { posts } from "~/assets/mockData/data";
import { BsImages } from "react-icons/bs";
import { FaPhotoVideo } from "react-icons/fa";
import { PiGifThin } from "react-icons/pi";
import { getBase64 } from "~/utils";
import { IoCloseCircle } from "react-icons/io5";
import * as UserService from "~/services/UserService";
import * as PostService from "~/services/PostService";
import { BlankAvatar } from "~/assets";
import { ImUserPlus } from "react-icons/im";
import { useMutationHook } from "~/hooks/useMutationHook";

const ProfilePage = () => {
  const { t } = useTranslation();
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
  const [value, setValue] = useState(0);
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

  const handleCloseDiaLogEdit = () => {
    setIsOpenDialogEdit(false);
  };

  // edit profile
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setLastName(user?.lastName);
    setFirstName(user?.firstName);
    setAvatar(user?.avatar);
    setProfession(user?.profession);
    setAddress(user?.address);
    setBio(user?.bio);
    setEmail(user?.email);
  }, [user]);

  const handleChangeFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const handleChangeLastName = (e) => {
    setLastName(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeProfession = (e) => {
    setProfession(e.target.value);
  };

  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleChangeAvatar = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setAvatarFile(selectedFile);
    }
  };
  const handleChangeBio = (e) => {
    setBio(e.target.value);
  };

  useEffect(() => {
    if (avatarFile) {
      getBase64(avatarFile)
        .then((result) => setAvatar(result))
        .catch((error) => console.error(error));
    }
  }, [avatarFile]);

  const mutation = useMutationHook((data) => UserService.update(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      console.log("success");
    } else if (isError) {
      console.log("error");
    }
  }, [isSuccess, isError]);

  const handleSubmitChange = () => {
    const data = {
      token: user?.token,
      id: user?.id,
      lastName,
      firstName,
      avatar,
      email,
      profession,
      address,
      avatar,
      bio,
    };
    mutation.mutate(data);
  };

  return (
    <>
      <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
        <TopBar title={user?.username} iconBack />

        <div className="w-full h-full justify-center flex ">
          <div className="max-w-[680px] h-full bg-primary rounded-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-y-auto">
            {/* 1 */}
            <div className="w-full h-auto flex flex-col p-10 gap-y-5">
              {/* 1 */}
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-ascent-1">
                    {user?.firstName + user?.lastName || "No name"}
                  </span>
                  <span className="text-md font-normal text-ascent-1">
                    {user?.username || "No name"}
                  </span>
                </div>
                <img
                  src={avatar ? avatar : BlankAvatar}
                  alt="avatar"
                  className="rounded-full object-cover w-20 h-20 bg-no-repeat shadow-newFeed"
                />
              </div>
              {/* 2 */}
              <div className="flex items-center">
                <p className="text-ascent-1">{bio || "No storie"}</p>
              </div>
              {/* 3 */}
              {/* <div className="flex justify-between items-center">
                {user?.following.length > 0 ? (
                  <AvatarGroup total={user?.following.length}>
                    {user.following.map((item, i) => (
                      <Avatar
                        alt="avatar"
                        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Mohamed_Salah_2018.jpg"
                      />
                    ))}
                  </AvatarGroup>
                ) : (
                  <span>0 friends</span>
                )}
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
              </div> */}
              {/* 4 */}
              <div className="w-full text-center items-center justify-center flex ">
                <Button
                  onClick={() => setIsOpenDialogEdit(true)}
                  title={t("Chỉnh sửa trang cá nhân")}
                  containerStyles={
                    "text-ascent-1 w-full py-2 border border-borderNewFeed rounded-xl flex items-center justify-center font-medium"
                  }
                />
              </div>

              {/* <div className="w-full text-center items-center justify-center flex gap-x-2">
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
              </div> */}
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
                      width: "680px",
                    }}
                  >
                    <Tabs
                      sx={{
                        color: theme === "dark" ? "#fff" : "#000",
                        "& .MuiTabs-indicator": {
                          backgroundColor: theme === "dark" ? "#fff" : "#000",
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
                    <div className="w-full h-full">
                      {/* header */}
                      <div className=" w-full flex items-center justify-between px-6 py-3">
                        <div className="flex items-center justify-center gap-4">
                          <img
                            src="https://res.cloudinary.com/djs3wu5bg/image/upload/v1683874470/cld-sample.jpg"
                            alt="avatar"
                            className="rounded-full object-cover w-12 h-12 bg-no-repeat"
                          />
                          <span className="text-ascent-2 text-sm font-normal">
                            Có gì mới...
                          </span>
                        </div>
                        <CreatePost profilePage />
                      </div>
                      {/* posts */}
                      <div className="flex-1 h-full bg-primary px-4 mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto  border-1">
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

        {/* Edit */}
        <DialogCustom
          isOpen={isOpenDialogEdit}
          theme={theme}
          handleCloseDiaLogAdd={handleCloseDiaLogEdit}
        >
          <div
            className={`w-full ${
              theme === "dark" ? "bg-[rgb(24,24,24)]" : "bg-white"
            } shadow-newFeed`}
          >
            <div className="flex w-full flex-col px-8 py-3">
              <div className="flex items-center justify-between py-3">
                {/* name */}
                <div className="flex flex-col">
                  <h1 className="text-ascent-2 font-medium">Full name</h1>
                  <div className="flex">
                    <TextInput
                      onChange={handleChangeFirstName}
                      value={firstName}
                      styles="border-0 bg-transparent px-0 pl-0 text-ascent-2"
                      labelStyles="font-medium"
                    />
                    <TextInput
                      onChange={handleChangeLastName}
                      value={lastName}
                      styles="border-0 bg-transparent px-0 pl-0 text-ascent-2"
                      labelStyles="font-medium"
                    />
                  </div>
                </div>

                <div className="relative group w-14 h-14">
                  {avatar ? (
                    <div className="w-full h-full">
                      <img
                        src={avatar}
                        alt="avatar"
                        className="rounded-full relative object-cover bg-no-repeat w-full h-full"
                      />
                      <div className="flex items-center justify-center w-full h-full absolute top-0">
                        <label
                          htmlFor="imgUpload"
                          className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                        >
                          <input
                            type="file"
                            onChange={handleChangeAvatar}
                            className="hidden"
                            id="imgUpload"
                            data-max-size="5120"
                            accept=".jpg, .png, .jpeg"
                          />
                          <ImUserPlus
                            size={20}
                            className=" duration-300 transition-opacity opacity-0 hover:opacity-100 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#ccc] flex items-center justify-center cursor-pointer">
                      <label
                        htmlFor="imgUpload"
                        className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                      >
                        <input
                          type="file"
                          onChange={handleChangeAvatar}
                          className="hidden"
                          id="imgUpload"
                          data-max-size="5120"
                          accept=".jpg, .png, .jpeg"
                        />
                        <ImUserPlus size={20} />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <Divider sx={{ borderColor: "#ccc" }} />

              <div className="flex items-center justify-between py-3">
                <div className="flex flex-col">
                  <h1 className="text-ascent-2 font-medium">Tiểu sử</h1>
                  <TextField
                    value={bio}
                    placeholder="Viết tiểu sử"
                    onChange={handleChangeBio}
                    multiline
                    maxRows={5}
                    variant="standard"
                    fullWidth
                    sx={{
                      "& .MuiInput-root": {
                        color: theme === "dark" ? "#fff" : "#000",
                        "&:before": {
                          display: "none",
                        },
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
                      "& .MuiInputLabel-standard": {
                        color: "rgb(89, 91, 100)",
                        "&.Mui-focused": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <Divider sx={{ borderColor: "#ccc" }} />

              <div className="flex items-center w-full justify-between py-3">
                <div className="flex w-full flex-col">
                  <h1 className="text-ascent-2 font-medium">Email</h1>
                  <TextField
                    value={email}
                    onChange={handleChangeEmail}
                    multiline
                    maxRows={5}
                    variant="standard"
                    fullWidth
                    sx={{
                      "& .MuiInput-root": {
                        color: theme === "dark" ? "#fff" : "#000",
                        "&:before": {
                          display: "none",
                        },
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
                      "& .MuiInputLabel-standard": {
                        color: "rgb(89, 91, 100)",
                        "&.Mui-focused": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <Divider sx={{ borderColor: "#ccc" }} />

              <div className="flex items-center w-full justify-between py-3">
                <div className="flex w-full flex-col">
                  <h1 className="text-ascent-2 font-medium">User name</h1>
                  <TextField
                    // value={email}
                    // onChange={handleChangeEmail}
                    multiline
                    maxRows={5}
                    variant="standard"
                    fullWidth
                    sx={{
                      "& .MuiInput-root": {
                        color: theme === "dark" ? "#fff" : "#000",
                        "&:before": {
                          display: "none",
                        },
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
                      "& .MuiInputLabel-standard": {
                        color: "rgb(89, 91, 100)",
                        "&.Mui-focused": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <Divider sx={{ borderColor: "#ccc" }} />

              <div className="flex items-center w-full justify-between py-3">
                <div className="flex w-full flex-col">
                  <h1 className="text-ascent-2 font-medium">Address</h1>
                  <TextField
                    value={address}
                    placeholder="Thêm địa chỉ"
                    onChange={handleChangeAddress}
                    multiline
                    maxRows={5}
                    variant="standard"
                    fullWidth
                    sx={{
                      "& .MuiInput-root": {
                        color: theme === "dark" ? "#fff" : "#000",
                        "&:before": {
                          display: "none",
                        },
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
                      "& .MuiInputLabel-standard": {
                        color: "rgb(89, 91, 100)",
                        "&.Mui-focused": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <Divider sx={{ borderColor: "#ccc" }} />

              <div className="flex items-center   w-full justify-between py-3">
                <div className="flex w-full flex-col">
                  <h1 className="text-ascent-2 font-medium">Profession</h1>
                  <TextField
                    value={profession}
                    placeholder="Thêm công việc"
                    onChange={handleChangeProfession}
                    multiline
                    maxRows={5}
                    variant="standard"
                    fullWidth
                    sx={{
                      "& .MuiInput-root": {
                        color: theme === "dark" ? "#fff" : "#000",
                        "&:before": {
                          display: "none",
                        },
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
                      "& .MuiInputLabel-standard": {
                        color: "rgb(89, 91, 100)",
                        "&.Mui-focused": {
                          display: "none",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <Button
                title={"Xong"}
                onClick={handleSubmitChange}
                containerStyles="w-full bg-bgStandard flex items-center justify-center py-3 border-x-[0.8px] border-y-[0.8px] border-borderNewFeed rounded-xl font-medium text-white"
              />
            </div>
          </div>
        </DialogCustom>
      </div>
      <CreatePost buttonRight />
    </>
  );
};

export default ProfilePage;
