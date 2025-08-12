import React from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { Btn } from "../../../AbstractElements";

const MultiSelect = ({
  isOpen,
  toggle,
  errorStates,
  formStates,
  getDropdownText,
  handleSelectAll,
  handleClearAll,
  items,
}) => {
  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle
        caret
        className="w-100 text-start d-flex justify-content-between align-items-center"
        style={{
          textAlign: "left",
          backgroundColor: "white",
          border: errorStates ? "1px solid #dc3545" : "1px solid #ced4da",
          borderRadius: "0.375rem",
          padding: "0.375rem 0.75rem",
          minHeight: "38px",
          fontSize: "0.875rem",
        }}
      >
        <span className={formStates.length === 0 ? "text-muted" : ""}>
          {getDropdownText()}
        </span>
      </DropdownToggle>
      <DropdownMenu
        className="w-100"
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          minWidth: "300px",
          zIndex: 9,
        }}
      >
        <div className="p-3 border-bottom bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted fw-bold">Select Modules</small>
            <div>
              <Btn
                attrBtn={{
                  color: "outline-primary",
                  size: "sm",
                  onClick: handleSelectAll,
                  className: "me-1 px-2 py-1",
                }}
              >
                All
              </Btn>
              <Btn
                attrBtn={{
                  color: "outline-secondary",
                  size: "sm",
                  onClick: handleClearAll,
                  className: "me-1 px-2 py-1",
                }}
              >
                Clear
              </Btn>
            </div>
          </div>
        </div>
        {items}
      </DropdownMenu>
    </Dropdown>
  );
};

export default MultiSelect;
