import { Loading, Button as CustomButton, TextInput } from "~/components";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BgImage } from "~/assets/index";
import { BsShare } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { AiOutlineInteraction } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as UserService from "~/services/UserService";
import { updateUser } from "~/redux/Slices/userSlice";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [hide, setHide] = useState("hide");
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const mutation = useMutationHook((data) => UserService.login(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      if (location?.state) {
        console.log("Login successful");
        navigate(location?.state);
      } else {
        console.log("Login successful");
        navigate("/");
      }
      localStorage.setItem(
        "access_token",
        JSON.stringify(data?.message?.metaData?.tokens?.accessToken)
      );
      if (data?.message?.metaData?.tokens) {
        const decoded = jwtDecode(data?.message?.metaData?.tokens?.accessToken);
        if (decoded?.userId) {
          handleGetDetailUser(
            decoded?.userId,
            data?.message?.metaData?.tokens?.accessToken
          );
        }
      }
    }
  }, [isSuccess]);

  const handleGetDetailUser = async (id, token) => {
    try {
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.message?.metaData, access_token: token }));
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
              name="email"
              placeholder="email@example.com"
              label={t("Địa chỉ email")}
              type="email"
              register={register("email", {
                required: t("Địa chỉ email là bắt buộc"),
              })}
              styles="w-full rounded-full"
              labelStyles="ml-2"
              error={errors.email ? errors.email.message : ""}
            />

            <TextInput
              name="password"
              label="Password"
              placeholder={t("Mật khẩu")}
              type={hide === "hide" ? "password" : "text"}
              styles="w-full rounded-full"
              labelStyles="ml-2"
              iconRight={
                hide === "hide" ? (
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
              register={register("password", {
                required: t("Mật khẩu là bắt buộc"),
              })}
              error={errors.password ? errors.password?.message : ""}
            />

            <Link
              to="/reset-password"
              className="text-sm text-right text-blue font-semibold my-1"
            >
              {t("Quên mật khẩu")} ?
            </Link>

            {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status == "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type="submit"
                containerStyles={`inline-flex text-white justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium outline-none`}
                title={t("Đăng nhập")}
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            {t("Không có tài khoản")} ?
            <Link
              to="/register"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
            >
              {t("Tạo tài khoản")}
            </Link>
          </p>
        </div>
        {/* phai */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={BgImage}
              alt="Bg Image"
              className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover"
            />

            <div className="absolute flex items-center gap-1 bg-primary  right-10 top-10 py-2 px-5 rounded-full">
              <BsShare size={14} className="text-ascent-1" />
              <span className="text-xs font-medium text-ascent-1">
                {t("Chia sẻ")}
              </span>
            </div>

            <div className="absolute flex items-center gap-1 bg-primary left-10 top-6 py-2 px-5 rounded-full">
              <ImConnection size={14} className="text-ascent-1" />
              <span className="text-xs font-medium text-ascent-1">
                {t("Kết nối")}
              </span>
            </div>

            <div className="absolute flex items-center gap-1 bg-primary left-12 bottom-6 py-2 px-5 rounded-full">
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
