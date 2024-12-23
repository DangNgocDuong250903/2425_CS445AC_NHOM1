import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as UserService from "~/services/UserService";
import { CircularProgress } from "@mui/material";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

const VerifyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const data = searchParams.get("token");
  const token = localStorage.getItem("token");

  const verify = async ({ data, token }) => {
    setLoading(true);
    try {
      const res = await UserService.verify({ data, token });
      if (res?.code == 1000) {
        setSuccess(true);
        return;
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    verify({ data, token });
  };

  return (
    <div className="w-full h-[100vh] flex bg-bgColor items-center justify-center p-6 ">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 pb-8 pt-6 shadow-newFeed rounded-xl border-x-[0.8px] border-y-[0.8px] border-solid border-borderNewFeed">
        <div
          className="w-8 h-8 mb-5 rounded-lg bg-blue flex items-center justify-center hover:scale-110 cursor-pointer transition-transform"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft color="#fff" />
        </div>
        <div className="flex gap-5 flex-col">
          <p className="text-ascent-1 text-lg font-semibold">
            {t("Verify your email")}
          </p>
          <span className="text-sm text-ascent-2">
            {t("Click button to verify your email")}
          </span>
          {success && (
            <div className="w-full h-auto flex flex-col items-center justify-center gap-y-2 mt-4">
              <div className="w-full flex items-center justify-center">
                <IoCheckmarkCircleSharp size={40} color="#0DBC3D" />
              </div>
              <span className="text-ascent-1 text-sm">
                Email verified successfully!
              </span>
            </div>
          )}
          <div className="relative">
            <Button
              disable={loading}
              type="submit"
              containerStyles={`${
                success && "hidden"
              } inline-flex w-full justify-center rounded-md bg-blue px-8 py-3 text-sm text-white font-medium outline-none`}
              title={t("Xác nhận")}
              onClick={handleVerify}
            />
            {loading && (
              <CircularProgress className="absolute top-4 left-1/2" size={20} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
