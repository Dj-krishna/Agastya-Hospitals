import React, { Fragment, useState, useEffect, useContext } from "react";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Btn, H4, P } from "../AbstractElements";
import {
  EmailAddress,
  ForgotPassword,
  Password,
  RememberPassword,
  SignIn,
} from "../Constant";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import man from "../assets/images/dashboard/profile.png";

import CustomizerContext from "../_helper/Customizer";
import OtherWay from "./OtherWay";
import { ToastContainer, toast } from "react-toastify";
import { loginAsync, clearError } from "../slices/authSlice";
import Swal from "sweetalert2";

const Signin = ({ selected }) => {
  const [email, setEmail] = useState("spiderman@avengers.com");
  const [password, setPassword] = useState("MaryJane@3");
  const [togglePassword, setTogglePassword] = useState(false);
  const history = useNavigate();
  const dispatch = useDispatch();
  const { layoutURL } = useContext(CustomizerContext);

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [value, setValue] = useState(localStorage.getItem("profileURL" || man));
  const [name, setName] = useState(localStorage.getItem("Name"));

  // useEffect(() => {
  //   localStorage.setItem("profileURL", man);
  //   localStorage.setItem("Name", "Emay Walter");
  // }, [value, name]);

  // Handle authentication success
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("login", JSON.stringify(true));
      history(`/dashboard`);
      toast.success("Successfully logged in!..");
    }
  }, [isAuthenticated, history]);

  // Handle authentication error with SweetAlert
  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Login Failed!",
        text: "Please check the email address or password and try again!",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loginAuth = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    dispatch(clearError());

    // Dispatch the login action
    const result = await dispatch(loginAsync({ email, password }));

    // If login failed, the error will be handled by the useEffect above
    if (loginAsync.rejected.match(result)) {
      // Error is already handled in useEffect with SweetAlert
      return;
    }
  };

  return (
    <Fragment>
      <Container fluid={true} className="p-0 login-page">
        <Row>
          <Col xs="12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form">
                  <H4>Sign In With Agastya Hospitals</H4>
                  <P>{"Enter your email & password to login"}</P>
                  <FormGroup>
                    <Label className="col-form-label">{EmailAddress}</Label>
                    <Input
                      className="form-control"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      disabled={loading}
                    />
                  </FormGroup>
                  <FormGroup className="position-relative">
                    <Label className="col-form-label">{Password}</Label>
                    <div className="position-relative">
                      <Input
                        className="form-control"
                        type={togglePassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        disabled={loading}
                      />
                      <div
                        className="show-hide"
                        onClick={() => setTogglePassword(!togglePassword)}
                      >
                        <span className={togglePassword ? "" : "show"}></span>
                      </div>
                    </div>
                  </FormGroup>
                  <div className="position-relative text-right">
                    <a href="#javascript">{ForgotPassword}</a>
                    <Btn
                      attrBtn={{
                        color: "primary",
                        className: "d-block w-100 mt-2",
                        onClick: (e) => loginAuth(e),
                        disabled: loading,
                      }}
                    >
                      {loading ? "Signing in..." : SignIn}
                    </Btn>
                  </div>
                  <OtherWay />
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default Signin;
