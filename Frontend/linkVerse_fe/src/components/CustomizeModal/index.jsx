import * as React from "react";
import Modal from "@mui/material/Modal";

const CustomizeModal = ({ open, imageSrc, handleClose, children }) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
          }}
        >
          {imageSrc && <img src={imageSrc} />} {children}
        </div>
      </Modal>
    </div>
  );
};

export default CustomizeModal;
