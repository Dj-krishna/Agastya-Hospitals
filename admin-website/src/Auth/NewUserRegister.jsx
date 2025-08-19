import React, { Fragment, useState } from "react";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Btn, H4, P, H6, Image } from "../AbstractElements";
import { Link } from "react-router-dom";
import { countryCodes } from "../api/countryCode";

const RegisterFrom = () => {
  const [togglePassword, setTogglePassword] = useState(false);
  return (
    <Fragment>
      <div className="login-card">
        <div>
          <div className="login-main">
            <Form className="theme-form login-form">
              <H4>Create your account</H4>
              <P>Enter your personal details to create account</P>
              <FormGroup>
                <Label className="col-form-label m-0 pt-0">Your Name</Label>
                <Row className="g-2">
                  <Col xs="12">
                    <Input
                      className="form-control"
                      type="text"
                      required=""
                      placeholder="Full Name"
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label className="col-form-label m-0 pt-0">Phone Number</Label>
                <Row className="g-2">
                  <Col xs="12">
                    <InputGroup>
                      <Input
                        type="select"
                        name="countryCode"
                        value={"+91"}
                        style={{ maxWidth: "70px" }}
                        // className="form-select"
                      >
                        <option value="">Code</option>
                        {countryCodes.map((code) => (
                          <option value={code.dial_code} key={code.code}>
                            {code.dial_code}
                          </option>
                        ))}
                      </Input>
                      <Input
                        className="form-control"
                        type="text"
                        required=""
                        placeholder="Phone Number"
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label className="col-form-label m-0 pt-0">Email Address</Label>
                <Input
                  className="form-control"
                  type="email"
                  required=""
                  placeholder="Test@gmail.com"
                />
              </FormGroup>
              <FormGroup className="position-relative">
                <Label className="col-form-label m-0 pt-0">Enter Password</Label>
                <div className="position-relative">
                  <Input
                    className="form-control"
                    type={togglePassword ? "text" : "password"}
                    name="login[password]"
                    required
                    placeholder="*********"
                  />
                  <div
                    className="show-hide"
                    onClick={() => setTogglePassword(!togglePassword)}
                  >
                    <span className={togglePassword ? "" : "show"}></span>
                  </div>
                </div>
              </FormGroup>
              <FormGroup className="position-relative">
                <Label className="col-form-label m-0 pt-0">Confirm Password</Label>
                <div className="position-relative">
                  <Input
                    className="form-control"
                    type={togglePassword ? "text" : "password"}
                    name="login[password]"
                    required
                    placeholder="*********"
                  />
                  <div
                    className="show-hide"
                    onClick={() => setTogglePassword(!togglePassword)}
                  >
                    <span className={togglePassword ? "" : "show"}></span>
                  </div>
                </div>
              </FormGroup>
              <FormGroup>
                <Btn
                  attrBtn={{
                    className: "d-block w-100",
                    color: "primary",
                    type: "submit",
                  }}
                >
                  Create Account
                </Btn>
              </FormGroup>

              <P attrPara={{ className: "mb-0 text-start" }}>
                Already have an account?
                <Link className="ms-2" to={`/login`}>
                  Sign in
                </Link>
              </P>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RegisterFrom;
