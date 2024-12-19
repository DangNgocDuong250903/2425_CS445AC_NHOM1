import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "..";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as UserService from "~/services/UserService";
import { resetUser } from "~/redux/Slices/userSlice";
import { CircularProgress, MenuItem } from "@mui/material";
import { FaRegTrashCan } from "react-icons/fa6";
import { useMutationHook } from "~/hooks/useMutationHook";

const Logout = ({ second, primary }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const mutation = useMutationHook((token) => UserService.logout(token));

  const { data, isPending, isSuccess, isError } = mutation;

  const handleLogOut = () => {
    const token = localStorage.getItem("token");
    mutation.mutate(token);
    // await UserService.logout(user?.token);
    dispatch(resetUser());
    localStorage.removeItem("token");
    localStorage.removeItem("sentiment");
    navigate("/login");
  };
  return (
    <>
      {second && (
        <MenuItem onClick={handleLogOut}>
          <div className="flex items-center justify-between w-full">
            <span className="text-red-600">Log out</span>
            <FaRegTrashCan color="red" />
          </div>
        </MenuItem>
      )}
      {primary && (
        <div>
          {user?.token ? (
            <>
              <div className="relative">
                <Button
                  onClick={handleLogOut}
                  title={t("Đăng xuất")}
                  disable={isPending}
                  containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border-x-[0.8px] border-y-[0.8px] border-solid shadow-newFeed rounded-full border-borderNewFeed"
                />

                {isPending && (
                  <CircularProgress
                    className="absolute top-3 right-12"
                    size={18}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="relative inline-flex  group">
              <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <span
                onClick={() => navigate("/login")}
                className="relative inline-flex items-center justify-center px-4 md:px-6 py-1 md:py-2 text-sm text-white transition-all duration-200 bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button"
              >
                {t("Đăng nhập")}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Logout;
