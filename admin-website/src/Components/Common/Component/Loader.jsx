import React from "react";
import { H6 } from "../../../AbstractElements";
import { Spinner } from "reactstrap";

const Loader = () => {
  return (
    <>
      <H6 attrH6={{ className: "sub-title mb-0 text-center" }}>{"Loader-7"}</H6>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff", // dark background with opacity
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1050, // make sure it stays above all other elements
        }}
      >
        <Spinner
          size={"lg"}
          color="primary"
          style={{
            height: "5rem",
            width: "5rem",
          }}
        />
      </div>{" "}
    </>
  );
};

export default Loader;
