import React, { useState } from "react";
import { DragToScroll } from "..";
import { BsFillPlusCircleFill } from "react-icons/bs";
import CreateStory from "../CreateStory";

const Story = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {/* story */}
      <CreateStory open={open} handleClose={handleClose} />

      <div className="flex w-full px-1 justify-center items-center">
        <div className="w-20 h-full flex justify-center relative mr-4">
          {/* <img
            src={BlankAvatar}
            alt="User Image"
            className="w-14 h-14 rounded-full object-cover shadow-newFeed"
          />
          <BsFillPlusCircleFill
            className="absolute rounded-full cursor-pointer bottom-2 right-2"
            color="#0444A4"
            onClick={() => {
              setOpen(true);
            }}
          /> */}
          <ul class="flex space-x-6">
            <li class="flex flex-col items-center space-y-1 ">
              <div class="relative bg-gradient-to-tr from-yellow-400 to-purple-600 p-1 rounded-full">
                <a
                  href="#"
                  class="block bg-white p-1 rounded-full transform transition hover:-rotate-6"
                >
                  <img
                    class="w-14 h-14 rounded-full"
                    src="https://placekitten.com/200/200"
                  />
                </a>
                <button class="absolute bg-blue-500 text-white text-2xl font-medium w-8 h-8 rounded-full bottom-0 right-1 border-4 border-white flex justify-center items-center font-mono hover:bg-blue-700 focus:outline-none">
                  <div class="transform -translate-y-px">
                    <BsFillPlusCircleFill
                      color="blue"
                      onClick={() => {
                        setOpen(true);
                      }}
                    />
                  </div>
                </button>
              </div>

              <a href="#">kitty_one</a>
            </li>
          </ul>
        </div>
        <DragToScroll className={"gap-5 flex "}>
          {/* <div class="max-w-2xl mx-auto p-8"> */}
          {/* <ul class="flex space-x-6">
            <li class="flex flex-col items-center space-y-1 ">
              <div class="relative bg-gradient-to-tr from-yellow-400 to-purple-600 p-1 rounded-full">
                <a
                  href="#"
                  class="block bg-white p-1 rounded-full transform transition hover:-rotate-6"
                >
                  <img
                    class="w-24 h-24 rounded-full"
                    src="https://placekitten.com/200/200"
                    alt="cute kitty"
                  />
                </a>
                <button class="absolute bg-blue-500 text-white text-2xl font-medium w-8 h-8 rounded-full bottom-0 right-1 border-4 border-white flex justify-center items-center font-mono hover:bg-blue-700 focus:outline-none">
                  <div class="transform -translate-y-px">
                    <BsFillPlusCircleFill color="blue" />
                  </div>
                </button>
              </div>

              <a href="#">kitty_one</a>
            </li>
          </ul> */}
          <ul class="flex space-x-6">
            {/* <li class="flex flex-col items-center space-y-1 ">
              <div class="relative bg-gradient-to-tr from-yellow-400 to-purple-600 p-1 rounded-full">
                <a
                  href="#"
                  class="block bg-white p-1 rounded-full transform transition hover:-rotate-6"
                >
                  <img
                    class="w-24 h-24 rounded-full"
                    src="https://placekitten.com/200/200"
                    alt="cute kitty"
                  />
                </a>
                <button class="absolute bg-blue-500 text-white text-2xl font-medium w-8 h-8 rounded-full bottom-0 right-1 border-4 border-white flex justify-center items-center font-mono hover:bg-blue-700 focus:outline-none">
                  <div class="transform -translate-y-px">
                    <BsFillPlusCircleFill color="blue" />
                  </div>
                </button>
              </div>

              <a href="#">kitty_one</a>
            </li> */}

            {/* <li class="flex flex-col items-center space-y-1 ">
              <div class="bg-gradient-to-tr from-yellow-400 to-purple-600 p-1 rounded-full">
                <a
                  href="#"
                  class="block bg-white p-1 rounded-full transform transition hover:-rotate-6"
                >
                  <img
                    class="w-24 h-24 rounded-full"
                    src="https://placekitten.com/201/200"
                    alt="cute kitty"
                  />
                </a>
              </div>

              <a href="#">kitty_two</a>
            </li>

            <li class="flex flex-col items-center space-y-1 ">
              <div class="bg-gradient-to-tr from-yellow-400 to-purple-600 p-1 rounded-full">
                <a
                  href="#"
                  class="block bg-white p-1 rounded-full transform transition hover:-rotate-6"
                >
                  <img
                    class="w-24 h-24 rounded-full"
                    src="https://placekitten.com/200/203"
                    alt="cute kitty"
                  />
                </a>
              </div>

              <a href="#">kitty_three</a>
            </li>

            <li class="flex flex-col items-center space-y-1 ">
              <div class="bg-gradient-to-tr from-yellow-400 to-purple-600 p-1 rounded-full">
                <a
                  href="#"
                  class="block bg-white p-1 rounded-full transform transition hover:-rotate-6"
                >
                  <img
                    class="w-24 h-24 rounded-full"
                    src="https://placekitten.com/202/201"
                    alt="cute kitty"
                  />
                </a>
              </div>

              <a href="#">kitty_four</a>
            </li> */}
          </ul>
          {/* </div> */}
        </DragToScroll>
      </div>
    </>
  );
};

export default Story;
