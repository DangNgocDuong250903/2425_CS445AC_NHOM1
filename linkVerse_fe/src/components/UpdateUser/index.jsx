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

  const handleDialog = () => {
    setShow((prev) => !prev);
  };

  useEffect(() => {
    setLastName(user?.lastName || "");
    setFirstName(user?.firstName || "");
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
            "text-ascent-1 w-full py-2 border border-borderNewFeed rounded-xl flex items-center justify-center font-medium"
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
        theme={theme}
        handleCloseDiaLogAdd={handleDialog}
      >
        <div
          className={`w-full ${
            theme === "dark" ? "bg-[rgb(24,24,24)]" : "bg-white"
          } shadow-newFeed`}
        >
          <div className="flex w-full flex-col px-8 py-3">
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col">
                <h1 className="text-ascent-2 font-medium">First name</h1>
                <input
                  className="border-none focus:outline-none"
                  value={firstName}
                  onChange={handleChangeFirstName}
                  multiline
                  maxRows={5}
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>

            <Divider sx={{ borderColor: "#ccc" }} />

            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col">
                <h1 className="text-ascent-2 font-medium">Last name</h1>
                <input
                  className="border-none focus:outline-none"
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

            <div className="flex items-center w-full justify-between py-3">
              <div className="flex w-full flex-col">
                <h1 className="text-ascent-2 font-medium">Email</h1>
                <input
                  className="border-none focus:outline-none"
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
                <h1 className="text-ascent-2 font-medium">Phone number</h1>
                <input
                  className="border-none focus:outline-none"
                  value={phoneNumber}
                  placeholder="Thêm số điện thoại"
                  onChange={handleChangePhoneNumber}
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
                <h1 className="text-ascent-2 font-medium">City</h1>
                <input
                  className="border-none focus:outline-none"
                  value={city}
                  placeholder="Thêm thành phố"
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
                title={"Xong"}
                disable={isPending}
                onClick={handleSubmitChange}
                containerStyles="w-full hover:bg-[#F3F8FE] hover:text-black bg-bgStandard flex items-center justify-center py-3 border-x-[0.8px] border-y-[0.8px] border-borderNewFeed rounded-xl font-medium text-white"
              />
              {isPending && (
                <CircularProgress
                  className="absolute top-1/2 left-1/2"
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
