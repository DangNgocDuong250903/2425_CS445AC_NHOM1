import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Loading, TextInput } from "~/components";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {};

  return (
    <div className="w-full h-[100vh] flex bg-bgColor items-center justify-center p-6 ">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 pb-8 pt-6 shadow-newFeed rounded-xl border-x-[0.8px] border-y-[0.8px] border-solid border-borderNewFeed">
        <div
          className="w-8 h-8 mb-5 rounded-lg bg-blue flex items-center justify-center hover:scale-110 cursor-pointer transition-transform"
          onClick={() => navigate("/login")}
        >
          <FaArrowLeft color="#fff" />
        </div>
        <p className="text-ascent-1 text-lg font-semibold">
          {t("Địa chỉ email")}
        </p>
        <span className="text-sm text-ascent-2">
          {t("Nhập địa chỉ email đã sử dụng để đăng ký")}
        </span>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-4 flex flex-col gap-5"
        >
          <TextInput
            name="email"
            placeholder="email@example.com"
            label={t("Địa chỉ email")}
            type="email"
            register={register("email", {
              required: t("Địa chỉ email là bắt buộc"),
            })}
            styles="w-full rounded-lg"
            labelStyles="ml-2"
            error={errors.email ? errors.email.message : ""}
          />
          {errMsg?.message && (
            <span
              role="alert"
              className={`text-sm ${
                errMsg?.status === "failed"
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
            <Button
              type="submit"
              containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm text-white font-medium outline-none`}
              title={t("Xác nhận")}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
