import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alerts, Button, DialogCustom } from "..";
import { BlankAvatar } from "~/assets";
import {
  CircularProgress,
  Fab,
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

const CreateComment = ({ open, handleClose, id, onSuccess }) => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [type, setType] = useState("");

  //   const handleClose = () => {
  //     handleClear();
  //   };

  //   const handleClear = () => {
  //     setStatus("");
  //     setFiles([]);
  //   };

  const handleChangeContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  // delete
  //   const handleDeleteFile = (index) => {
  //     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  //   };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const mutation = useMutationHook(({ id, token, content }) =>
    PostService.comment({ id, token, content })
  );
  const { data, isPending, isError, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess) {
      if (data?.code === 200) {
        //   handleClear();
        // setOpen(false);
        setType("success");
        setMessage("Create comment success!");
        setShowMessage(true);
        onSuccess();
      } else if (data?.code === 400) {
        //   setType("error");
        //   setMessage(data?.message);
        //   setShowMessage(true);
        //   handleClear();
        //   setOpen(false);
      }
    } else if (isError) {
      setMessage("Something went wrong!");
    }
  }, [isSuccess, isError]);

  const handleSubmitPost = () => {
    const token = localStorage.getItem("token");
    mutation.mutate({ id, token, content });
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <>
      <Alerts
        type={type}
        message={message}
        position={{ vertical: "bottom", horizontal: "center" }}
        handleClose={handleCloseMessage}
        open={showMessage}
      />

      <DialogCustom
        isOpen={open}
        theme={theme}
        handleCloseDiaLogAdd={handleClose}
      >
        <div
          className={`w-full ${
            theme === "dark" ? "bg-[rgb(24,24,24)]" : "bg-white"
          } shadow-newFeed`}
        >
          {/* header */}
          <div className="w-full flex items-center justify-between gap-5 px-5 py-4">
            <button
              onClick={() => setOpen(false)}
              className={`text-base hover:text-neutral-400 font-medium text-neutral-500 ${
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
              Create comment
            </span>
            <div />
          </div>
          <div className="w-full border-t-[0.1px] border-borderNewFeed" />

          {/* body */}
          <div className=" w-full flex flex-col px-5 py-4 justify-center gap-y-2">
            {/* 1 */}
            <div className="flex flex-col w-full gap-y-3">
              <div className="w-full flex gap-x-3">
                <img
                  src={user?.profileUrl ?? BlankAvatar}
                  alt="User Image"
                  className="w-14 h-14 rounded-full object-cover shadow-newFeed"
                />
                <TextField
                  label="Trả lời"
                  multiline
                  id="content"
                  onChange={handleChangeContent}
                  maxRows={5}
                  value={content}
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
                      <div key={index} className="w-full h-80 relative">
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
            <div className="w-full flex justify-end">
              <div className="relative py-1">
                <Button
                  type="submit"
                  title="Đăng"
                  onClick={handleSubmitPost}
                  containerStyles="bg-bgColor relative text-ascent-1 px-5 py-3 rounded-xl border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed"
                  //   disable={isPending || (files.length === 0 && !status.trim())}
                />

                {/* {isPending && (
                  <CircularProgress
                    className="absolute top-1/3 left-7 transform -translate-x-1/2 -translate-y-1/2"
                    size={20}
                  />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </DialogCustom>
    </>
  );
};

export default CreateComment;
