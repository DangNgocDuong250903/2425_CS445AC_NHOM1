import { TopBar, PostCard, CreatePost, UpdateUser, Button } from "~/components";
import { useTranslation } from "react-i18next";
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
import { useParams } from "react-router-dom";
import useGetDetailUser from "~/hooks/useGetDetailUser";
import { useMutationHook } from "~/hooks/useMutationHook";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {
  const theme = useSelector((state) => state.theme.theme);
  const userState = useSelector((state) => state.user);
  const [value, setValue] = useState(0);
  const { id } = useParams();
  const { user, loading } = useGetDetailUser();

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

  //fetch my post
  // const [fetchingPosts, setFetchingPosts] = useState(true);
  // const [posts, setPosts] = useState([]);
  // useEffect(() => {
  //   const getPosts = async () => {
  //     if (!user) return;
  //     setFetchingPosts(true);
  //     try {
  //       const res = await PostService.getMyPosts(user?.token);
  //       console.log(res);
  //       setPosts(res?.result?.data);
  //     } catch (error) {
  //       setPosts([]);
  //     } finally {
  //       setFetchingPosts(false);
  //     }
  //   };
  //   getPosts();
  // }, [user?.token, setPosts, user]);

  const getMyPosts = async () => {
    const token = localStorage.getItem("token");
    const res = await PostService.getMyPosts(token);
    return res?.result?.data;
  };

  const queryPosts = useQuery({
    queryKey: ["posts"],
    queryFn: getMyPosts,
  });

  const { isLoading, data: posts } = queryPosts;

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
                  src={user?.avatar || BlankAvatar}
                  alt="avatar"
                  className="rounded-full object-cover w-20 h-20 bg-no-repeat shadow-newFeed"
                />
              </div>
              {/* 2 */}
              <div className="flex items-center">
                <p className="text-ascent-1">{user?.bio || "No storie"}</p>
              </div>
              {/* 3 */}
              <div className="flex justify-between items-center">
                <span>0 friends</span>
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
              ) : (
                <div className="w-full text-center items-center justify-center flex ">
                  <UpdateUser profile />
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
                      <Tab label="Trả lời" {...a11yProps(1)} />
                      <Tab label="Bài đăng lại" {...a11yProps(2)} />
                    </Tabs>
                  </Box>
                  {/* 1 */}
                  <CustomTabPanel value={value} index={0}>
                    <div className="w-full pb-10 h-full">
                      {/* header */}
                      <div className=" w-full flex items-center justify-between px-6 py-3 border-b">
                        <div className="flex items-center justify-center gap-4 ">
                          <img
                            src={user?.avatar || BlankAvatar}
                            alt="avatar"
                            className="rounded-full object-cover w-14 h-14 bg-no-repeat"
                          />
                          <span className="text-ascent-2 text-sm font-normal">
                            Có gì mới...
                          </span>
                        </div>
                        <CreatePost profilePage />
                      </div>
                      {/* posts */}
                      <div className="flex-1 bg-primary px-4 mx-2 lg:m-0 flex flex-col gap-6 overflow-y-auto  ">
                        {/* {!fetchingPosts && posts.length === 0 && (
                          <div className="w-full h-60 flex items-center justify-center">
                            <p className="text-lg text-ascent-2">
                              Không có bài viết nào
                            </p>
                          </div>
                        )}
                        {fetchingPosts && (
                          <div className="w-full h-60 flex items-center justify-center">
                            <CircularProgress />
                          </div>
                        )}

                        {posts.map((post, i) => (
                          <PostCard key={i} post={post} user={user} />
                        ))} */}

                        {!isLoading && posts.length === 0 && (
                          <div className="w-full h-60 flex items-center justify-center">
                            <p className="text-lg text-ascent-2">
                              Không có bài viết nào
                            </p>
                          </div>
                        )}
                        {isLoading && (
                          <div className="w-full h-60 flex items-center justify-center">
                            <CircularProgress />
                          </div>
                        )}

                        {posts &&
                          posts.length > 0 &&
                          posts.map((post, i) => (
                            <PostCard key={i} post={post} user={user} />
                          ))}
                      </div>
                    </div>
                  </CustomTabPanel>
                  {/* 2 */}
                  <CustomTabPanel value={value} index={1}>
                    <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto">
                      <div className="w-full h-60 flex items-center justify-center">
                        <p className="text-lg text-ascent-2">
                          Không có trả lời nào
                        </p>
                      </div>
                    </div>
                  </CustomTabPanel>
                  {/* 3 */}
                  <CustomTabPanel value={value} index={2}>
                    <div className="w-full h-60 flex items-center justify-center">
                      <p className="text-lg text-ascent-2">
                        Chưa có bài đăng lại nào
                      </p>
                    </div>
                  </CustomTabPanel>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreatePost buttonRight />
    </>
  );
};

export default ProfilePage;