import { Alert, Snackbar } from "@mui/material";
import React from "react";

const Alerts = ({
  message = "Something went wrong!",
  type = "success",
  icon = false,
  open,
  handleClose,
  position,
}) => {
  return (
    <Snackbar
      anchorOrigin={position}
      open={open}
      autoHideDuration={3500}
      onClose={handleClose}
    >
      <Alert
        icon={icon}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Alerts;