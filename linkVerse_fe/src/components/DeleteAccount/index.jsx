import { useState } from "react";
import { DialogCustom, Button, TextInput, Alerts } from "..";
import { IoIosArrowForward, IoMdEye, IoMdEyeOff } from "react-icons/io";
import * as UserService from "~/services/UserService";
import { useForm } from "react-hook-form";
import { FaCircleExclamation } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { resetUser } from "~/redux/Slices/userSlice";
import { CircularProgress } from "@mui/material";

function DeleteAccount({ setting }) {
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [openDialogOption0, setOpenDialogOption0] = useState(false);
  const [openDialogOption1, setOpenDialogOption1] = useState(false);
  const [openDialogOption2, setOpenDialogOption2] = useState(false);
  const [openDialogOption3, setOpenDialogOption3] = useState(false);
  const token = localStorage.getItem("token");
  const [hide, setHide] = useState("hide");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loadingDisable, setLoadingDisable] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleCloseMessage = () => setOpen(false);

  const handleMainDialogOpen = () => setOpenMainDialog(true);
  const handleMainDialogClose = () => setOpenMainDialog(false);

  const handleDialogOption0Open = () => {
    handleMainDialogClose();
    setOpenDialogOption0(true);
  };
  const handleDialogOption0Close = () => {
    reset({ password: "" });
    setOpenDialogOption0(false);
  };

  const handleDialogOption1Open = () => setOpenDialogOption1(true);
  const handleDialogOption1Close = () => {
    setOpenDialogOption1(false);
  };

  const handleDialogOption2Open = () => {
    handleMainDialogClose();
    setOpenDialogOption2(true);
  };
  const handleDialogOption2Close = () => {
    reset({ password: "" });
    setOpenDialogOption2(false);
  };

  const handleDialogOption3Open = () => setOpenDialogOption3(true);
  const handleDialogOption3Close = () => setOpenDialogOption3(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  //disable account
  const handleDisableAccount = async (data) => {
    setLoadingDisable(true);
    try {
      const res = await UserService.disableAcount({
        token,
        password: data.password,
      });
      if (res) {
        dispatch(resetUser());
      }
    } catch (error) {
      handleDialogOption1Close();
      setMessage("Mật khẩu không chính xác!");
      setType("error");
      setOpen(true);
    } finally {
      setLoadingDisable(false);
    }
  };

  //delete account
  const handleDeleteAccount = async (data) => {
    setLoadingDelete(true);
    try {
      const res = await UserService.deleteAccount({
        token,
        password: data.password,
      });
      if (res) {
        dispatch(resetUser());
      }
    } catch (error) {
      handleDialogOption3Close();
      setMessage("Mật khẩu không chính xác!");
      setType("error");
      setOpen(true);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div>
      <Alerts
        message={message}
        type={type}
        open={open}
        duration={3000}
        handleClose={handleCloseMessage}
        position={{ vertical: "bottom", horizontal: "center" }}
      />
      {setting && (
        <IoIosArrowForward
          size={20}
          onClick={handleMainDialogOpen}
          className="cursor-pointer text-bgStandard"
        />
      )}
      {/* main */}
      <DialogCustom
        isOpen={openMainDialog}
        width="548px"
        handleCloseDiaLogAdd={handleMainDialogClose}
      >
        <div className="w-full h-auto p-6 bg-primary flex flex-col">
          <div className="w-full flex font-semibold items-center py-2 justify-center">
            Vô hiệu hóa hoặc xóa
          </div>
          <div className="h-full flex flex-col w-full py-2">
            <div className="w-full flex py-2 flex-col gap-2">
              <span className="font-semibold text-sm">
                Vô hiệu hóa trang cá nhân chỉ mang tính tạm thời
              </span>
              <p className="text-sm text-ascent-2">
                Trang cá nhân, nội dung, lượt thích và người theo dõi trên
                LinkVerse của bạn sẽ không hiển thị với bất kỳ ai cho đến khi
                bạn đăng nhập lại để kích hoạt trang cá nhân
              </p>
            </div>
            <div className="w-full flex py-2 flex-col gap-2">
              <h2 className="font-semibold text-sm">
                Xóa trang cá nhân là mang tính vĩnh viễn
              </h2>
              <p className="text-sm text-ascent-2">
                Trước khi bị gỡ vĩnh viễn, trang cá nhân, nội dung, lượt thích
                và người theo dõi trên LinkVerse của bạn sẽ ẩn trong 30 ngày.
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-2 items-center justify-between">
            <Button
              onClick={handleDialogOption0Open}
              title="Vô hiệu hóa tài khoản"
              containerStyles="w-full text-white bg-bgStandard flex items-center border-1 justify-center py-3 rounded-2xl border-borderNewFeed border-1"
            />
            <Button
              title="Xóa tài khoản"
              containerStyles="border-borderNewFeed border-1 py-3 rounded-2xl text-red-600 bg-primary w-full flex items-center justify-center"
              onClick={handleDialogOption2Open}
            />
          </div>
        </div>
      </DialogCustom>
      {/* 0 */}
      <DialogCustom
        isOpen={openDialogOption0}
        width="400px"
        handleCloseDiaLogAdd={handleDialogOption0Close}
      >
        <div className="bg-primary w-full p-10 gap-3 flex items-center flex-col">
          <span className="font-semibold text-lg text-left w-full">
            Disable account
          </span>
          <span className="font-extralight">
            Deactivating your account is only temporary. If you log back into
            your account within 30 days, it will be automatically reactivated.
          </span>
          <div className="flex flex-col gap-2 w-full">
            <span className="text-ascent-2 text-sm">
              To confirm this, type your password
            </span>
            <div className="w-full flex gap-2 items-center ">
              <TextInput
                name="password"
                placeholder="Password"
                type={hide === "hide" ? "password" : "text"}
                styles={`w-full  h-10  ${
                  errors.password ? "border-red-600" : ""
                }`}
                iconRight={
                  errors.password ? (
                    <FaCircleExclamation color="red" />
                  ) : hide === "hide" ? (
                    <IoMdEyeOff
                      className="cursor-pointer"
                      onClick={() => setHide("show")}
                    />
                  ) : (
                    <IoMdEye
                      className="cursor-pointer"
                      onClick={() => setHide("hide")}
                    />
                  )
                }
                stylesContainer="mt-0"
                toolTip={errors.password ? errors.password.message : ""}
                {...register("password", {
                  required: "This field is required!",
                })}
              />
              <Button
                disable={!isValid}
                onClick={handleDialogOption1Open}
                title="Disable account"
                containerStyles="inline-flex font-semibold justify-center rounded-md bg-red-600 w-full h-10 text-sm font-medium text-white outline-none"
              />
            </div>
          </div>
        </div>
      </DialogCustom>
      {/* 1 */}
      <DialogCustom
        isOpen={openDialogOption1}
        width="250px"
        handleCloseDiaLogAdd={handleDialogOption1Close}
      >
        <div className="bg-primary w-full flex items-center flex-col">
          <span className="p-4">Bạn có chắc không?</span>
          <div className="flex w-full border-t items-center justify-between">
            <div
              onClick={handleDialogOption1Close}
              className="flex hover:bg-[#fafafa] cursor-pointer w-full  border-r items-center p-4 justify-center"
            >
              <span>Hủy</span>
            </div>
            <div
              onClick={handleSubmit(handleDisableAccount)}
              className={`${
                loadingDisable && "bg-[#fafafa] text-[#ccc] cursor-not-allowed"
              } flex relative p-4 hover:bg-[#fafafa] cursor-pointer w-full items-center justify-center`}
            >
              <span>Vô hiệu hóa</span>
              {loadingDisable && (
                <CircularProgress className="absolute" size={20} />
              )}
            </div>
          </div>
        </div>
      </DialogCustom>
      {/* 2 */}
      <DialogCustom
        isOpen={openDialogOption2}
        width="400px"
        handleCloseDiaLogAdd={handleDialogOption2Close}
      >
        <div className="bg-primary w-full p-10 gap-3 flex items-center flex-col">
          <span className="font-semibold text-lg text-left w-full">
            Deleting account
          </span>
          <span className="font-extralight">
            Deleting your account will remove all of your information from our
            database. This cannot be undone.
          </span>
          <div className="flex flex-col gap-2 w-full">
            <span className="text-ascent-2 text-sm">
              To confirm this, type your password
            </span>
            <div className="w-full flex gap-2 items-center ">
              <TextInput
                name="password"
                placeholder="Password"
                type={hide === "hide" ? "password" : "text"}
                styles={`w-full  h-10  ${
                  errors.password ? "border-red-600" : ""
                }`}
                iconRight={
                  errors.password ? (
                    <FaCircleExclamation color="red" />
                  ) : hide === "hide" ? (
                    <IoMdEyeOff
                      className="cursor-pointer"
                      onClick={() => setHide("show")}
                    />
                  ) : (
                    <IoMdEye
                      className="cursor-pointer"
                      onClick={() => setHide("hide")}
                    />
                  )
                }
                stylesContainer="mt-0"
                toolTip={errors.password ? errors.password.message : ""}
                {...register("password", {
                  required: "This field is required!",
                })}
              />
              <Button
                disable={!isValid}
                onClick={handleDialogOption3Open}
                title="Delete account"
                containerStyles="inline-flex font-semibold justify-center rounded-md bg-red-600 w-full h-10 text-sm font-medium text-white outline-none"
              />
            </div>
          </div>
        </div>
      </DialogCustom>
      {/* 3 */}
      <DialogCustom
        isOpen={openDialogOption3}
        width="250px"
        handleCloseDiaLogAdd={handleDialogOption3Close}
      >
        <div className="bg-primary w-full flex items-center flex-col">
          <span className="p-4">Bạn có chắc không?</span>
          <div className="flex w-full border-t items-center justify-between">
            <div
              onClick={handleDialogOption3Close}
              className="flex hover:bg-[#fafafa] cursor-pointer w-full  border-r items-center p-4 justify-center"
            >
              <span>Hủy</span>
            </div>
            <div
              onClick={handleSubmit(handleDeleteAccount)}
              className={`${
                loadingDelete && "bg-[#fafafa] text-[#ccc] cursor-not-allowed"
              } flex relative p-4 hover:bg-[#fafafa] cursor-pointer w-full items-center justify-center`}
            >
              <span>Delete</span>
              {loadingDelete && (
                <CircularProgress size={20} className="absolute" />
              )}
            </div>
          </div>
        </div>
      </DialogCustom>
    </div>
  );
}

export default DeleteAccount;
