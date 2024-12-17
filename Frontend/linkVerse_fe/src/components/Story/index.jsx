import React from "react";
import { BlankAvatar } from "~/assets";
import { DragToScroll } from "..";
import { BsFillPlusCircleFill } from "react-icons/bs";

const Story = ({ item }) => {
  return (
    <>
      {/* <img
        src={BlankAvatar}
        alt="User Image"
        className="w-16 h-16 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
      /> */}

      {/* story */}
      <div className="flex w-full p-3 justify-center items-center">
        <div className="w-20 h-full flex justify-center relative mr-4">
          <img
            src={user?.profileUrl}
            alt="User Image"
            className="w-16 h-16 rounded-full object-cover shadow-newFeed border-1 border-borderNewFeed"
          />
          <BsFillPlusCircleFill
            className="absolute bottom-0 right-0"
            color="#0444A4"
          />
        </div>
        <DragToScroll className={"gap-5 flex justify-center items-center"}>
          {/* {items.map((item, i) => (
                      <Story key={i} item={item} />
                    ))} */}
        </DragToScroll>
      </div>
    </>
  );
};

export default Story;
