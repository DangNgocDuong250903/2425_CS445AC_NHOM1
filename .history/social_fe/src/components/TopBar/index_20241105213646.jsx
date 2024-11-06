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
        <Link to="/profile">
          <FaUser className="text-blue-500 cursor-pointer" />
        </Link>
        <div>
          <Button
            onClick={() => dispatch(Logout())}
            title="Log out"
            containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
