import React from "react";
import { TopBar, Wrapper } from "~/components";
import MiniDrawer from "~/components/Drawer";

const Admin = () => {
  return (
    <Wrapper>
      <TopBar />
      <div className="">
        Admin
        <MiniDrawer />
      </div>
    </Wrapper>
  );
};

export default Admin;
