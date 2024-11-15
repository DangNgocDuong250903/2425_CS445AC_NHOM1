import * as React from "react";
import Popper from "@mui/material/Popper";

const PopperCustom = ({ id, anchorEl, open, children }) => {
  return (
    <div>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        sx={{ zIndex: 100, boxShadow: "4px solid #ccc" }}
      >
        {children}
      </Popper>
    </div>
  );
};

export default PopperCustom;
