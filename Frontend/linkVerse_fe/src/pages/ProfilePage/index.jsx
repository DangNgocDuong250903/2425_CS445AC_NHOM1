import { Button, DialogCustom, TextInput, TopBar, Wrapper } from "~/components";
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
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { IoImagesOutline } from "react-icons/io5";
import { HiOutlineGif } from "react-icons/hi2";
import { MdOutlineVideoLibrary } from "react-icons/md";

const ProfilePage = () => {
  const { t } = useTranslation();
  const theming = useTheme();
  const theme = useSelector((state) => state.theme.theme);
  const [value, setValue] = useState(0);
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState(false);

  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
  const handleOpenModalAdd = () => {
    setIsOpenDialogAdd(true);
  };

  const handleOpenModalEdit = () => {
    setIsOpenDialogEdit(true);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
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
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [age, setAge] = useState("");

  const handleChangeStatus = (event) => {
    setAge(event.target.value);
  };

  return (
    <>
      <Wrapper>
        <div className="w-full bg-bgColor h-screen overflow-hidden">
          <TopBar title={"Trang cá nhân"} />

          <div className="w-full h-full justify-center flex">
            <div className="max-w-[800px] h-full bg-primary rounded-3xl shadow-newFeed border-x-[0.8px] border-y-[0.8px] border-borderNewFeed">
              {/* 1 */}
              <div className="w-full h-auto flex flex-col p-10 gap-y-5">
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
                {/* 3 */}
                <div className="w-full text-center items-center justify-center flex ">
                  <Button
                    onClick={handleOpenModalEdit}
                    title={t("Chỉnh sửa trang cá nhân")}
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
                        <div className=" w-full flex items-center justify-between px-6 py-4">
                          <div className="flex items-center justify-center gap-4">
                            <img
                              src="https://res.cloudinary.com/djs3wu5bg/image/upload/v1683874470/cld-sample.jpg"
                              alt="avatar"
                              className="rounded-full object-cover w-[50px] h-[50px] bg-no-repeat"
                            />
                            <span className="text-ascent-2 text-base font-light">
                              Có gì mới...
                            </span>
                          </div>
                          <Button
                            onClick={handleOpenModalAdd}
                            title="Đăng"
                            containerStyles="px-5 py-2 border-x-[0.8px] border-y-[0.8px] border-borderNewFeed rounded-xl text-ascent-1"
                          />
                        </div>
                        <div className="border-x-[0.5px] border-y-[0.5px] border-solid border-borderNewFeed" />
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
            title={"Test"}
            stylesContainer={{ borderRadius: "20px" }}
            styles={{ width: "600px", borderRadius: "20px" }}
          >
            {/* header */}
            <DialogTitle>
              <div className="w-full flex items-center justify-between gap-5">
                <button
                  onClick={() => setIsOpenDialogAdd(false)}
                  className="text-base font-medium"
                >
                  Hủy
                </button>
                <span className="text-lg font-semibold">Bài viết mới</span>
                <div />
              </div>
            </DialogTitle>
            {/* body */}
            <DialogContent dividers>
              <div className="w-full flex flex-col p-x-3 justify-center gap-y-3">
                {/* 1 */}
                <div className="flex gap-x-5">
                  {/* 1 */}
                  <img
                    src="https://res.cloudinary.com/djs3wu5bg/image/upload/v1683874470/cld-sample.jpg"
                    alt="avatar"
                    className="rounded-full object-cover w-[40px] h-[40px] bg-no-repeat"
                  />
                  {/* 2 */}
                  <div className="flex flex-col gap-1">
                    <span>tuan2.8</span>
                    <span>Có gì mới</span>
                  </div>
                </div>
                {/* 2 */}
                <div className="flex gap-x-5">
                  <div className="h-5 border-solid border-slate-300 border-[0.1px]" />
                  <div className="flex gap-2">
                    <IoImagesOutline />
                    <HiOutlineGif />
                    <MdOutlineVideoLibrary />
                  </div>
                </div>
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
                      value={"public"}
                      onChange={handleChangeStatus}
                      sx={{
                        boxShadow: "none",
                        "& .MuiSelect-icon": {
                          display: "none",
                        },
                      }}
                    >
                      <MenuItem value={"public"}>Công khai</MenuItem>
                      <MenuItem value={"private"}>Riêng tư</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    title={"Đăng"}
                    containerStyles="border-x-[0.8px] border-y-[0.8px] rounded-xl border-borderNewFeed shadow-newFeed text-ascent-1 px-4 py-2"
                  />
                </div>
              </div>
            </DialogContent>
          </DialogCustom>

          {/* Edit */}
          <DialogCustom
            isOpen={isOpenDialogEdit}
            title={"Test"}
            styles={{
              width: "500px",
              border: `1px solid ${
                theme === "dark"
                  ? theming.palette.borderDark
                  : theming.palette.borderLight
              }`,
              backgroundColor: `${
                theme === "dark" ? theming.palette.dark : theming.palette.light
              }`,
            }}
          >
            <DialogContent dividers>
              <div className="flex w-full flex-col p-3">
                <div
                  className="w-6 h-6 bg-primary flex items-center justify-center rounded-md hover:scale-110 cursor-pointer transition-transform"
                  onClick={() => setIsOpenDialogEdit(false)}
                >
                  <FaArrowLeft className="fill-black" />
                </div>
                <div className="flex items-center justify-between py-3">
                  <h1 className="text-white">dhtun</h1>
                  <img
                    src="https://res.cloudinary.com/djs3wu5bg/image/upload/v1683874470/cld-sample.jpg"
                    alt="avatar"
                    className="rounded-full object-cover bg-no-repeat w-16 h-16"
                  />
                </div>
                <Divider />
                <div className="flex flex-col py-3">
                  <TextInput
                    label="Nghề nghiệp"
                    labelStyles="text-ascent-1"
                    styles="w-full rounded-xl bg-primary"
                  />
                </div>
                <Divider />
                <Button
                  title={"Xong"}
                  containerStyles="w-full text-ascent-1 bg-bgColor flex items-center justify-center py-3 border-x-[0.8px] border-y-[0.8px] border-borderNewFeed rounded-xl font-medium text-ascent-1"
                />
              </div>
            </DialogContent>
          </DialogCustom>
        </div>
        <div className="absolute bottom-5 right-5">
          <Fab
            color="primary"
            aria-label="add"
            variant="extended"
            sx={{
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

export default ProfilePage;
