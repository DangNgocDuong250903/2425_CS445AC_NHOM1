import React, { useState } from "react";
import { DialogCustom } from "..";
import { CircularProgress } from "@mui/material";
import * as UserService from "~/services/UserService";
import { useNavigate } from "react-router-dom";

const Confirm = ({ open, handleClose, id }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //block
  const handleBlock = async () => {
    setLoading(true);
    try {
      const res = await UserService.block({ id, token });
      if (res) {
        navigate("/");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogCustom
      isOpen={open}
      width="250px"
      handleCloseDiaLogAdd={handleClose}
    >
      <div className="bg-primary w-full flex items-center flex-col">
        <span className="p-4">Bạn có chắc không?</span>
        <div className="flex w-full border-t items-center justify-between">
          <div
            onClick={handleClose}
            className="flex hover:bg-[#fafafa] cursor-pointer w-full  border-r items-center p-4 justify-center"
          >
            <span>Hủy</span>
          </div>
          <div
            onClick={handleBlock}
            className={`${
              loading && "bg-[#fafafa] text-[#ccc] cursor-not-allowed"
            } flex relative p-4 hover:bg-[#fafafa] cursor-pointer w-full items-center justify-center`}
          >
            <span>Chặn</span>
            {loading && <CircularProgress className="absolute" size={20} />}
          </div>
        </div>
      </div>
    </DialogCustom>
  );
};

export default Confirm;
