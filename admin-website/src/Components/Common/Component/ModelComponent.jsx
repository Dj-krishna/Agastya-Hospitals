import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Btn } from "../../../AbstractElements";

const ModelComponent = ({
  isOpen,
  toggler,
  size,
  title,
  children,
  submitBtnText,
  closeBtnText,
  bodyClass,
  onSubmit,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggler} size={size} centered>
      <ModalHeader toggle={toggler}>{title}</ModalHeader>
      <ModalBody className={bodyClass ? bodyClass : ""}>{children}</ModalBody>
      {closeBtnText && submitBtnText && (
        <ModalFooter>
          <Btn
            attrBtn={{ color: "secondary", onClick: toggler, type: "button" }}
          >
            {closeBtnText}
          </Btn>

          <Btn
            attrBtn={{ color: "primary", onClick: onSubmit, type: "submit" }}
          >
            {submitBtnText}
          </Btn>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default ModelComponent;
