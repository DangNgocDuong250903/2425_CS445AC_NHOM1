import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { TopBar } from "~/components";

const SettingPage = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [value, setValue] = useState(0);

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
  return (
    <div className="w-full lg:px-10 pb-10 2xl:px-50 bg-bgColor h-screen overflow-hidden">
      <TopBar title={"Settings"} iconBack />
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
              <div className="w-full h-full"></div>
            </CustomTabPanel>
            {/* 2 */}
            <CustomTabPanel value={value} index={1}></CustomTabPanel>
            {/* 3 */}
            <CustomTabPanel value={value} index={2}></CustomTabPanel>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
