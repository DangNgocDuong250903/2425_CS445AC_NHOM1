import React, { useState } from "react";
import { BlankAvatar } from "~/assets";
import { DragToScroll } from "..";
import { BsFillPlusCircleFill } from "react-icons/bs";
import CreateStory from "../CreateStory";

const Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* story */}
      <div className="flex w-full px-1 justify-center items-center">
        <div className="w-20 h-full flex justify-center relative mr-4">
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover shadow-newFeed border-1 border-borderNewFeed"
          />
          <BsFillPlusCircleFill
            className="absolute rounded-full border-1 border-black bottom-2 right-2"
            color="#0444A4"
            onClick={() => {
              setOpen(true);
            }}
          />
          <CreateStory open={open} />
        </div>
        <DragToScroll className={"gap-5 flex justify-center items-center"}>
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
          <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
          />
        </DragToScroll>
      </div>
    </>
  );
};

export default Story;
