import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ModalComponent = ({
  isOpen,
  onHide,
  mtitle,
  children,
  closeButton,
  size,
}) => {
  return (
    <Modal
      //   {...props}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      isOpen={isOpen}
      toggle={onHide}
    >
      <ModalHeader className="border-0" toggle={onHide}>
        <span className="f-20 f-w-700">{mtitle}</span>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      {closeButton && (
        <ModalFooter className="border-0 justify-content-center">
          <button onClick={onHide} className="btn btn-danger">
            Close
          </button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default ModalComponent;
