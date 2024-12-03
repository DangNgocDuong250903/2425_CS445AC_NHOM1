import React from "react";
import { TopBar } from "~/components";
import MiniDrawer from "~/components/Drawer";

const Admin = () => {
  return (
    <>
      <TopBar />
      <div className="">
        Admin
        <MiniDrawer />
      </div>
    </>
  );
};

export default Admin;
