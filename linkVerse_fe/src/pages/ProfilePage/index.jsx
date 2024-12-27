import {
  TopBar,
  PostCard,
  CreatePost,
  UpdateUser,
  Button,
  Alerts,
} from "~/components";
import { useSelector } from "react-redux";
import { FaInstagram } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { BlankAvatar } from "~/assets";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import * as PostService from "~/services/PostService";
import useGetDetailUser from "~/hooks/useGetDetailUser";
import * as UserService from "~/services/UserService";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import useGetMyFriend from "~/hooks/useGetMyFriend";
import useGetFriendRequest from "~/hooks/useGetFriendRequest";
import * as FriendService from "~/services/FriendService";

const ProfilePage = () => {
  const theme = useSelector((state) => state.theme.theme);
  const userState = useSelector((state) => state.user);
  const [value, setValue] = useState(0);
  const userPrimary = useSelector((state) => state.user);
  // const { user, loading, reload: fetchUser } = useGetDetailUser();
  const token = localStorage.getItem("token");
  const [isUnfriend, setIsUnFriend] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [typeMessage, setTypeMessage] = useState("");
  const [message, setMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [loadingUpdateAvatar, setLoadingUpdateAvatar] = useState(false);
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const { friends } = useGetMyFriend();
  const { request } = useGetFriendRequest();
  const [user, setUser] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setOpenMessage(false);
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

  //fetch post
  const fetchMyPosts = async ({ id, token, page }) => {
    setLoadingPost(true);
    try {
      const res = await PostService.getPostsById({ id, token, page });
      if (res?.code === 200) {
        setPosts(res?.result?.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPost(false);
    }
  };

  useEffect(() => {
    fetchMyPosts({ id, token, page });
  }, []);

  //fetch detail user
  const fetchDetailUser = async ({ id, token }) => {
    try {
      const res = await UserService.getDetailUserByUserId({ id, token });
      if (res?.code === 1000) {
        setUser(res?.result);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchDetailUser({ id, token });
  }, []);

  const handleSuccess = () => {
    setPosts([]);
    fetchDetailUser({ id, token });
    fetchMyPosts({ id, token, page });
  };

  //change avatar
  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];

    setLoadingUpdateAvatar(true);
    try {
      const res = await UserService.setAvatar({ file, token });
      if (res) {
        handleSuccess();
      }
      setTypeMessage("success");
      setMessage(res);
      setOpenMessage(true);
    } catch (error) {
      setTypeMessage("error");
      setMessage("Something went wrong!");
      setOpenMessage(true);
    } finally {
      setLoadingUpdateAvatar(false);
    }
  };

  //unfriend
  const handleUnfriend = async (id) => {
    try {
      const res = await FriendService.unfriend({ id, token });
      if (res) {
        setIsUnFriend(true);
        setMessage("Unfriend successful");
        setTypeMessage("success");
      }
    } catch (error) {
      setMessage("User not existing!");
      setTypeMessage("error");
    } finally {
      setOpenMessage(true);
    }
  };

  //request

  return (
    <>
      <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
        <TopBar title={user?.username} iconBack />
        <Alerts
          handleClose={handleClose}
          position={{ vertical: "bottom", horizontal: "center" }}
          open={openMessage}
          message={message}
          type={typeMessage}
          duration={2000}
        />

        <div className="w-full h-full justify-center flex ">
          <div className="max-w-[680px] h-full bg-primary rounded-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-y-auto">
            {/* 1 */}
            <div className="w-full h-auto flex flex-col p-10 gap-y-5">
              {/* 1 */}
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-ascent-1">
                    {user?.firstName + " " + user?.lastName || "No name"}
                  </span>
                  <span className="text-md font-normal text-ascent-1">
                    {user?.username || "No name"}
                  </span>
                </div>

                {userPrimary?.id === user?.id ? (
                  <div className="relative">
                    <img
                      src={user?.imageUrl ?? BlankAvatar}
                      alt="avatar"
                      className="rounded-full relative object-cover bg-no-repeat w-20 h-20"
                    />
                    {loadingUpdateAvatar && (
                      <CircularProgress
                        size={22}
                        className="absolute top-8 right-7"
                      />
                    )}
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
                        <BsFillPlusCircleFill
                          size={20}
                          className="absolute right-1 bottom-1 border-2 rounded-full cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <img
                    src={user?.imageUrl || BlankAvatar}
                    alt="avatar"
                    className="rounded-full object-cover w-20 h-20 bg-no-repeat shadow-newFeed"
                  />
                )}
              </div>
              {/* 2 */}
              <div className="flex items-center">
                <p className="text-ascent-1">{user?.bio || "No storie"}</p>
              </div>
              {/* 3 */}
              <div className="flex justify-between items-center">
                <span>{userState.friends} friends</span>
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

              {userState?.id !== user?.id ? (
                <div className="w-full text-center items-center justify-center flex gap-x-2">
                  {friends?.find((friend) => friend?.userId === user?.id) ? (
                    <>
                      {isUnfriend ? (
                        <Button
                          onClick={() => setIsOpenDialogEdit(true)}
                          title="Kết bạn"
                          containerStyles={
                            "text-textStandard bg-bgStandard w-full py-2 border border-borderNewFeed rounded-xl flex items-center justify-center font-medium"
                          }
                        />
                      ) : (
                        <Button
                          onClick={() => handleUnfriend(user?.id)}
                          title="Hủy kết bạn"
                          containerStyles={
                            "text-textStandard bg-bgStandard w-full py-2 border border-borderNewFeed rounded-xl flex items-center justify-center font-medium"
                          }
                        />
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsOpenDialogEdit(true)}
                      title="Kết bạn"
                      containerStyles={
                        "text-textStandard bg-bgStandard w-full py-2 border border-borderNewFeed rounded-xl flex items-center justify-center font-medium"
                      }
                    />
                  )}

                  <Button
                    onClick={() => setIsOpenDialogEdit(true)}
                    title="Nhắn tin"
                    containerStyles={
                      "text-ascent-1 w-full py-2 border border-borderNewFeed rounded-xl flex items-center justify-center font-medium"
                    }
                  />
                </div>
              ) : (
                <div className="w-full text-center items-center justify-center flex ">
                  <UpdateUser profile onSuccess={handleSuccess} />
                </div>
              )}
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
                      <Tab label="Bài viết chia sẻ" {...a11yProps(1)} />
                      <Tab label="Lịch sử" {...a11yProps(2)} />
                    </Tabs>
                  </Box>
                  {/* 1 */}
                  <CustomTabPanel value={value} index={0}>
                    <div className="w-full pb-10 h-full">
                      {/* header */}
                      <div className=" w-full flex items-center justify-between px-6 py-3 border-b">
                        <div className="flex items-center justify-center gap-4 ">
                          <img
                            src={user?.imageUrl || BlankAvatar}
                            alt="avatar"
                            className="rounded-full object-cover w-14 h-14 bg-no-repeat"
                          />
                          <span className="text-ascent-2 text-sm font-normal">
                            Có gì mới...
                          </span>
                        </div>
                        <CreatePost profilePage onSuccess={handleSuccess} />
                      </div>
                      {/* posts */}
                      <div className="flex-1 bg-primary px-4 mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto  ">
                        {!loadingPost && posts.length === 0 && (
                          <div className="w-full h-60 flex items-center justify-center">
                            <p className="text-lg text-ascent-2">
                              Không có bài viết nào
                            </p>
                          </div>
                        )}
                        {loadingPost && (
                          <div className="w-full h-60 flex items-center justify-center">
                            <CircularProgress />
                          </div>
                        )}

                        {posts &&
                          posts.length > 0 &&
                          posts.map((post, i) => (
                            <PostCard
                              fetchPosts={handleSuccess}
                              key={i}
                              post={post}
                              user={user}
                            />
                          ))}
                      </div>
                    </div>
                  </CustomTabPanel>
                  {/* 2 */}
                  <CustomTabPanel value={value} index={1}>
                    <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto">
                      <div className="w-full h-60 flex items-center justify-center">
                        <p className="text-lg text-ascent-2">
                          Chưa chia sẻ bài nào
                        </p>
                      </div>
                    </div>
                  </CustomTabPanel>
                  {/* 3 */}
                  <CustomTabPanel value={value} index={2}>
                    <div className="w-full h-60 flex items-center justify-center">
                      <p className="text-lg text-ascent-2">
                        Chưa có lịch sử bài viết
                      </p>
                    </div>
                  </CustomTabPanel>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreatePost buttonRight onSuccess={handleSuccess} />
    </>
  );
};

export default ProfilePage;
