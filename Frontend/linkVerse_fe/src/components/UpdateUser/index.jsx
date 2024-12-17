import React, { useEffect, useState } from "react";
import { Button, DialogCustom, TextInput } from "..";
import { useSelector } from "react-redux";
import { getBase64 } from "~/utils";
import { useMutationHook } from "~/hooks/useMutationHook";
import { ImUserPlus } from "react-icons/im";
import { Divider, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LiaEditSolid } from "react-icons/lia";
import styled from "@emotion/styled";

const UpdateUser = ({ profile, profileCard }) => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.theme);
  const { t } = useTranslation();
  const [show, setShow] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState("");
  const [bio, setBio] = useState("");

  const handleDialog = () => {
    setShow((prev) => !prev);
  };

  const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiInput-root": {
      color: theme === "dark" ? "#fff" : "#000",
      "&:before": {
        display: "none",
      },
      "&:after": {
        display: "none",
      },
      ":hover:not(.Mui-focused)": {
        color: "",
        "&:before": {
          display: "none",
        },
      },
    },
    "& .MuiInputLabel-standard": {
      color: "rgb(89, 91, 100)",
      "&.Mui-focused": {
        display: "none",
      },
    },
  }));

  useEffect(() => {
    setLastName(user?.lastName);
    setFirstName(user?.firstName);
    setAvatar(user?.avatar);
    setProfession(user?.profession);
    setAddress(user?.address);
    setBio(user?.bio);
    setEmail(user?.email);
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

  const handleChangeProfession = (e) => {
    setProfession(e.target.value);
  };

  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleChangeAvatar = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setAvatarFile(selectedFile);
    }
  };
  const handleChangeBio = (e) => {
    setBio(e.target.value);
  };

  useEffect(() => {
    if (avatarFile) {
      getBase64(avatarFile)
        .then((result) => setAvatar(result))
        .catch((error) => console.error(error));
    }
  }, [avatarFile]);

  const mutation = useMutationHook((data) => UserService.update(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      console.log("success");
    } else if (isError) {
      console.log("error");
    }
  }, [isSuccess, isError]);

  const handleSubmitChange = () => {
    const data = {
      token: user?.token,
      id: user?.id,
      lastName,
      firstName,
      avatar,
      email,
      profession,
      address,
      avatar,
      bio,
    };
    mutation.mutate(data);
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
                <h1 className="text-ascent-2 font-medium">Full name</h1>
                <div className="flex">
                  <TextInput
                    onChange={handleChangeFirstName}
                    value={firstName}
                    styles="border-0 bg-transparent px-0 pl-0 text-ascent-2"
                    labelStyles="font-medium"
                  />
                  <TextInput
                    onChange={handleChangeLastName}
                    value={lastName}
                    styles="border-0 bg-transparent px-0 pl-0 text-ascent-2"
                    labelStyles="font-medium"
                  />
                </div>
              </div>

              <div className="relative group w-14 h-14">
                {avatar ? (
                  <div className="w-full h-full">
                    <img
                      src={avatar}
                      alt="avatar"
                      className="rounded-full relative object-cover bg-no-repeat w-full h-full"
                    />
                    <div className="flex items-center justify-center w-full h-full absolute top-0">
                      <label
                        htmlFor="imgUpload"
                        className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                      >
                        <input
                          type="file"
                          onChange={handleChangeAvatar}
                          className="hidden"
                          id="imgUpload"
                          data-max-size="5120"
                          accept=".jpg, .png, .jpeg"
                        />
                        <ImUserPlus
                          size={20}
                          className=" duration-300 transition-opacity opacity-0 hover:opacity-100 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#ccc] flex items-center justify-center cursor-pointer">
                    <label
                      htmlFor="imgUpload"
                      className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                    >
                      <input
                        type="file"
                        onChange={handleChangeAvatar}
                        className="hidden"
                        id="imgUpload"
                        data-max-size="5120"
                        accept=".jpg, .png, .jpeg"
                      />
                      <ImUserPlus size={20} />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <Divider sx={{ borderColor: "#ccc" }} />

            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col">
                <h1 className="text-ascent-2 font-medium">Tiểu sử</h1>
                <StyledTextField
                  value={bio}
                  placeholder="Viết tiểu sử"
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
                <h1 className="text-ascent-2 font-medium">Email</h1>
                <StyledTextField
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
                <h1 className="text-ascent-2 font-medium">User name</h1>
                <StyledTextField
                  // value={email}
                  // onChange={handleChangeEmail}
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
                <h1 className="text-ascent-2 font-medium">Address</h1>
                <StyledTextField
                  value={address}
                  placeholder="Thêm địa chỉ"
                  onChange={handleChangeAddress}
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
                <h1 className="text-ascent-2 font-medium">Profession</h1>
                <StyledTextField
                  value={profession}
                  placeholder="Thêm công việc"
                  onChange={handleChangeProfession}
                  multiline
                  maxRows={5}
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>

            <Button
              title={"Xong"}
              onClick={handleSubmitChange}
              containerStyles="w-full bg-bgStandard flex items-center justify-center py-3 border-x-[0.8px] border-y-[0.8px] border-borderNewFeed rounded-xl font-medium text-white"
            />
          </div>
        </div>
      </DialogCustom>
    </>
  );
};

export default UpdateUser;
