import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, CreatePost, DialogCustom, TopBar } from "~/components";
import { RxLockClosed } from "react-icons/rx";
import { RiEyeOffLine } from "react-icons/ri";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useLocation } from "react-router-dom";

const SettingPage = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [value, setValue] = useState(0);
  const user = useSelector((state) => state.user);
  const location = useLocation();

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

  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={"Settings"} iconBack />
      <CreatePost />
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
                        // checked={theme === "dark" ? true : false}
                        // onChange={handleToggle}
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
                        // checked={user?.}
                        // onChange={handleToggle}
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
                  className="w-full py-3 px-2 h-full flex justify-between items-center cursor-pointer"
                >
                  <h1 className="text-ascent-1">
                    Vô hiệu hóa hoặc xóa tài khoản
                  </h1>
                  <IoIosArrowForward size={20} className="cursor-pointer" />
                </div>
                <DialogCustom
                  isOpen={isOpenDelete}
                  handleCloseDiaLogAdd={hanleCloseDelete}
                >
                  <div className="w-full h-auto p-5 bg-primary flex flex-col">
                    {/* header */}
                    <div className="w-full flex font-bold items-center py-3 justify-center">
                      Vô hiệu hóa hoặc xóa
                    </div>
                    {/* body */}
                    <div className="h-full flex flex-col gap-5 w-full py-2">
                      <div className="w-full flex flex-col gap-2">
                        <h2 className="font-bold text-base">
                          Vô hiệu hóa trang cá nhân chỉ mang tính tạm thời
                        </h2>
                        <p className="text-sm text-ascent-2">
                          Trang cá nhân, nội dung, lượt thích và người theo dõi
                          trên LinkVerse của bạn sẽ không hiển thị với bất kỳ ai
                          cho đến khi bạn đăng nhập lại để kích hoạt trang cá
                          nhân
                        </p>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <h2 className="font-bold text-base">
                          Xóa trang cá nhân là mang tính vĩnh viễn
                        </h2>
                        <p className="text-sm text-ascent-2">
                          Trước khi bị gỡ vĩnh viễn, trang cá nhân, nội dung,
                          lượt thích và người theo dõi trên LinkVerse của bạn sẽ
                          ẩn trong 30 ngày.
                        </p>
                      </div>
                    </div>
                    {/* footer */}
                    <div className="w-full  flex flex-col gap-y-2  items-center justify-between">
                      <Button
                        title="Vô hiệu hóa tài khoản"
                        containerStyles="w-full text-white bg-bgStandard flex items-center border-1 justify-center py-3 rounded-2xl border-borderNewFeed border-1"
                      />
                      <Button
                        title="Xóa tài khoản"
                        containerStyles="border-borderNewFeed border-1 py-3 rounded-2xl text-red-600  bg-primary w-full flex items-center justify-center"
                      />
                    </div>
                  </div>
                </DialogCustom>
                {/* 2 */}
                <div className="w-full py-3 px-2 h-full flex justify-between items-center cursor-pointer">
                  <h1 className="text-ascent-1">Verify your email</h1>
                  <IoIosArrowForward size={20} className="cursor-pointer" />
                </div>
                {/* 3 */}
                <div className="w-full py-3 px-2 h-full flex justify-between items-center cursor-pointer">
                  <h1 className="text-ascent-1">Đã chặn</h1>
                  <IoIosArrowForward size={20} className="cursor-pointer" />
                </div>
              </div>
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
