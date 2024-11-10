import React from "react";
import { TopBar, Wrapper } from "~/components";

const Admin = () => {
  return (
    <Wrapper>
      <TopBar />
      <div className="bg-yellow-500">Admin</div>
    </Wrapper>
  );
};

export default Admin;
