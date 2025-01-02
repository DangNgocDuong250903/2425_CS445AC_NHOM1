import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alerts, Button, DialogCustom } from "..";
import { BlankAvatar } from "~/assets";
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { BsImages } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { FaPhotoVideo } from "react-icons/fa";
import { PiGifThin } from "react-icons/pi";
import { IoCloseCircle } from "react-icons/io5";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as PostService from "~/services/PostService";
import * as GroupService from "~/services/GroupService";
import { useTranslation } from "react-i18next";

const CreatePost = ({
  buttonRight,
  profilePage,
  homePage,
  onSuccess,
  group,
  groupId,
}) => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [postState, setPostState] = useState("PUBLIC");
  const [type, setType] = useState("");
  const { t } = useTranslation();

  const handleClose = () => {
    handleClear();
    setOpen(false);
  };

  const handleClear = () => {
    setStatus("");
    setFiles([]);
  };

  const handleChangeStatus = useCallback((e) => {
    setStatus(e.target.value);
  }, []);

  // delete
  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const mutation = useMutationHook(({ data, token }) =>
    PostService.createPost({ data, token })
  );
  const { data, isPending, isError, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess) {
      if (data?.code === 200) {
        handleClear();
        setOpen(false);
        setType("success");
        setMessage("Create post success!");
        setShowMessage(true);
        onSuccess();
      } else if (data?.code === 400) {
        setType("error");
        setMessage(data?.message);
        setShowMessage(true);
        handleClear();
        setOpen(false);
      }
    } else if (isError) {
      setMessage("Something went wrong!");
    }
  }, [isSuccess, isError]);

  const handleSubmitPost = () => {
    const request = { content: status, visibility: postState };
    const data = { request, files: files };
    const token = localStorage.getItem("token");
    mutation.mutate({ data, token });
  };

  //group
  const mutationGroup = useMutationHook(({ data, token }) =>
    GroupService.createPost({ data, token })
  );
  const {
    data: dataGroup,
    isPending: isPendingGroup,
    isError: isErrorGroup,
    isSuccess: isSuccessGroup,
  } = mutationGroup;

  useEffect(() => {
    if (isSuccessGroup) {
      if (dataGroup?.code === 200) {
        handleClear();
        setOpen(false);
        setType("success");
        setMessage("Create post success!");
        setShowMessage(true);
        // onSuccess();
      } else if (dataGroup?.code === 400) {
        setType("error");
        setMessage(dataGroup?.message);
        setShowMessage(true);
        handleClear();
        setOpen(false);
      }
    } else if (isErrorGroup) {
      setMessage("Something went wrong!");
    }
  }, [isSuccessGroup, isErrorGroup]);

  const handleSubmitPostGroup = () => {
    const request = { content: status, groupId: groupId };
    const data = { request, files: files };
    const token = localStorage.getItem("token");
    mutationGroup.mutate({ data, token });
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <>
      {buttonRight && (
        <div className="absolute bottom-5 right-5">
          <div
            onClick={() => setOpen(user?.token ? true : false)}
            className="bg-primary w-[70px] h-[70px]  border-1 border-borderNewFeed shadow-2xl hover:scale-105 active:scale-90 transition-transform flex items-center justify-center rounded-3xl cursor-pointer"
          >
            <IoIosAdd className="text-bgStandard" size={35} />
          </div>
        </div>
      )}
      {profilePage && (
        <Button
          onClick={() => setOpen(true)}
          title={t("Đăng")}
          containerStyles="px-4 py-2 hover:scale-105 active:scale-90 transition-transform border-x-[0.8px] border-y-[0.8px] border-borderNewFeed rounded-xl text-ascent-1"
        />
      )}
      {homePage && (
        <Button
          title={t("Đăng")}
          onClick={() => setOpen(true)}
          containerStyles="bg-bluePrimary text-white py-2 px-6 rounded-xl font-medium text-sm  border-borderNewFeed shadow-newFeed hover:scale-105 active:scale-90 transition-transform"
        />
      )}
      {group && (
        <Button
          title={t("Đăng")}
          onClick={() => setOpen(true)}
          containerStyles="bg-bluePrimary text-white py-2 px-6 rounded-xl font-medium text-sm  border-borderNewFeed shadow-newFeed hover:scale-105 active:scale-90 transition-transform"
        />
      )}
      <Alerts
        type={type}
        message={message}
        position={{ vertical: "bottom", horizontal: "center" }}
        handleClose={handleCloseMessage}
        open={showMessage}
        duration={3000}
      />

      <DialogCustom
        isOpen={open}
        theme={theme}
        width="640px"
        handleCloseDiaLogAdd={handleClose}
      >
        <div
          className={`w-full ${
            theme === "dark" ? "bg-[rgb(24,24,24)]" : "bg-white"
          } shadow-newFeed`}
          style={{
            backgroundImage: "url(/group.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* header */}
          <div className="w-full flex items-center justify-between gap-5 px-5 py-4">
            <button
              onClick={() => setOpen(false)}
              className="text-base hover:text-neutral-400 font-medium text-ascent-1"
            >
              {t("Hủy")}
            </button>
            <span className="text-lg font-semibold text-ascent-1">
              {t("Tạo bài viết")}
            </span>
            <div className="w-7" />
          </div>
          <div className="w-full border-t-[0.1px] border-borderNewFeed" />

          {/* body */}
          <div className=" w-full flex flex-col px-5 py-4 justify-center gap-y-2">
            {/* 1 */}
            <div className="flex flex-col w-full gap-y-3">
              {/* 1 */}
              <div className="w-full flex gap-x-3">
                <img
                  src={user?.avatar ?? BlankAvatar}
                  alt="User Image"
                  className="w-14 h-14 rounded-full border-1 flex-shrink-0 border-borderNewFeed  object-cover shadow-newFeed"
                />
                {/* 2 */}
                <TextField
                  label={t("Có gì mới ?")}
                  multiline
                  id="content"
                  onChange={handleChangeStatus}
                  maxRows={5}
                  value={status}
                  variant="standard"
                  fullWidth
                  sx={{
                    "& .MuiInput-root": {
                      color: "#000",
                      "&:before": {
                        display: "none",
                      },
                      "&:after": {
                        display: "none",
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

            {/* 2 */}
            <div className="flex gap-x-10 items-center px-6">
              <div className="h-9 border-solid border-borderNewFeed border-[0.1px]" />
              <div className="flex items-center justify-between py-4 gap-x-3">
                <label
                  htmlFor="fileUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg, .mp4, .wav, .gif"
                  />
                  <BsImages style={{ width: "20px", height: "20px" }} />
                </label>
                <label
                  htmlFor="fileUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <FaPhotoVideo style={{ width: "20px", height: "20px" }} />
                </label>
                <label
                  htmlFor="fileUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <PiGifThin style={{ width: "25px", height: "25px" }} />
                </label>
              </div>
            </div>
            {/* 3 */}
            <div className="w-full flex flex-col gap-y-2">
              {files &&
                files.length > 0 &&
                files.map((file, index) => {
                  const fileURL = URL.createObjectURL(file);

                  if (file?.type?.includes("mp4")) {
                    return (
                      <div key={index} className="relative">
                        <video
                          width="100%"
                          controls
                          className="rounded-xl border-1 border-borderNewFeed"
                        >
                          <source src={fileURL} />
                        </video>
                        <IoCloseCircle
                          onClick={() => handleDeleteFile(index)}
                          className="absolute top-0 right-0 m-2 w-7 h-7 fill-[#8D867F] cursor-pointer"
                        />
                      </div>
                    );
                  }

                  if (
                    file?.type.includes("jpeg") ||
                    file?.type.includes("png") ||
                    file?.type.includes("gif")
                  ) {
                    return (
                      <div key={index} className="w-full h-full relative">
                        <img
                          src={fileURL}
                          className="w-full h-full rounded-xl border-1 object-cover bg-no-repeat shadow-newFeed border-borderNewFeed"
                        />
                        <IoCloseCircle
                          onClick={() => handleDeleteFile(index)}
                          className="absolute top-0 right-0 m-2 w-7 h-7 fill-[#8D867F] cursor-pointer"
                        />
                      </div>
                    );
                  }

                  return null;
                })}
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
                  <MenuItem value={"PUBLIC"}>
                    <span className="text-ascent-2">{t("Công khai")}</span>
                  </MenuItem>
                  <MenuItem value={"PRIVATE"}>
                    <span className="text-ascent-2">{t("Riêng tư")}</span>
                  </MenuItem>
                </Select>
              </FormControl>
              <div className="relative py-1">
                {group ? (
                  <>
                    <Button
                      type="submit"
                      title={t("Đăng")}
                      onClick={handleSubmitPostGroup}
                      containerStyles="bg-bgColor relative text-ascent-1 px-5 py-3 rounded-xl border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed"
                      disable={
                        isPendingGroup || (files.length === 0 && !status.trim())
                      }
                    />

                    {isPendingGroup && (
                      <CircularProgress
                        className="absolute top-1/3 left-7 transform -translate-x-1/2 -translate-y-1/2"
                        size={20}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      type="submit"
                      title={t("Đăng")}
                      onClick={handleSubmitPost}
                      containerStyles="bg-bgColor relative text-ascent-1 px-5 py-3 rounded-xl border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed"
                      disable={
                        isPending || (files.length === 0 && !status.trim())
                      }
                    />

                    {isPending && (
                      <CircularProgress
                        className="absolute top-1/3 left-7 transform -translate-x-1/2 -translate-y-1/2"
                        size={20}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogCustom>
    </>
  );
};

export default CreatePost;
