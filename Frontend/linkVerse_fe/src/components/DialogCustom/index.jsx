import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Grow } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

const DialogCustom = ({ isOpen, children, styles, stylesContainer }) => {
  const handleClose = () => {
    isOpen = false;
  };
  return (
    <Dialog
      TransitionComponent={Transition}
      onClose={handleClose}
      open={isOpen}
      sx={stylesContainer}
    >
      <Box sx={styles}>{children}</Box>
    </Dialog>
  );
};

export default DialogCustom;
