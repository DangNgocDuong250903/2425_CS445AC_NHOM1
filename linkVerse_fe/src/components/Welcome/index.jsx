import React, { useEffect, useState } from "react";
import { DialogCustom } from "..";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      setShow(true);
    }
  }, []);

  return (
    <DialogCustom
      width="600px"
      isOpen={show}
      handleCloseDiaLogAdd={handleClose}
    >
      <div className="w-full px-2 py-14 text-center gap-y-7 flex-col rounded-2xl flex items-center justify-center">
        <div>
          <h1 className="text-ascent-1 px-3 tracking-tight text-3xl font-extrabold">
            Welcome to LinkVerse
          </h1>
          <h1 className="text-ascent-1 px-3 tracking-tight text-3xl font-extrabold">
            Your Social Universe Awaits!
          </h1>
        </div>
        <div className="flex flex-col">
          <p className="text-center text-neutral-600 px-6">
            Join LinkVerse today to connect, share, and explore endless
          </p>
          <span className="text-neutral-400">
            possibilities with your friends and the community.
          </span>
          <span className="text-neutral-400">
            Log in now and be part of the conversation!
          </span>
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

export default Welcome;
