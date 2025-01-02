import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alerts, Button, DialogCustom } from "..";
import { GroupAvatar } from "~/assets";
import { CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as GroupService from "~/services/GroupService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateGroup = ({ open, handleClose }) => {
  const theme = useSelector((state) => state.theme.theme);
  const [postState, setPostState] = useState("PUBLIC");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");
  const [typeMessage, setTypeMessage] = useState("");
  const [message, setMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const mutation = useMutationHook((data) =>
    GroupService.createGroup({ data, token })
  );

  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      if (data && data?.result) {
        navigate(`/group/${data?.result?.id}`);
      }
    }
  }, [isSuccess, isError]);

  const handleSubmitPost = () => {
    const data = {
      name,
      description,
      visibility: postState,
    };
    mutation.mutate(data);
  };

  return (
    <>
      <Alerts
        type={typeMessage}
        duration={3000}
        message={message}
        open={openMessage}
        position={{ vertical: "bottom", horizontal: "center" }}
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
              className={`text-base hover:text-neutral-400 font-medium text-neutral-500 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {t("Hủy")}
            </button>
            <span className="text-lg font-semibold text-ascent-2">
              {t("Tạo nhóm")}
            </span>
            <div className="w-7" />
          </div>
          <div className="w-full border-t-[0.1px] border-borderNewFeed" />

          {/* body */}
          <div className=" w-full flex flex-col px-5 py-4 justify-center gap-y-2">
            {/* 1 */}
            <div className="w-full h-32 gap-1 bg-transparent flex flex-col items-center justify-center">
              <div className="bg-gradient-to-tr from-[#449BFF] to-[#9db106e3] p-[2px] rounded-full cursor-pointer">
                <img
                  class="w-16 h-16  rounded-full block object-cover bg-white p-[4px] transform transition hover:-rotate-6"
                  src={GroupAvatar}
                />
              </div>
              <form className="w-full flex text-center flex-col justify-center">
                <input
                  type="text"
                  value={name}
                  name="name"
                  onChange={handleChangeName}
                  placeholder={t("Tên nhóm")}
                  className={`placeholder:text-black bg-transparent text-center focus:outline-none`}
                  autoFocus
                />
                <input
                  value={description}
                  onChange={handleChangeDescription}
                  type="text"
                  placeholder={t("Mô tả thông tin về nhóm của bạn")}
                  className="placeholder:text-ascent-2 placeholder:text-sm w-full bg-transparent text-center focus:outline-none"
                />
              </form>
            </div>
            {/* 3 */}
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
                    <span className="text-ascent-2">Riêng tư</span>
                  </MenuItem>
                </Select>
              </FormControl>
              <div className="relative">
                <Button
                  type="submit"
                  title={t("Tạo")}
                  onClick={handleSubmitPost}
                  containerStyles="bg-bgColor relative text-ascent-1 px-5 py-3 rounded-xl border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed"
                  disable={isPending}
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
      </DialogCustom>
    </>
  );
};

export default CreateGroup;
