import { useState } from "react";
import { BlankAvatar } from "~/assets";

const GroupCard = ({ group }) => {
  return (
    <div className="flex gap-4 w-full justify-center items-center cursor-pointer">
      <div className="rounded-full cursor-pointer">
        <img
          class="w-12 h-12 rounded-full block object-cover bg-white p-[2px] transform transition hover:-rotate-6"
          src={group?.imageUrl || BlankAvatar}
        />
      </div>
      <div className="flex-1">
        <p className="text-base font-medium text-ascent-1">{group?.name}</p>
        <span className="text-sm text-ascent-2">{group?.description}</span>
      </div>
    </div>
  );
};

export default GroupCard;
