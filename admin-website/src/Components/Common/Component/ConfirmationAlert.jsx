import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ConfirmationAlert = ({ isOpen, onClose, handleConfirm, title }) => {
  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Confirmation</ModalHeader>
      <ModalBody className="text-center">
        {title && <h5>{title}</h5>}
        <p className="f-16">Are you sure you want to proceed?</p>
      </ModalBody>
      <ModalFooter className="text-center">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="button" color="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationAlert;
