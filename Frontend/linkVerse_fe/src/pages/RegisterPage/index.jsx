import { TextInput, Loading, Button as CustomButton } from "~/components";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BgImage } from "~/assets";
import { BsShare } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { AiOutlineInteraction } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as UserService from "~/services/UserService";
import { FaCircleExclamation } from "react-icons/fa6";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [hide, setHide] = useState("hide");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const mutation = useMutationHook((data) => UserService.register(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      navigate("/login", { state: data?.message?.metaData?.metadata });
    } else if (isError) {
      setErrMsg("Email is already registered");
    }
  }, [isSuccess, isError]);

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-2xl border-1 border-borderNewFeed">
        {/* phai */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center shadow-xl">
          {/* header */}
          <div className="w-full flex flex-col gap-2 mb-2">
            <span className="text-2xl text-[#065ad8] font-semibold">
              LinkVerse
            </span>
            <p className="text-ascent-1 text-base font-semibold">
              {t("Tạo tài khoản")}
            </p>
          </div>

          <form
            className="flex flex-col pb-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col  lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="firstName"
                label="First Name"
                placeholder="First Name"
                type="text"
                styles={`w-full h-10 ${
                  errors.firstName ? "border-red-600" : ""
                }`}
                iconRight={
                  errors.firstName ? <FaCircleExclamation color="red" /> : ""
                }
                toolTip={errors.firstName ? errors.firstName?.message : ""}
                register={register("firstName", {
                  required: "First Name is required!",
                })}
                // error={errors.firstName ? errors.firstName?.message : ""}
              />

              <TextInput
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                type="text"
                styles={`w-full h-10 ${
                  errors.lastName ? "border-red-600" : ""
                }`}
                iconRight={
                  errors.lastName ? <FaCircleExclamation color="red" /> : ""
                }
                toolTip={errors.lastName ? errors.lastName?.message : ""}
                register={register("lastName", {
                  required: "Last Name is required",
                })}
                // error={errors.lastName ? errors.lastName?.message : ""}
              />
            </div>

            <TextInput
              name="birthday"
              type="date"
              label="Ngày sinh"
              styles={`w-full h-10 ${errors.birthday ? "border-red-600" : ""}`}
              register={register("birthday", {
                required: "Birthday is required",
              })}
              toolTipInput={errors.birthday ? errors.birthday?.message : ""}
              // error={errors.birthday ? errors.birthday?.message : ""}
            />

            <div className="w-full flex flex-col mt-2">
              <p className="text-ascent-2 text-sm mb-2">Sex</p>

              <div className="w-full h-10 flex flex-col lg:flex-row gap-1 md:gap-2">
                <div
                  className={`flex w-full items-center justify-between bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-2.5 ${
                    errors.sex ? "border-red-600" : ""
                  }`}
                >
                  <label className="text-ascent-1" htmlFor="male">
                    Male
                  </label>
                  <input
                    type="radio"
                    id="male"
                    value="male"
                    {...register("sex", { required: "Sex is required" })}
                  />
                </div>

                <div
                  className={`flex w-full items-center justify-between bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-2.5 ${
                    errors.sex ? "border-red-600" : ""
                  }`}
                >
                  <label className="text-ascent-1" htmlFor="female">
                    Female
                  </label>
                  <input
                    type="radio"
                    id="female"
                    value="female"
                    {...register("sex", { required: "Sex is required" })}
                  />
                </div>

                <div
                  className={`flex w-full items-center justify-between bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-2.5 ${
                    errors.sex ? "border-red-600" : ""
                  }`}
                >
                  <label className="text-ascent-1" htmlFor="other">
                    Other
                  </label>
                  <input
                    type="radio"
                    id="other"
                    value="other"
                    {...register("sex", { required: "Sex is required" })}
                  />
                </div>
              </div>

              {/* {errors.sex && (
                <span className="text-xs text-[#f64949fe] mt-0.5">
                  {errors.sex.message}
                </span>
              )} */}
            </div>

            <TextInput
              name="email"
              placeholder="email@example.com"
              label={t("Địa chỉ email")}
              type="email"
              register={register("email", {
                required: t("Địa chỉ email là bắt buộc"),
              })}
              styles={`w-full h-10 ${errors.email ? "border-red-600" : ""}`}
              iconRight={
                errors.email ? <FaCircleExclamation color="red" /> : ""
              }
              toolTip={errors.email ? errors.email?.message : ""}
              // error={errors.email ? errors.email.message : ""}
            />

            <TextInput
              name="password"
              label="Password"
              placeholder={t("Mật khẩu")}
              type={hide === "hide" ? "password" : "text"}
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
              iconRightStyles="right-4"
              styles={`w-full h-10 ${errors.password ? "border-red-600" : ""}`}
              toolTip={errors.password ? errors.password?.message : ""}
              register={register("password", {
                required: t("Mật khẩu là bắt buộc"),
              })}
            />

            {/* {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status == "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )} */}

            {errMsg && (
              <span className={`text-sm mt-0.5 text-red-600`}>{errMsg}</span>
            )}

            {isPending ? (
              <div className="h-10 ">
                <Loading />
              </div>
            ) : (
              <>
                <CustomButton
                  type="submit"
                  containerStyles={`mt-5 inline-flex justify-center rounded-md bg-[#065ad8] px-8 py-3 text-sm font-medium text-white outline-none hover:bg-[#065ad898] hover:text-black ${
                    !isValid && "cursor-not-allowed"
                  }`}
                  title={t("Đăng ký")}
                />
              </>
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            {t("Đã có tài khoản")} ?{" "}
            <Link
              to="/login"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer hover:text-[#065ad898]"
            >
              {t("Đăng nhập")}
            </Link>
          </p>
        </div>
        {/* trai */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue shadow-xl">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={BgImage}
              alt="Bg Image"
              className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover shadow-xl"
            />

            <div className="absolute flex items-center gap-1 bg-primary right-10 top-10 py-2 px-5 rounded-full shadow-xl">
              <BsShare size={14} className="text-ascent-1" />
              <span className="text-ascent-1 text-xs font-medium">
                {t("Chia sẻ")}
              </span>
            </div>

            <div className="absolute flex items-center gap-1 bg-primary left-10 top-6 py-2 px-5 rounded-full shadow-xl">
              <ImConnection className="text-ascent-1" />
              <span className="text-ascent-1 text-xs font-medium">
                {t("Kết nối")}
              </span>
            </div>

            <div className="absolute flex items-center gap-1 bg-primary left-12 bottom-6 py-2 px-5 rounded-full shadow-xl">
              <AiOutlineInteraction className="text-ascent-1" />
              <span className="text-ascent-1 text-xs font-medium">
                {t("Tương tác")}
              </span>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-white text-base">
              {t("Kết nối với bạn bè và chia sẻ những điều thú vị")}
            </p>
            <span className="text-sm text-white/80">
              {t("Kết nối với bạn bè và chia sẻ những điều thú vị")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
