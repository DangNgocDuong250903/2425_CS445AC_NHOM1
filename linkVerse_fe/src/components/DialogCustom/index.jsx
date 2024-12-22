import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { Fade } from "@mui/material";
import styled from "@emotion/styled";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade di rection="up" ref={ref} {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.colorSchemes.light.primary.main,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.colorSchemes.dark.primary.main,
    }),
    "& .MuiDialog-paper": {
      borderRadius: "20px",
      borderWidth: "0.1px",
      borderColor: theme === "dark" ? "rgb(45,45,45)" : "rgb(213,213,213)",
    },
  },
}));

const DialogCustom = ({
  isOpen,
  children,
  classNames,
  theme,
  imageSrc,
  handleCloseDiaLogAdd,
}) => {
  return (
    <StyledDialog
      TransitionComponent={Transition}
      onClose={handleCloseDiaLogAdd}
      open={isOpen}
      fullWidth
    >
      {imageSrc && <img src={imageSrc} />}
      {children}
    </StyledDialog>
  );
};

export default DialogCustom;
