import { TextInput, Button as CustomButton } from "~/components";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BsShare } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { AiOutlineInteraction } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as UserService from "~/services/UserService";
import { FaCircleExclamation } from "react-icons/fa6";
import { CircularProgress } from "@mui/material";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [hide, setHide] = useState("hide");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const mutation = useMutationHook((data) => UserService.register(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      navigate("/login", { state: data?.message?.metaData?.metadata });
    } else if (isError) {
      setErrMsg("Email or username is already registered");
    }
  }, [isSuccess, isError]);

  const onSubmit = async (data) => {
    const { dateOfBirth } = data;
    const [year, month, day] = dateOfBirth.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    const newData = { ...data, dateOfBirth: formattedDate };
    mutation.mutate(newData);
  };

  return (
    <div className="bg-bgColor  w-full h-[100vh] flex items-center justify-center p-6">
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
                toolTip={errors.firstName ? errors.firstName.message : ""}
                register={register("firstName", {
                  required: "First name is required!",
                  minLength: {
                    value: 1,
                    message: "First name must be at least 1 character long!",
                  },
                  maxLength: {
                    value: 50,
                    message: "First name cannot exceed 50 characters",
                  },
                })}
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
                  minLength: {
                    value: 1,
                    message: "Last name must be at least 1 character long!",
                  },
                  maxLength: {
                    value: 50,
                    message: "Last name cannot exceed 50 characters",
                  },
                })}
              />
            </div>

            <div className="w-full flex flex-col  lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="username"
                label="User Name"
                placeholder="User Name"
                type="text"
                styles={`w-full h-10 ${
                  errors.username ? "border-red-600" : ""
                }`}
                iconRight={
                  errors.username ? <FaCircleExclamation color="red" /> : ""
                }
                toolTip={errors.username ? errors.username.message : ""}
                register={register("username", {
                  required: "User name is required!",
                  minLength: {
                    value: 1,
                    message: "User name must be at least 4 character long!",
                  },
                  maxLength: {
                    value: 50,
                    message: "User name cannot exceed 20 characters",
                  },
                  validate: {
                    noSpaces: (value) =>
                      !/\s/.test(value) || "User name must not contain spaces.",
                  },
                })}
              />

              <TextInput
                name="dateOfBirth"
                type="date"
                label="Ngày sinh"
                styles={`w-full h-10 ${
                  errors.dateOfBirth ? "border-red-600" : ""
                }`}
                register={register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
                toolTipInput={
                  errors.dateOfBirth ? errors.dateOfBirth?.message : ""
                }
              />
            </div>

            {/* gender */}
            <div className="w-full flex flex-col mt-2">
              <p className="text-ascent-2 text-sm mb-2">Gender</p>

              <div className="w-full h-10 flex flex-col lg:flex-row gap-1 md:gap-2">
                <div
                  className={`flex w-full items-center justify-between bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-2.5 ${
                    errors.gender ? "border-red-600" : ""
                  }`}
                >
                  <label className="text-ascent-1" htmlFor="male">
                    Male
                  </label>
                  <input
                    type="radio"
                    id="male"
                    value="male"
                    {...register("gender", { required: "Gender is required" })}
                  />
                </div>

                <div
                  className={`flex w-full items-center justify-between bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-2.5 ${
                    errors.gender ? "border-red-600" : ""
                  }`}
                >
                  <label className="text-ascent-1" htmlFor="female">
                    Female
                  </label>
                  <input
                    type="radio"
                    id="female"
                    value="female"
                    {...register("gender", { required: "Gender is required" })}
                  />
                </div>

                <div
                  className={`flex w-full items-center justify-between bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-2.5 ${
                    errors.gender ? "border-red-600" : ""
                  }`}
                >
                  <label className="text-ascent-1" htmlFor="other">
                    Other
                  </label>
                  <input
                    type="radio"
                    id="other"
                    value="other"
                    {...register("gender", { required: "Gender is required" })}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col  lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="email"
                placeholder="email@ex.com"
                label={t("Địa chỉ email")}
                type="email"
                register={register("email", {
                  required: t("Địa chỉ email là bắt buộc"),
                  validate: {
                    noSpaces: (value) =>
                      !/\s/.test(value) || "Email must not contain spaces.",
                  },
                })}
                styles={`w-full h-10 ${errors.email ? "border-red-600" : ""}`}
                iconRight={
                  errors.email ? <FaCircleExclamation color="red" /> : ""
                }
                toolTip={errors.email ? errors.email?.message : ""}
              />
              <TextInput
                name="phoneNumber"
                label="Phone Number"
                placeholder="Phone Number"
                type="text"
                styles={`w-full h-10 ${
                  errors.phoneNumber ? "border-red-600" : ""
                }`}
                iconRight={
                  errors.phoneNumber ? <FaCircleExclamation color="red" /> : ""
                }
                toolTip={errors.phoneNumber ? errors.phoneNumber.message : ""}
                register={register("phoneNumber", {
                  required: "Phone Number is required!",
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Phone Number is invalid",
                  },
                })}
              />
            </div>

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
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 character long!",
                },
                maxLength: {
                  value: 64,
                  message: "Password cannot exceed 65 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
                  message:
                    "Password must include uppercase, lowercase, a number, and a special character.",
                },
                validate: {
                  noSpaces: (value) =>
                    !/\s/.test(value) || "Password must not contain spaces.",
                },
              })}
            />

            {errMsg && (
              <span className={`text-sm mt-0.5 text-red-600`}>{errMsg}</span>
            )}

            <div className="relative">
              <CustomButton
                disable={isPending || !isValid}
                type="submit"
                containerStyles="w-full active:scale-90 mt-3 inline-flex justify-center rounded-md bg-[#065ad8] px-8 py-3 text-sm font-medium text-white outline-none hover:bg-[#065ad898] hover:text-black"
                title={t("Đăng ký")}
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
            {t("Đã có tài khoản")} ?{" "}
            <Link
              to="/login"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer hover:text-[#065ad898]"
            >
              {t("Đăng nhập")}
            </Link>
          </p>
        </div>
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue shadow-xl">
          <div className="relative w-full flex items-center justify-center">
            <img
              src="/register.jpeg"
              alt="bg"
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
