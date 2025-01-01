import { Button as CustomButton, TextInput } from "~/components";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BsShare } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { AiOutlineInteraction } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as UserService from "~/services/UserService";
import { updateUser } from "~/redux/Slices/userSlice";
import { jwtDecode } from "jwt-decode";
import { FaCircleExclamation } from "react-icons/fa6";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hide, setHide] = useState("hide");
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const mutation = useMutationHook((data) => UserService.login(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate("/");
      }
      localStorage.setItem("token", data?.result?.token);
      if (data?.result?.token) {
        const decoded = jwtDecode(data?.result?.token);
        if (decoded?.userId) {
          handleGetDetailUser({
            id: decoded?.userId,
            token: data?.result?.token,
          });
        }
      }
    } else if (isError) {
      setErrMsg("Username or password incorrect");
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async ({ id, token }) => {
    try {
      const res = await UserService.getDetailUserByUserId({ id, token });
      dispatch(updateUser({ ...res?.result, token }));
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6 ">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-newFeed border-borderNewFeed border-solid border-x-[0.8px] border-y-[0.8px]">
        {/* trai */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center ">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-1 rounded text-white">
              <img src="/logoHeader.svg" alt="logo" width={"50px"} />
            </div>
            <span className="text-2xl text-ascent-1 font-semibold">
              LinkVerse
            </span>
          </div>

          <p className="text-ascent-1 text-base font-semibold">
            {t("Đăng nhập vào tài khoản của bạn")}
          </p>
          <span className="text-sm mt-2 text-ascent-2">
            {t("Chào mừng bạn quay trở lại")}!
          </span>

          <form
            className="py-8 flex flex-col gap-5="
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name="username"
              placeholder="User Name"
              label={t("User Name or Email")}
              type="username"
              register={register("username", {
                required: t("User name là bắt buộc"),
                validate: {
                  noSpaces: (value) =>
                    !/\s/.test(value) || "User name must not contain spaces.",
                },
              })}
              styles={`w-full rounded-xl ${
                errors.username ? "border-red-600" : ""
              }`}
              iconRight={
                errors.username ? <FaCircleExclamation color="red" /> : ""
              }
              iconRightStyles="right-5"
              toolTip={errors.username ? errors.username?.message : ""}
              labelStyles="ml-2"
            />

            <TextInput
              name="password"
              label="Password"
              placeholder={t("Mật khẩu")}
              type={hide === "hide" ? "password" : "text"}
              styles={`w-full rounded-xl  ${
                errors.password ? "border-red-600" : ""
              }`}
              labelStyles="ml-2"
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
              toolTip={errors.password ? errors.password?.message : ""}
              iconRightStyles="right-5"
              register={register("password", {
                required: t("Mật khẩu là bắt buộc"),
                validate: {
                  noSpaces: (value) =>
                    !/\s/.test(value) || "Password must not contain spaces.",
                },
              })}
            />

            <div className="flex justify-between items-center">
              {errMsg ? (
                <span className={`text-sm text-red-600 py-1`}>{errMsg}</span>
              ) : (
                <span className="flex-1" />
              )}
              <Link
                to="/forgot-password"
                className="text-sm text-right text-blue font-semibold my-1 py-1 ml-auto hover:text-[#065ad898]"
              >
                {t("Quên mật khẩu")} ?
              </Link>
            </div>

            <div className="relative">
              <CustomButton
                disable={isPending || !isValid}
                type="submit"
                containerStyles="w-full mt-3 inline-flex active:scale-90 justify-center rounded-md bg-[#065ad8] px-8 py-3 text-sm font-medium text-white outline-none hover:bg-[#065ad898] hover:text-black"
                title={t("Đăng nhập")}
              />
              {isPending && (
                <CircularProgress
                  className="absolute top-1/2 left-1/2"
                  size={20}
                />
              )}
            </div>
          </form>

          <p className="text-ascent-2 text-sm text-center">
            {t("Không có tài khoản")} ?
            <Link
              to="/register"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer hover:text-[#065ad898]"
            >
              {t("Tạo tài khoản")}
            </Link>
          </p>
        </div>
        {/* phai */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue">
          <div className="relative w-full flex items-center justify-center">
            <img
              src="/register.jpeg"
              alt="bg"
              className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover shadow-xl"
            />

            <div className="absolute flex items-center gap-1 bg-primary  right-10 top-10 py-2 px-5 rounded-full shadow-xl">
              <BsShare size={14} className="text-ascent-1" />
              <span className="text-xs font-medium text-ascent-1">
                {t("Chia sẻ")}
              </span>
            </div>

            <div className="absolute flex items-center gap-1 bg-primary left-10 top-6 py-2 px-5 rounded-full shadow-xl">
              <ImConnection size={14} className="text-ascent-1" />
              <span className="text-xs font-medium text-ascent-1">
                {t("Kết nối")}
              </span>
            </div>

            <div className="absolute flex items-center gap-1 bg-primary left-12 bottom-6 py-2 px-5 rounded-full shadow-xl">
              <AiOutlineInteraction size={14} className="text-ascent-1" />
              <span className="text-xs font-medium text-ascent-1">
                {t("Tương tác")}
              </span>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-white text-base">
              {t("Kết nối với bạn bè và chia sẻ những điều thú vị")}
            </p>
            <span className="text-sm  text-white/80">
              {t("Chia sẻ kỉ niệm với bạn bè và thế giới")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
