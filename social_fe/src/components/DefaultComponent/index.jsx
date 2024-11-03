import React from "react";
import { TopBar } from "..";

const DefaultComponnet = (children) => {
  return (
    <div>
      <TopBar />
      {children}
    </div>
  );
};

export default DefaultComponnet;
