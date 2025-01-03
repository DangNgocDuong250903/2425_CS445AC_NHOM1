import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "~/components/Admin/Sidebar";

const Admin = () => {
  return (
    <>
      <div className="flex flex-row w-screen h-screen overflow-hidden bg-neutral-100">
        <Sidebar></Sidebar>
        <div className="flex-1">
          <div className="p-4">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
