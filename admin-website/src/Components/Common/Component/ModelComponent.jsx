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
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggler} size={size} centered>
      <ModalHeader toggle={toggler}>{title}</ModalHeader>
      <ModalBody className={bodyClass ? bodyClass : ""}>{children}</ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: toggler }}>
          {closeBtnText}
        </Btn>
        {submitBtnText && (
          <Btn attrBtn={{ color: "primary", onClick: toggler }}>
            {submitBtnText}
          </Btn>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ModelComponent;
