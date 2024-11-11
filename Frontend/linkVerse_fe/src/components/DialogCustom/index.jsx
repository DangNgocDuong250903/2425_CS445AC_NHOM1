import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Fade } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade direction="up" ref={ref} {...props} />;
});

const DialogCustom = ({ isOpen, children, className }) => {
  const handleClose = () => {
    isOpen = false;
  };

  return (
    <Dialog
      TransitionComponent={Transition}
      onClose={handleClose}
      open={isOpen}
      fullWidth
    >
      <div className={className}>{children}</div>
    </Dialog>
  );
};

export default DialogCustom;
