import React from "react";
import { NoProfile } from "~/assets";

const Story = ({ item }) => {
  return (
    <>
      <img
        src={NoProfile}
        alt="User Image"
        className="w-16 h-16 rounded-full object-cover border-2  border-[#0444A4] shadow-newFeed"
      />
    </>
  );
};

export default Story;
