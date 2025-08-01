import React from "react";
import { Facebook, Linkedin, Twitter } from "react-feather";
import { Link } from "react-router-dom";
import { H6, P } from "../AbstractElements";

const OtherWay = () => {
  return (
    <>
      <P attrPara={{ className: "text-center mb-0 mt-4" }}>
        Don't have account?
        <Link className="ms-2" to={`/register-simple`}>
          Create Account
        </Link>
      </P>
    </>
  );
};

export default OtherWay;
