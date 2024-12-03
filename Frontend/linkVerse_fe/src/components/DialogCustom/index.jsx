import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Fade } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade direction="up" ref={ref} {...props} />;
});

const DialogCustom = ({
  isOpen,
  children,
  className,
  theme,
  imageSrc,
  handleCloseDiaLogAdd,
}) => {
  return (
    <Dialog
      TransitionComponent={Transition}
      onClose={handleCloseDiaLogAdd}
      open={isOpen}
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "13px",
          borderWidth: "0.1px",
          borderColor: theme === "dark" ? "rgb(45,45,45)" : "rgb(213,213,213)",
        },
      }}
    >
      <div className={className}>
        {imageSrc && <img src={imageSrc} />}
        {children}
      </div>
    </Dialog>
  );
};

export default DialogCustom;
