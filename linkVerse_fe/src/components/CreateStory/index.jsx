import { useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, DialogCustom } from "..";
import { BlankAvatar } from "~/assets";
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { IoCloseCircle } from "react-icons/io5";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as StoryService from "~/services/StoryService";
import useDragAndDrop from "~/hooks/useDragAndDrop";
import { WrapperModal } from "./style";

const CreateStory = ({ handleClose, open, onSuccess }) => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
  const [status, setStatus] = useState("");
  const [listFiles, setListFiles] = useState([]);
  const [postState, setPostState] = useState("PUBLIC");
  const token = localStorage.getItem("token");
  const inputFileRef = useRef(null);

  const handleChangeStatus = useCallback((e) => {
    setStatus(e.target.value);
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setListFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDeleteFile = (index) => {
    setListFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // drag&drop
  const onDrop = (files) => {
    setListFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const { isDragging, files, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDrop(onDrop);

  const handleClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  // Submit post
  const mutation = useMutationHook(({ data, token }) =>
    StoryService.createStory({ data, token })
  );
  const { data, isPending, isError, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess) {
      if (data?.code === 200) {
        handleClose();
        onSuccess();
      } else if (data?.code === 400) {
        setOpen(false);
      }
    } else if (isError) {
      console.log("loi");
    }
  }, [isSuccess, isError]);

  const handleSubmitPost = () => {
    const request = { content: status, visibility: postState };
    const data = { request, files: listFiles };
    mutation.mutate({ data, token });
  };

  return (
    // <DialogCustom
    //   isOpen={open}
    //   width="630px"
    //   theme={theme}
    //   handleCloseDiaLogAdd={handleClose}
    // >
    //   <div
    //     className={`w-full ${
    //       theme === "dark" ? "bg-[rgb(24,24,24)]" : "bg-white"
    //     } shadow-newFeed`}
    //     style={{
    //       backgroundImage: "url(/group.png)",
    //       backgroundSize: "cover",
    //       backgroundPosition: "center",
    //     }}
    //   >
    //     {/* header */}
    //     <div className="w-full flex items-center justify-between gap-5 px-5 py-4">
    //       <button
    //         onClick={handleClose}
    //         className={`text-base hover:text-neutral-400 font-medium text-neutral-500 ${
    //           theme === "dark" ? "text-white" : "text-black"
    //         }`}
    //       >
    //         Hủy
    //       </button>
    //       <span
    //         className={`text-lg font-semibold ${
    //           theme === "dark" ? "text-white" : "text-black"
    //         }`}
    //       >
    //         Create story
    //       </span>
    //       <div />
    //     </div>
    //     <div className="w-full border-t-[0.1px] border-borderNewFeed" />

    //     {/* body */}
    //     <div className=" w-full flex flex-col px-5 py-4 justify-center gap-y-2">
    //       {/* 1 */}
    //       <div className="flex flex-col w-full pb-2 gap-y-3">
    //         <div className="w-full flex gap-x-3">
    //           <img
    //             src={user?.avatar ?? BlankAvatar}
    //             alt="User Image"
    //             className="w-14 h-14 rounded-full object-cover shadow-newFeed"
    //           />
    //           <TextField
    //             label="Có gì mới ?"
    //             multiline
    //             id="content"
    //             onChange={handleChangeStatus}
    //             maxRows={5}
    //             value={status}
    //             variant="standard"
    //             fullWidth
    //             sx={{
    //               "& .MuiInput-root": {
    //                 color: theme === "dark" ? "#fff" : "#000",
    //                 "&:before": {
    //                   display: "none",
    //                 },
    //                 "&:after": {
    //                   display: "none",
    //                 },
    //               },
    //               "& .MuiInputLabel-standard": {
    //                 color: "rgb(89, 91, 100)",
    //                 "&.Mui-focused": {
    //                   display: "none",
    //                 },
    //               },
    //             }}
    //           />
    //         </div>
    //       </div>

    //       <div
    //         onDragOver={handleDragOver}
    //         onDragLeave={handleDragLeave}
    //         onDrop={handleDrop}
    //         onClick={handleClick}
    //         style={{
    //           width: "100%",
    //           height: "200px",
    //           border: "2px dashed #ccc",
    //           borderRadius: "10px",
    //           textAlign: "center",
    //           lineHeight: "200px",
    //           backgroundColor: isDragging ? "#e0f7fa" : "#fafafa",
    //           transition: "background-color 0.3s",
    //         }}
    //       >
    //         {isDragging
    //           ? "Drop your files here"
    //           : "Drag and drop files here or click to upload"}
    //         <input
    //           type="file"
    //           ref={inputFileRef}
    //           onChange={handleFileChange}
    //           style={{ display: "none" }}
    //           multiple
    //         />
    //       </div>

    //       {/* File previews */}
    //       <div className="w-full flex flex-col gap-y-2">
    //         {listFiles &&
    //           listFiles.length > 0 &&
    //           listFiles.map((file, index) => {
    //             const fileURL = URL.createObjectURL(file);

    //             if (file?.type?.includes("mp4")) {
    //               return (
    //                 <div key={index} className="relative">
    //                   <video
    //                     width="100%"
    //                     controls
    //                     className="rounded-xl border-1 border-borderNewFeed"
    //                   >
    //                     <source src={fileURL} />
    //                   </video>
    //                   <IoCloseCircle
    //                     onClick={() => handleDeleteFile(index)}
    //                     className="absolute top-0 right-0 m-2 w-7 h-7 fill-[#8D867F] cursor-pointer"
    //                   />
    //                 </div>
    //               );
    //             }

    //             if (
    //               file?.type.includes("jpeg") ||
    //               file?.type.includes("png") ||
    //               file?.type.includes("gif")
    //             ) {
    //               return (
    //                 <div key={index} className="w-full h-full relative">
    //                   <img
    //                     src={fileURL}
    //                     className="w-full h-full rounded-xl border-1 object-cover bg-no-repeat shadow-newFeed border-borderNewFeed"
    //                   />
    //                   <IoCloseCircle
    //                     onClick={() => handleDeleteFile(index)}
    //                     className="absolute top-0 right-0 m-2 w-7 h-7 fill-[#8D867F] cursor-pointer"
    //                   />
    //                 </div>
    //               );
    //             }

    //             return null;
    //           })}
    //       </div>

    //       {/* Post options */}
    //       <div className="w-full flex justify-between">
    //         <FormControl
    //           sx={{ m: 1, minWidth: 120 }}
    //           size="small"
    //           variant="standard"
    //         >
    //           <Select
    //             disableUnderline="true"
    //             labelId="demo-select-small-label"
    //             id="demo-select-small"
    //             value={postState}
    //             onChange={(e) => setPostState(e.target.value)}
    //             sx={{
    //               boxShadow: "none",
    //               "& .MuiSelect-icon": {
    //                 display: "none",
    //               },
    //             }}
    //           >
    //             <MenuItem value={"PUBLIC"}>
    //               <span className="text-ascent-2">Công khai</span>
    //             </MenuItem>
    //             <MenuItem value={"PRIVATE"}>
    //               <span className="text-ascent-2">Riêng tư</span>
    //             </MenuItem>
    //           </Select>
    //         </FormControl>
    //         <div className="relative py-1">
    //           <Button
    //             type="submit"
    //             title="Đăng"
    //             onClick={handleSubmitPost}
    //             containerStyles="bg-bgColor relative text-ascent-1 px-5 py-3 rounded-xl border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed"
    //             disable={isPending || (files.length === 0 && !status.trim())}
    //           />
    //           {isPending && (
    //             <CircularProgress
    //               className="absolute top-1/3 left-7 transform -translate-x-1/2 -translate-y-1/2"
    //               size={20}
    //             />
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </DialogCustom>

    <WrapperModal
      width="630px"
      closable={false}
      open={open}
      centered
      footer
      onCancel={handleClose}
    >
      <div
        className="shadow-newFeed w-full bg-primary rounded-3xl"
        style={{
          backgroundImage: "url(/group.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* header */}
        <div className="w-full flex items-center justify-between gap-5 px-5 py-4">
          <button
            onClick={handleClose}
            className="text-base hover:text-neutral-400 font-medium text-ascent-1"
          >
            Hủy
          </button>
          <span className="text-lg font-semibold text-ascent-1">
            Create story
          </span>
          <div />
        </div>
        <div className="w-full border-t-[0.1px] border-borderNewFeed" />

        {/* body */}
        <div className=" w-full flex flex-col px-5 py-4 justify-center gap-y-2">
          {/* 1 */}
          <div className="flex flex-col w-full pb-2 gap-y-3">
            <div className="w-full flex gap-x-3">
              <img
                src={user?.avatar ?? BlankAvatar}
                alt="User Image"
                className="w-14 h-14 rounded-full object-cover shadow-newFeed"
              />
              <TextField
                label="Có gì mới ?"
                multiline
                id="content"
                onChange={handleChangeStatus}
                maxRows={5}
                value={status}
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

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            style={{
              width: "100%",
              height: "200px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              textAlign: "center",
              lineHeight: "200px",
              backgroundColor: isDragging ? "#e0f7fa" : "#fafafa",
              transition: "background-color 0.3s",
            }}
          >
            {isDragging
              ? "Drop your files here"
              : "Drag and drop files here or click to upload"}
            <input
              type="file"
              ref={inputFileRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              multiple
            />
          </div>

          {/* File previews */}
          <div className="w-full flex flex-col gap-y-2">
            {listFiles &&
              listFiles.length > 0 &&
              listFiles.map((file, index) => {
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

          {/* Post options */}
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
                  <span className="text-ascent-2">Công khai</span>
                </MenuItem>
                <MenuItem value={"PRIVATE"}>
                  <span className="text-ascent-2">Riêng tư</span>
                </MenuItem>
              </Select>
            </FormControl>
            <div className="relative py-1">
              <Button
                type="submit"
                title="Đăng"
                onClick={handleSubmitPost}
                containerStyles="bg-bgColor relative text-ascent-1 px-5 py-3 rounded-xl border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed"
                disable={isPending || (files.length === 0 && !status.trim())}
              />
              {isPending && (
                <CircularProgress
                  className="absolute top-1/3 left-7 transform -translate-x-1/2 -translate-y-1/2"
                  size={20}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </WrapperModal>
  );
};

export default CreateStory;
