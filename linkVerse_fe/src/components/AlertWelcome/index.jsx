import { DialogCustom } from "..";
import { useNavigate } from "react-router-dom";

const AlertWelcome = ({ type, open, handleClose }) => {
  const navigate = useNavigate();

  return (
    <DialogCustom isOpen={open} handleCloseDiaLogAdd={handleClose}>
      <div className="w-full py-14 text-center gap-y-7 flex-col rounded-2xl flex items-center justify-center">
        {type === "like" && (
          <h1 className="text-ascent-1 px-2 tracking-tight text-3xl font-extrabold">
            Đăng ký để chia sẻ cảm xúc
          </h1>
        )}

        {type === "share" && (
          <h1 className="text-ascent-1 px-2 tracking-tight text-3xl font-extrabold">
            Đăng ký để chia sẻ bài viết
          </h1>
        )}

        {type === "comment" && (
          <h1 className="text-ascent-1 px-2 tracking-tight text-3xl font-extrabold">
            Đăng ký để chia sẻ cảm xúc của mình
          </h1>
        )}

        <div className="flex flex-col">
          <p className="text-center text-neutral-600 px-6">
            Join LinkVerse to connect, share, and explore endless
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-white bg-[#2557D6]  hover:scale-105 transition-transform focus:outline-none font-medium rounded-lg text-sm gap-x-2 px-5 py-2.5 text-center inline-flex items-center justify-center"
        >
          <img src="/logoHeader.svg" alt="logo" width={20} height={20} />
          Continue with LinkVerse
        </button>
      </div>
    </DialogCustom>
  );
};

export default AlertWelcome;
