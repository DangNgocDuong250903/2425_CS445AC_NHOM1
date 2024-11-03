import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "/logo.svg";
import { Button, TextInput } from "..";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "~/redux/Slices/theme";
import { Logout } from "~/redux/Slices/userSlice";

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSearch = async (data) => {};
  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };
  return (
    <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2  rounded text-white">
          <img
            src={Logo}
            alt="logo"
            width={36}
            height={36}
            className="hover:scale-110 transition-transform"
          />
        </div>
        <span className="text-xl md:text-2xl text-white font-semibold">
          LinkVerse
        </span>
      </Link>

      <form
        className="hidden md:flex items-center justify-center"
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
      <div className="flex gap-4 items-center text-ascent-1 text-base md:text-xl">
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <div className="hidden lg:flex">
          <IoMdNotificationsOutline />
        </div>
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
