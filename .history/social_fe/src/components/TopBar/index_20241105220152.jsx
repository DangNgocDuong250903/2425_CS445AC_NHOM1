import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "/logo.svg";
import { Button, TextInput } from "..";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { SetTheme } from "~/redux/Slices/theme";
import { Logout } from "~/redux/Slices/userSlice";
import { FaUser } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { RiMessengerLine } from "react-icons/ri";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";




const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSearch = async (data) => { };
  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };
  return (
    <div className="flex items-center justify-between w-full px-4 py-3 topbar md:py-6 bg-primary">
      <Link to="/" className="flex items-center gap-2">
        <div className="p-1 text-white rounded md:p-2">
          <img
            src={Logo}
            alt="logo"
            width={36}
            height={36}
            className="transition-transform hover:scale-110"
          />
        </div>
        <span className="text-xl font-semibold text-blue-400 md:text-2xl">
          LinkVerse
        </span>
      </Link>

      <form
        className="items-center justify-center hidden md:flex"
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder="Search..."
          styles="w-[18rem] lg:w-[38rem] rounded-l-full py-3"
          register={register("search")}
        />

        <Button
          title="Search"
          type="submit"
          containerStyles="bg-[#044a4] text-white px-6 py-2.5 mt-2 rounded-r-full"
        />
      </form>

      {/* icons */}
      <div className="flex items-center gap-4 text-base text-ascent-1 md:text-xl">
        <IoHome />

        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <div className="hidden lg:flex">
          <RiMessengerLine />
        </div>
        <FaRegSquarePlus />
        <FaRegHeart />
        {/* avatar */}
        <Popover className="relative">
          <PopoverButton className="transition-transform rounded-full hover:scale-105 hover:ring-2 hover:ring-neutral-300 focus:outline-none">
            <img
              className='object-cover w-8 h-8 rounded-full '
              src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww" alt="" />
          </PopoverButton>
          <PopoverPanel className="absolute right-0 z-10 p-3 transition-opacity duration-200 ease-in-out bg-white rounded-lg shadow-lg w-[200px] h-[110px] ">
            <div className="flex flex-col items-start p-1 space-y-2 text-sm cursor-pointe ">
              <div className="flex items-center gap-2">
                <FaRegUserCircle />
                <Link to='/profile' className="w-full text-left text-gray-500 hover:bg-gray-100">Trang cá nhân</Link>
              </div>
              <div className="flex items-center gap-2" >
                <IoSettingsOutline />
                <Link to='/setting' className="w-full text-left text-gray-500 hover:bg-gray-100">Settings</Link>
              </div>
              <div className="flex items-center gap-2">
                <MdOutlineLogout />
                <Link
                  onClick={() => dispatch(Logout())}
                  containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] ho rounded-full">Đăng Xuất</Link>
              </div>

            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  );
};

export default TopBar;
