import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, TextInput } from "~/components";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as UserService from "~/services/UserService";
import { CircularProgress } from "@mui/material";
import { FaCircleExclamation } from "react-icons/fa6";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [errMsg, setErrMsg] = useState("");
  const [searchParams] = useSearchParams();
  const [hidePass, setHidePass] = useState("hide");
  const [hideConfirm, setHideConfirm] = useState("hide");
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const mutation = useMutationHook(({ password, token }) =>
    UserService.resetPassword({ password, token })
  );
  const { data, isPending, isError, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    } else if (isError) {
      setErrMsg("Something went wrong!");
    }
  }, [isSuccess, isError]);

  const onSubmit = async (data) => {
    mutation.mutate({ password: data.password, token });
  };

  return (
    <div className="w-full h-[100vh] flex bg-bgColor items-center justify-center p-6 ">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 pb-8 pt-6 shadow-newFeed rounded-xl border-x-[0.8px] border-y-[0.8px] border-solid border-borderNewFeed">
        <div
          className="w-8 h-8 mb-5 rounded-lg bg-blue flex items-center justify-center hover:scale-110 cursor-pointer transition-transform"
          onClick={() => navigate("/forgot-password")}
        >
          <FaArrowLeft color="#fff" />
        </div>
        <p className="text-ascent-1 text-lg font-semibold">Reset password</p>
        <span className="text-sm text-ascent-2">Type new password</span>

        <form onSubmit={handleSubmit(onSubmit)} className="py-4 flex flex-col">
          <TextInput
            name="password"
            placeholder="New Password"
            label={t("New Password")}
            type={hidePass === "hide" ? "password" : "text"}
            register={register("password", {
              required: t("Mật khẩu là bắt buộc"),
              validate: {
                noSpaces: (value) =>
                  !/\s/.test(value) || "Password must not contain spaces.",
              },
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
            })}
            iconRight={
              errors.password ? (
                <FaCircleExclamation color="red" />
              ) : hidePass === "hide" ? (
                <IoMdEyeOff
                  className="cursor-pointer"
                  onClick={() => setHidePass("show")}
                />
              ) : (
                <IoMdEye
                  className="cursor-pointer"
                  onClick={() => setHidePass("hide")}
                />
              )
            }
            iconRightStyles="right-5"
            styles={`w-full rounded-md ${
              errors.password ? "border-red-600" : ""
            }`}
            toolTip={errors.password ? errors.password?.message : ""}
            labelStyles="ml-2"
          />

          <TextInput
            name="cPassword"
            placeholder="Confirm New Password"
            label="Confirm New Password"
            type={hideConfirm === "hide" ? "password" : "text"}
            register={register("cPassword", {
              validate: (value) => {
                const { password } = getValues();

                if (password != value) {
                  return "New Passwords do not match";
                }
              },
            })}
            iconRight={
              errors.cPassword ? (
                <FaCircleExclamation color="red" />
              ) : hideConfirm === "hide" ? (
                <IoMdEyeOff
                  className="cursor-pointer"
                  onClick={() => setHideConfirm("show")}
                />
              ) : (
                <IoMdEye
                  className="cursor-pointer"
                  onClick={() => setHideConfirm("hide")}
                />
              )
            }
            iconRightStyles="right-5"
            styles={`w-full rounded-md  ${
              errors.cPassword ? "border-red-600" : ""
            }`}
            toolTip={errors.cPassword ? errors.cPassword?.message : ""}
            labelStyles="ml-2"
          />

          {errMsg && (
            <span className={`text-sm mt-0.5 text-red-600`}>{errMsg}</span>
          )}

          <div className="relative">
            <Button
              disable={isPending || !isValid}
              type="submit"
              containerStyles={`inline-flex w-full justify-center rounded-md bg-blue px-8 py-3 text-sm text-white font-medium outline-none mt-3`}
              title={t("Xác nhận")}
            />
            {isPending && (
              <CircularProgress
                className="absolute top-1/2 left-1/2"
                size={20}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
