import { TextInput, Loading, Button as CustomButton } from "~/components";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BgImage } from "~/assets";
import { BsShare } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { AiOutlineInteraction } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as UserService from "~/services/UserService";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [hide, setHide] = useState("hide");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const mutation = useMutationHook((data) => UserService.register(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      console.log("bu");
    } else if (isError) {
      console.log("an l");
    }
  }, [isSuccess, isError]);

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl">
        {/* trai */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center ">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-1 rounded text-white">
              <svg
                width="50px"
                height="50px"
                viewBox="-5.28 -5.28 34.56 34.56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffff"
              >
                <g
                  id="SVGRepo_bgCarrier"
                  strokeWidth={0}
                  transform="translate(0,0), scale(1)"
                >
                  <rect
                    x="-5.28"
                    y="-5.28"
                    width="34.56"
                    height="34.56"
                    rx="17.28"
                    fill="#000"
                    strokeWidth={0}
                  />
                </g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#CCCCCC"
                  strokeWidth="4.8"
                >
                  <path
                    d="M15.8571 12C15.8571 14.1303 14.1302 15.8572 12 15.8572C9.86972 15.8572 8.14282 14.1303 8.14282 12C8.14282 9.86979 9.86972 8.14288 12 8.14288C14.1302 8.14288 15.8571 9.86979 15.8571 12ZM15.8571 12L15.8571 13.2857C15.8571 14.7059 17.0084 15.8571 18.4286 15.8571C19.3408 15.8571 20.1422 15.3821 20.5986 14.6658C20.8528 14.2671 21 13.7936 21 13.2857V12C21 9.3345 19.8412 6.93964 18 5.29168M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C13.9122 21 15.6851 20.4037 17.1429 19.3868"
                    stroke="#fffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M15.8571 12C15.8571 14.1303 14.1302 15.8572 12 15.8572C9.86972 15.8572 8.14282 14.1303 8.14282 12C8.14282 9.86979 9.86972 8.14288 12 8.14288C14.1302 8.14288 15.8571 9.86979 15.8571 12ZM15.8571 12L15.8571 13.2857C15.8571 14.7059 17.0084 15.8571 18.4286 15.8571C19.3408 15.8571 20.1422 15.3821 20.5986 14.6658C20.8528 14.2671 21 13.7936 21 13.2857V12C21 9.3345 19.8412 6.93964 18 5.29168M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C13.9122 21 15.6851 20.4037 17.1429 19.3868"
                    stroke="#fffff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
            <span className="text-2xl text-[#065ad8] font-semibold">
              LinkVerse
            </span>
          </div>

          <p className="text-ascent-1 text-base font-semibold">
            {t("Tạo tài khoản")}
          </p>

          <form
            className="py-8 flex flex-col gap-5="
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="firstName"
                label="First Name"
                placeholder="First Name"
                type="text"
                styles="w-full"
                register={register("firstName", {
                  required: "First Name is required!",
                })}
                error={errors.firstName ? errors.firstName?.message : ""}
              />

              <TextInput
                label="Last Name"
                placeholder="Last Name"
                type="lastName"
                styles="w-full"
                register={register("lastName", {
                  required: "Last Name do no match",
                })}
                error={errors.lastName ? errors.lastName?.message : ""}
              />
            </div>

            <TextInput
              name="email"
              placeholder="email@example.com"
              label={t("Địa chỉ email")}
              type="email"
              register={register("email", {
                required: t("Địa chỉ email là bắt buộc"),
              })}
              styles="w-full"
              error={errors.email ? errors.email.message : ""}
            />

            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="password"
                label="Password"
                placeholder={t("Mật khẩu")}
                type={hide === "hide" ? "password" : "text"}
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
                styles="w-full"
                register={register("password", {
                  required: t("Mật khẩu là bắt buộc"),
                })}
                error={errors.password ? errors.password?.message : ""}
              />

              <TextInput
                label="Confirm Password"
                placeholder="Password"
                type={hide === "hide" ? "password" : "text"}
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
                styles="w-full mb-2"
                register={register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();

                    if (password != value) {
                      return "Passwords do no match";
                    }
                  },
                })}
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>

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
                containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title={t("Đăng ký")}
              />
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            {t("Đã có tài khoản")} ?{" "}
            <Link
              to="/login"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
            >
              {t("Đăng nhập")}
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

            <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
              <BsShare size={14} />
              <span className="text-xs font-medium">{t("Chia sẻ")}</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
              <ImConnection />
              <span className="text-xs font-medium">{t("Kết nối")}</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full">
              <AiOutlineInteraction />
              <span className="text-xs font-medium">{t("Tương tác")}</span>
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
