import React, { useEffect, useState } from "react";
import { Button, DialogCustom } from "..";
import { useSelector } from "react-redux";
import { useMutationHook } from "~/hooks/useMutationHook";
import { CircularProgress, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LiaEditSolid } from "react-icons/lia";
import * as UserService from "~/services/UserService";

const UpdateUser = ({ profile, profileCard, onSuccess }) => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.theme);
  const { t } = useTranslation();
  const [show, setShow] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const token = localStorage.getItem("token");
  const [bio, setBio] = useState("");

  const handleDialog = () => {
    setShow((prev) => !prev);
  };

  useEffect(() => {
    setLastName(user?.lastName || "");
    setFirstName(user?.firstName || "");
    setBio(user?.bio || "");
    setEmail(user?.email || "");
    setCity(user?.city || "");
    setPhoneNumber(user?.phoneNumber || "");
  }, [user]);

  const handleChangeFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const handleChangeLastName = (e) => {
    setLastName(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleChangeCity = (e) => {
    setCity(e.target.value);
  };

  const handleChangeBio = (e) => {
    setBio(e.target.value);
  };

  const mutation = useMutationHook(({ token, data }) =>
    UserService.update({ token, data })
  );
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      setShow(false);
      // onSuccess();
    } else if (isError) {
      console.log("error");
    }
  }, [isSuccess, isError]);

  const handleSubmitChange = () => {
    const data = {
      lastName,
      firstName,
      bio,
      email,
      city,
      phoneNumber,
    };
    mutation.mutate({ token, data });
  };
  return (
    <>
      {profile && (
        <Button
          onClick={handleDialog}
          title={t("Chỉnh sửa trang cá nhân")}
          containerStyles={
            "text-ascent-1 w-full active:scale-90 transition-transform py-2 border border-borderNewFeed rounded-xl flex items-center justify-center font-medium"
          }
        />
      )}

      {profileCard && (
        <LiaEditSolid
          size={22}
          className="text-blue cursor-pointer"
          onClick={handleDialog}
        />
      )}

      <DialogCustom
        isOpen={show}
        width="510px"
        theme={theme}
        handleCloseDiaLogAdd={handleDialog}
      >
        <div className="w-full shadow-newFeed bg-primary">
          <div className="flex w-full flex-col px-8 py-3">
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col">
                <h1 className="text-black font-semibold text-base">
                  {t("Họ")}
                </h1>
                <input
                  className="border-none text-ascent-2 text-sm focus:outline-none bg-transparent"
                  value={firstName}
                  onChange={handleChangeFirstName}
                  multiline
                  maxRows={5}
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>

            <Divider />

            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col">
                <h1 className="text-black font-semibold">{t("Tên")}</h1>
                <input
                  className="border-none text-ascent-2 text-sm bg-transparent focus:outline-none"
                  value={lastName}
                  onChange={handleChangeLastName}
                  multiline
                  maxRows={5}
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>

            <Divider sx={{ borderColor: "#ccc" }} />

            <div className="flex items-center   w-full justify-between py-3">
              <div className="flex w-full flex-col">
                <h1 className="text-black font-semibold">{t("Tiểu sử")}</h1>
                <input
                  className="border-none text-ascent-2 text-sm bg-transparent focus:outline-none"
                  value={bio}
                  placeholder={t("Thêm tiểu sử")}
                  onChange={handleChangeBio}
                  multiline
                  maxRows={5}
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>

            <Divider sx={{ borderColor: "#ccc" }} />

            <div className="flex items-center w-full justify-between py-3">
              <div className="flex w-full flex-col">
                <h1 className="text-black font-semibold">Email</h1>
                <input
                  className="border-none text-ascent-2 text-sm bg-transparent focus:outline-none"
                  value={email}
                  onChange={handleChangeEmail}
                  multiline
                  maxRows={5}
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>

            <Divider sx={{ borderColor: "#ccc" }} />

            <div className="flex items-center w-full justify-between py-3">
              <div className="flex w-full flex-col">
                <h1 className="text-black font-semibold">
                  {t("Số điện thoại")}
                </h1>
                <input
                  className="border-none text-ascent-2 text-sm bg-transparent focus:outline-none"
                  value={phoneNumber}
                  placeholder={t("Thêm số điện thoại")}
                  onChange={handleChangePhoneNumber}
                  multiline
                  maxRows={5}
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>

            <Divider sx={{ borderColor: "#ccc" }} />

            <div className="flex items-center  w-full justify-between py-3">
              <div className="flex w-full flex-col">
                <h1 className="text-black font-semibold">{t("Địa chỉ")}</h1>
                <input
                  className="border-none text-ascent-2 text-sm bg-transparent focus:outline-none"
                  value={city}
                  placeholder={t("Thêm địa chỉ")}
                  onChange={handleChangeCity}
                  multiline
                  maxRows={5}
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>

            <div className="relative">
              <Button
                title={t("Cập nhật")}
                disable={isPending}
                onClick={handleSubmitChange}
                containerStyles="w-full active:scale-90 hover:bg-[#F3F8FE] hover:text-black bg-bgStandard flex items-center justify-center py-3 border-x-[0.8px] border-y-[0.8px] border-borderNewFeed rounded-xl font-medium text-white"
              />
              {isPending && (
                <CircularProgress
                  className="absolute top-4 right-52"
                  size={20}
                />
              )}
            </div>
          </div>
        </div>
      </DialogCustom>
    </>
  );
};

export default UpdateUser;
