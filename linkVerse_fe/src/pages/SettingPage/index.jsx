import { Box, CircularProgress, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alerts,
  Button,
  CreatePost,
  DialogCustom,
  TextInput,
  TopBar,
} from "~/components";
import { RxLockClosed } from "react-icons/rx";
import { RiEyeOffLine } from "react-icons/ri";
import { FaArrowUpRightFromSquare, FaCircleExclamation } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import * as UserService from "~/services/UserService";
import { updateStatus } from "~/redux/Slices/userSlice";
import { useMutationHook } from "~/hooks/useMutationHook";
import useGetBlockList from "~/hooks/useGetBlockList";
import { BlankAvatar } from "~/assets";
import { FaArrowLeft } from "react-icons/fa";
import { useForm } from "react-hook-form";

const SettingPage = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [value, setValue] = useState(0);
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [icon, setIcon] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openBlockList, setOpenBlockList] = useState(false);
  const [loadingUnblock, setLoadingUnblock] = useState(false);
  const [loadingBlockList, setLoadingBlockList] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [valueInput, setValueInput] = useState(false);

  const handleChangeValue = (e) => {
    setValueInput(e.target.value);
  };

  const handleClose = () => setOpen(false);
  const handleCloseBlockList = () => setOpenBlockList(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  //delete account
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const hanleCloseDelete = () => {
    setIsOpenDelete(false);
  };

  //change status
  const handleToggle = async () => {
    try {
      const newStatus = user?.status === "ONLINE" ? "OFFLINE" : "ONLINE";
      const res = await UserService.updateStatus({ status: newStatus, token });
      if (res?.code === 1000) {
        dispatch(updateStatus(res?.result?.status));
      } else {
        setMessage("Something went wrong!");
        setType("error");
        setOpen(true);
      }
    } catch (error) {
      setMessage("Something went wrong!");
      setType("error");
      setOpen(true);
    } finally {
      setOpen(false);
    }
  };

  //verify email
  const mutation = useMutationHook((data) => UserService.verifyEmail(data));
  const { isPending, isSuccess, isError } = mutation;
  const handleCloseDialog = () => setOpenDialog(false);
  const handleSendMailVerify = () => {
    mutation.mutate(user?.email);
  };

  //block list
  const handleOpenBlockList = () => {
    setOpenBlockList(true);
  };

  //fetch block list
  const fetchBlockList = async (token) => {
    setLoadingBlockList(true);
    try {
      const res = await UserService.blockList(token);
      if (res?.length > 0) {
        setBlocks(res);
      }
    } catch (error) {
      console.error("Error fetching friends details:", error);
    } finally {
      setLoadingBlockList(false);
    }
  };

  useEffect(() => {
    fetchBlockList(token);
  }, [openBlockList]);

  //unBlock
  const handleUnblock = async (id) => {
    setLoadingUnblock(true);
    try {
      const res = await UserService.unBlock({ id, token });
      if (res?.status === "NONE") {
        setBlocks([]);
        fetchBlockList(token);
      }
    } catch (error) {
    } finally {
      setLoadingUnblock(false);
    }
  };

  const [step, setStep] = useState(1);
  const handleDeleteClick = () => setStep(2);
  const handleBackClick = () => setStep(1);

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={"Settings"} iconBack />
      <CreatePost />
      <Alerts
        message={message}
        type={type}
        icon={icon}
        open={open}
        handleClose={handleClose}
        position={{ vertical: "bottom", horizontal: "center" }}
        duration={3000}
      />
      <div className="w-full h-full flex justify-center">
        <div className="w-[680px] flex flex-col h-full bg-primary p-5 rounded-tl-3xl rounded-tr-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed overflow-y-auto">
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
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
                <Tab label="Quyền riêng tư" {...a11yProps(0)} />
                <Tab label="Tài khoản" {...a11yProps(1)} />
                <Tab label="Trợ giúp" {...a11yProps(2)} />
              </Tabs>
            </Box>
            {/* 1 */}
            <CustomTabPanel value={value} index={0}>
              <div className="w-full h-ful gap-y-3 py-5 flex-col flex justify-center items-center">
                {/* 1 */}
                <div className="w-full py-3 px-2 h-full flex justify-between items-center">
                  <div className="flex items-center gap-x-2">
                    <RxLockClosed size={20} />
                    <h1 className="text-ascent-1">Trang cá nhân riêng tư</h1>
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        // checked={}
                        // onChange={}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0444A4] hover:peer-checked:bg-[#0444A4]"></div>
                    </label>
                  </div>
                </div>

                {/* 2 */}
                <div className="w-full py-3 px-2 h-full flex justify-between items-center">
                  <div className="flex items-center gap-x-2">
                    <RiEyeOffLine size={20} />
                    <h1 className="text-ascent-1">Trạng thái hoạt động</h1>
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user?.status === "ONLINE" ? true : false}
                        onChange={handleToggle}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0444A4] hover:peer-checked:bg-[#0444A4]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            {/* 2 */}
            <CustomTabPanel value={value} index={1}>
              <div className="w-full h-ful gap-y-3 py-5 flex-col flex justify-center items-center">
                {/* 1 */}
                <div
                  onClick={() => setIsOpenDelete(true)}
                  className="w-full py-2 px-4 h-full flex justify-between items-center cursor-pointer"
                >
                  <h1 className="text-ascent-1">
                    Vô hiệu hóa hoặc xóa tài khoản
                  </h1>
                  <IoIosArrowForward size={20} className="cursor-pointer" />
                </div>

                <DialogCustom
                  isOpen={isOpenDelete}
                  width={step === 2 ? "400px" : "548px"}
                  handleCloseDiaLogAdd={hanleCloseDelete}
                >
                  <div className="w-full h-auto p-4 bg-primary flex flex-col">
                    {step === 1 && (
                      <>
                        <div className="w-full flex font-semibold items-center py-2 justify-center">
                          Vô hiệu hóa hoặc xóa
                        </div>
                        <div className="h-full flex flex-col gap-5 w-full py-2">
                          <div className="w-full flex py-2 flex-col gap-2">
                            <span className="font-semibold text-sm">
                              Vô hiệu hóa trang cá nhân chỉ mang tính tạm thời
                            </span>
                            <p className="text-sm text-ascent-2">
                              Trang cá nhân, nội dung, lượt thích và người theo
                              dõi trên LinkVerse của bạn sẽ không hiển thị với
                              bất kỳ ai cho đến khi bạn đăng nhập lại để kích
                              hoạt trang cá nhân
                            </p>
                          </div>
                          <div className="w-full flex py-2 flex-col gap-2">
                            <h2 className="font-semibold text-sm">
                              Xóa trang cá nhân là mang tính vĩnh viễn
                            </h2>
                            <p className="text-sm text-ascent-2">
                              Trước khi bị gỡ vĩnh viễn, trang cá nhân, nội
                              dung, lượt thích và người theo dõi trên LinkVerse
                              của bạn sẽ ẩn trong 30 ngày.
                            </p>
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-y-2 items-center justify-between">
                          <Button
                            title="Vô hiệu hóa tài khoản"
                            containerStyles="w-full text-white bg-bgStandard flex items-center border-1 justify-center py-3 rounded-2xl border-borderNewFeed border-1"
                          />
                          <Button
                            title="Xóa tài khoản"
                            containerStyles="border-borderNewFeed border-1 py-3 rounded-2xl text-red-600 bg-primary w-full flex items-center justify-center"
                            onClick={handleDeleteClick}
                          />
                        </div>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <div className="flex w-full items-center justify-between">
                          <div
                            className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center hover:scale-110 cursor-pointer transition-transform"
                            // onClick={() => navigate("/")}
                          >
                            <FaArrowLeft color="#fff" />
                          </div>
                          <p className="text-ascent-1 text-lg font-semibold">
                            Deleting account
                          </p>
                          <div />
                        </div>

                        <span className="text-sm text-ascent-2">
                          Verify your email
                        </span>
                        <div className="flex flex-col">
                          <span>To confirm this, type "DELETE"</span>
                          <div className="flex">
                            <input
                              className="px-3 py-2 border rounded-lg"
                              value={valueInput === "DELETE"}
                              onChange={handleChangeValue}
                            />
                            <Button
                              containerStyles="px-3 py-2 "
                              title="Xac nhan"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </DialogCustom>
                {/* 2 */}
                <div
                  onClick={() => setOpenDialog(true)}
                  className="w-full py-3  px-2 h-full flex justify-between items-center cursor-pointer"
                >
                  <h1 className="text-ascent-1">Verify your email</h1>
                  <IoIosArrowForward size={20} className="cursor-pointer" />
                </div>
                <DialogCustom
                  isOpen={openDialog}
                  width="600px"
                  handleCloseDiaLogAdd={handleCloseDialog}
                >
                  <div className="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
                    <h3 className="text-2xl">
                      Thanks for signing up for LinkVerse
                    </h3>
                    <div className="flex justify-center">
                      <svg
                        className="w-32 h-32"
                        viewBox="0 0 50 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M42.2285 0C40.3812 4.92e-05 38.7061 0.741775 37.4785 1.94141H18.4102C18.3787 1.94141 18.3493 1.94909 18.3184 1.95117C18.1298 1.94236 17.9327 1.91521 17.6641 1.97656C17.5086 2.01156 17.3074 2.10876 17.1797 2.28516C17.052 2.46106 17.0156 2.66417 17.0156 2.85547V3.20898C17.0101 3.25944 17 3.30955 17 3.36133V4.11719L17.0156 4.12695V19.9551C17.0156 20.1414 17.0477 20.3306 17.1484 20.502C17.2492 20.6734 17.4182 20.7996 17.5723 20.8613C17.8803 20.9847 18.1304 20.9551 18.3789 20.9551H45.6523C46.0097 20.9551 46.3585 20.8387 46.6152 20.5977C46.872 20.3565 47.0156 19.9997 47.0156 19.627V11.6309C48.2595 10.3975 49.0312 8.69075 49.0312 6.80469C49.0313 3.05339 45.9798 0 42.2285 0ZM42.2285 1C45.4394 1 48.0313 3.59389 48.0312 6.80469C48.0312 10.0156 45.4394 12.6074 42.2285 12.6074C39.0177 12.6074 36.4238 10.0156 36.4238 6.80469C36.4238 3.59389 39.0176 1.0001 42.2285 1ZM42.2285 1.91992C39.5376 1.91992 37.3457 4.11389 37.3457 6.80469C37.3457 9.49559 39.5377 11.6874 42.2285 11.6875C44.9194 11.6875 47.1113 9.49559 47.1113 6.80469C47.1114 4.11389 44.9194 1.91992 42.2285 1.91992ZM42.2285 2.91992C44.379 2.91992 46.1113 4.65429 46.1113 6.80469C46.1113 8.95509 44.3789 10.6875 42.2285 10.6875C40.0781 10.6874 38.3457 8.95509 38.3457 6.80469C38.3457 4.65429 40.0781 2.91992 42.2285 2.91992ZM18.3496 2.95312C18.3775 2.9531 18.3771 2.95312 18.4102 2.95312H36.625C35.8693 4.04923 35.4238 5.37598 35.4238 6.80469C35.4238 8.17802 35.8362 9.45503 36.5391 10.5254L32.2715 13.6211L32.2539 13.6387C32.1417 13.7387 32.0985 13.7439 32.0605 13.7441C32.0226 13.7443 31.9342 13.7282 31.7715 13.6094L18.043 3.61328L18.0156 3.5957V3.27734C18.0495 3.10235 18.1792 2.97857 18.3496 2.95312ZM44.6426 4.63672C44.513 4.63827 44.389 4.69009 44.2969 4.78125L41.1934 7.77148L40.1602 6.77539C40.1131 6.72883 40.0574 6.69206 39.996 6.66721C39.9347 6.64236 39.8691 6.62993 39.8029 6.63064C39.7368 6.63134 39.6714 6.64517 39.6106 6.67132C39.5498 6.69747 39.4949 6.73542 39.4489 6.78298C39.4028 6.83053 39.3667 6.88674 39.3426 6.94835C39.3185 7.00996 39.3068 7.07575 39.3083 7.1419C39.3098 7.20805 39.3244 7.27324 39.3513 7.33371C39.3782 7.39417 39.4167 7.4487 39.4648 7.49414L40.8457 8.82617C40.9389 8.91579 41.0631 8.96586 41.1924 8.96586C41.3217 8.96586 41.4459 8.91579 41.5391 8.82617L44.9902 5.5C45.0632 5.43099 45.1137 5.34161 45.1351 5.2435C45.1565 5.14539 45.1479 5.04311 45.1104 4.94995C45.0729 4.8568 45.0082 4.7771 44.9248 4.72124C44.8413 4.66537 44.743 4.63592 44.6426 4.63672V4.63672ZM18.0156 4.83203L31.1836 14.418C31.4501 14.6121 31.7434 14.7459 32.0664 14.7441C32.3894 14.7441 32.6876 14.5913 32.918 14.3867L37.1523 11.3164C38.3998 12.7173 40.2098 13.6074 42.2285 13.6074C43.6296 13.6074 44.9323 13.18 46.0156 12.4512V19.627C46.0156 19.7646 45.9788 19.8212 45.9297 19.8672C45.8806 19.9132 45.7986 19.9551 45.6523 19.9551H18.3789C18.1652 19.9551 18.0614 19.9415 18.0156 19.9375V4.83203Z"
                          fill="url(#paint0_linear)"
                        />
                        <rect
                          y="5"
                          width="15"
                          height="2"
                          rx="1"
                          fill="#3BB54A"
                        />
                        <rect
                          y="11"
                          width="15"
                          height="2"
                          rx="1"
                          fill="#3BB54A"
                        />
                        <rect
                          y="8"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#3BB54A"
                        />
                        <rect
                          y="15"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#3BB54A"
                        />
                        <rect
                          x="8"
                          y="8"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#3BB54A"
                        />
                        <rect
                          x="8"
                          y="15"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#3BB54A"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear"
                            x1="16.9996"
                            y1="10.4791"
                            x2="47.0156"
                            y2="10.4791"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#009217" />
                            <stop offset="1" stop-color="#00FF29" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <p>
                      We're happy you're here. Let's get your email address
                      verified:
                    </p>
                    <div className="mt-4">
                      <div className="relative flex items-center justify-center">
                        <button
                          disabled={isPending}
                          onClick={handleSendMailVerify}
                          className={`${isSuccess && "hidden"} px-4 ${
                            isPending && "hidden"
                          } py-2 text-primary hover:opacity-90 hover:scale-105 transition-transform bg-[#0444A4] rounded-xl`}
                        >
                          Click to Verify Email
                        </button>
                        {isPending && (
                          <div className="flex items-center justify-center py-4">
                            <CircularProgress
                              className="absolute top-2 left-1/2 -right-10 "
                              size={25}
                            />
                          </div>
                        )}
                        {isSuccess && (
                          <span className="text-center text-[#0444A4]">
                            Check your email to verify
                          </span>
                        )}
                      </div>
                      <p className="mt-4 text-sm">
                        If you’re having trouble clicking the "Verify Email
                        Address" button, copy and paste the URL below into your
                        web browser:
                        <a href="" className="text-blue-600">
                          http://localhost:8082/notification/email/send-verification?email=
                          {user?.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </DialogCustom>

                {/* 3 */}
                <div
                  onClick={handleOpenBlockList}
                  className="w-full py-3 px-2 h-full flex justify-between items-center cursor-pointer"
                >
                  <h1 className="text-ascent-1">Đã chặn</h1>
                  <IoIosArrowForward size={20} className="cursor-pointer" />
                </div>
              </div>
              <DialogCustom
                isOpen={openBlockList}
                handleCloseDiaLogAdd={handleCloseBlockList}
              >
                <div className="w-full flex items-center justify-center flex-col">
                  <div className="w-full py-5 px-5 flex items-center justify-center border-b">
                    <span className="font-bold text-ascent-1 text-center">
                      Block lists
                    </span>
                  </div>

                  <div
                    className={`w-full overflow-x-hidden ${
                      isExpanded ? "max-h-full" : "max-h-96"
                    } overflow-y-auto`}
                  >
                    {loadingBlockList ? (
                      <div className="flex items-center justify-center py-5">
                        <CircularProgress size={30} />
                      </div>
                    ) : blocks.length > 0 ? (
                      blocks.map((block) => (
                        <div
                          key={block?.userId}
                          className="w-full py-6 px-5 flex items-center justify-between border-b cursor-pointer hover:bg-[#F3F8FE]"
                        >
                          <div className="flex items-center gap-x-5">
                            <img
                              src={block?.imageUrl ?? BlankAvatar}
                              alt="avatar"
                              className="w-10 h-10 object-cover bg-no-repeat"
                            />
                            <span className="font-semibold text-ascent-1">
                              {block?.username}
                            </span>
                          </div>
                          <div className="relative">
                            <Button
                              title="Bỏ chặn"
                              disable={loadingUnblock}
                              onClick={() => handleUnblock(block?.userId)}
                              containerStyles="border-1 rounded-xl hover:bg-[#FAFAFA] px-3 py-2 text-ascent-1 text-sm"
                            />
                            {loadingUnblock && (
                              <CircularProgress
                                size={18}
                                className="relative right-1/2 top-2"
                              />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-5">
                        <span className="text-ascent-1 text-center text-sm">
                          Chưa có ai trong danh sách chặn
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className="w-full py-5 hover:bg-[#F3F8FE] cursor-pointer px-4 flex border-t items-center justify-center text-blue text-sm font-semibold"
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    {isExpanded ? "View less" : "View all"}
                  </div>
                </div>
              </DialogCustom>
            </CustomTabPanel>
            {/* 3 */}
            <CustomTabPanel value={value} index={2}>
              <div className="w-full h-ful gap-y-5 py-5 flex-col flex justify-center items-center">
                {/* 1 */}
                <a
                  href="https://vietnam.un.org/vi"
                  target="_blank"
                  className="w-full py-3 px-2 h-full flex justify-between items-center"
                >
                  <h1 className="text-ascent-1">Trung tâm trợ giúp</h1>
                  <FaArrowUpRightFromSquare size={20} />
                </a>

                {/* 2 */}
                <a
                  href="https://vietnam.un.org/vi"
                  target="_blank"
                  className="w-full py-3 px-2 h-full flex justify-between items-center"
                >
                  <h1 className="text-ascent-1">
                    Chính sách và quyền riêng tư của LinkVerse
                  </h1>
                  <FaArrowUpRightFromSquare size={20} />
                </a>
                {/* 3 */}
                <a
                  href="https://vietnam.un.org/vi"
                  target="_blank"
                  className="w-full py-3 px-2 h-full flex justify-between items-center"
                >
                  <h1 className="text-ascent-1">
                    Điều khoản sử dụng của LinkVerse
                  </h1>
                  <FaArrowUpRightFromSquare size={20} />
                </a>
                {/* 4 */}
                <a
                  href="https://vietnam.un.org/vi"
                  target="_blank"
                  className="w-full py-3 px-2 h-full flex justify-between items-center"
                >
                  <h1 className="text-ascent-1">Chính sách cookies</h1>
                  <FaArrowUpRightFromSquare size={20} />
                </a>
              </div>
            </CustomTabPanel>
          </Box>
        </div>
      </div>
      <CreatePost buttonRight />
    </div>
  );
};

export default SettingPage;
