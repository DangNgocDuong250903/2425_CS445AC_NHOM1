import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Button, DialogCustom } from "..";
import { CircularProgress } from "@mui/material";
import * as UserService from "~/services/UserService";
import { BlankAvatar } from "~/assets";

const BlockList = ({ setting }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const token = localStorage.getItem("token");
  const [blocks, setBlocks] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingBlockList, setLoadingBlockList] = useState(false);
  const [loadingUnblock, setLoadingUnblock] = useState(false);

  const handleOpenBlockList = () => {
    setOpenBlockList(true);
  };

  //fetch block list
  const fetchBlockList = async (token) => {
    setLoadingBlockList(true);
    try {
      const res = await UserService.blockList(token);
      if (res?.length > 0) {
        setBlocks(res);
      }
    } catch (error) {
      console.error("Error fetching friends details:", error);
    } finally {
      setLoadingBlockList(false);
    }
  };

  useEffect(() => {
    fetchBlockList(token);
  }, [open]);

  //unBlock
  const handleUnblock = async (id) => {
    setLoadingUnblock(true);
    try {
      const res = await UserService.unBlock({ id, token });
      if (res?.status === "NONE") {
        setBlocks([]);
        fetchBlockList(token);
      }
    } catch (error) {
    } finally {
      setLoadingUnblock(false);
    }
  };

  return (
    <>
      {setting && (
        <IoIosArrowForward
          onClick={handleOpen}
          size={20}
          className="cursor-pointer"
        />
      )}
      <DialogCustom isOpen={open} handleCloseDiaLogAdd={handleClose}>
        <div className="w-full flex items-center justify-center flex-col">
          <div className="w-full py-5 px-5 flex items-center justify-center border-b">
            <span className="font-bold text-ascent-1 text-center">
              Block lists
            </span>
          </div>

          <div
            className={`w-full overflow-x-hidden ${
              isExpanded ? "max-h-full" : "max-h-96"
            } overflow-y-auto`}
          >
            {loadingBlockList ? (
              <div className="flex items-center justify-center py-5">
                <CircularProgress size={30} />
              </div>
            ) : blocks.length > 0 ? (
              blocks.map((block) => (
                <div
                  key={block?.userId}
                  className="w-full py-6 px-5 flex items-center justify-between border-b cursor-pointer hover:bg-[#F3F8FE]"
                >
                  <div className="flex items-center gap-x-5">
                    <img
                      src={block?.imageUrl ?? BlankAvatar}
                      alt="avatar"
                      className="w-10 h-10 object-cover bg-no-repeat"
                    />
                    <span className="font-semibold text-ascent-1">
                      {block?.username}
                    </span>
                  </div>
                  <div className="relative">
                    <Button
                      title="Bỏ chặn"
                      disable={loadingUnblock}
                      onClick={() => handleUnblock(block?.userId)}
                      containerStyles="border-1 rounded-xl hover:bg-[#FAFAFA] px-3 py-2 text-ascent-1 text-sm"
                    />
                    {loadingUnblock && (
                      <CircularProgress
                        size={18}
                        className="relative right-1/2 top-2"
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-5">
                <span className="text-ascent-1 text-center text-sm">
                  Chưa có ai trong danh sách chặn
                </span>
              </div>
            )}
          </div>

          <div
            className="w-full py-5 hover:bg-[#F3F8FE] cursor-pointer px-4 flex border-t items-center justify-center text-blue text-sm font-semibold"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "View less" : "View all"}
          </div>
        </div>
      </DialogCustom>
    </>
  );
};

export default BlockList;
