import React from "react";

const Wrapper = ({ children }) => {
  return (
    <div className="w-full lg:px-10 2xl:px-50 bg-bgColor h-screen">
      {children}
    </div>
  );
};

export default Wrapper;
