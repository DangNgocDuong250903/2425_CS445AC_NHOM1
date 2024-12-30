import { useEffect, useState } from "react";
import { WrapperModal } from "./style";
import { FaEarthAmericas } from "react-icons/fa6";
import { Button } from "..";
import { BiSolidLockAlt } from "react-icons/bi";
import * as PostService from "~/services/PostService";

const ChangeVisibility = ({ openChange, handleClose, closeMenu, post }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [checked, setChecked] = useState(!post?.visibility);

  useEffect(() => {
    if (openChange) {
      closeMenu();
    }
  }, [openChange, closeMenu]);

  const handleChecked = () => {};

  const handleChangeVisibility = async () => {
    setLoading(true);
    try {
      const res = await PostService.changeVisibility({ id, token, visibility });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperModal
      centered
      footer
      open={openChange}
      onCancel={handleClose}
      closable={false}
    >
      <div
        className="shadow-newFeed w-full bg-primary rounded-3xl"
        style={{
          backgroundImage: "url(/group.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* header */}
        <div className="w-full flex items-center justify-center gap-5 px-5 py-4">
          <span className="text-lg font-semibold text-ascent-1">
            Change visibility
          </span>
        </div>
        <div className="w-full border-t-[0.1px] border-borderNewFeed" />
        {/* body */}
        <div className="w-full flex flex-col py-2 gap-y-2">
          {/* 1 */}
          <div
            onClick={handleChecked}
            className="w-full flex items-center justify-between p-5 hover:opacity-80 opacity-100 cursor-pointer"
          >
            <div className="w-full flex items-center gap-4">
              <FaEarthAmericas size={30} />
              <div className="w-full flex flex-col">
                <span className="font-semibold text-ascent-1">PUBLIC</span>
                <span className="text-xs text-ascent-2">
                  Ai cung co the thay
                </span>
              </div>
            </div>
            <input type="radio" name="visibility" id="" className="w-5 h-5" />
          </div>
        </div>
        {/* footer */}
        <div className="w-full flex justify-end p-5">
          <Button
            type="submit"
            title="Xong"
            containerStyles="bg-bgColor relative text-ascent-1 px-5 py-3 rounded-xl border-borderNewFeed border-1 font-semibold text-sm shadow-newFeed"
          />
        </div>
        <div></div>
      </div>
    </WrapperModal>
  );
};

export default ChangeVisibility;
