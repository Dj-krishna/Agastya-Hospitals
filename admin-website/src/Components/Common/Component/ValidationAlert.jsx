import React from "react";
import { FormFeedback } from "reactstrap";

const ValidationAlert = ({ error }) => {
  return (
    <>
      {error && (
        <FormFeedback
          style={{ display: "block" }}
          type="invalid"
          className="text-danger"
        >
          {error}
        </FormFeedback>
      )}
    </>
  );
};

export default ValidationAlert;
