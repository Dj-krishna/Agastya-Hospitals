import React, { useState, useEffect } from "react";
import { Form, Button, InputGroup, FormCheck, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, setError, setLoading } from "../../slices/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userName: "admin@agastya.com",
    password: "Admin123",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: userDetails,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, userDetails: authUserDetails } = useSelector(
    (state) => state.auth
  );

  const onSubmit = (data) => {
    console.log("user", authUserDetails);

    if (
      data.userName === authUserDetails.userName &&
      data.password === authUserDetails.password
    ) {
      dispatch(login(data));
      navigate("/dashboard", { replace: true });
    } else {
      dispatch(setError("Invalid email or password"));
    }
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-bg">
      <div className="glass-card p-4">
        <h2 className="mb-1 fw-bold login-title">Sign In</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="test@gmail.com"
              className="login-input"
              {...register("email", { required: "Email is required" })}
              isInvalid={!!errors.email}
              value={userDetails.userName}
              name="userName"
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="login-input"
                {...register("password", { required: "Password is required" })}
                isInvalid={!!errors.password}
                value={userDetails.password}
                name="password"
                onChange={handleChange}
              />
              <Button
                variant="link"
                className="px-2 text-decoration-none login-show-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                type="button"
              >
                {showPassword ? "hide" : "show"}
              </Button>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="align-items-center mb-3">
            <Col className="text-end">
              <a className="text-decoration-none login-link-forgot">
                Forgot password?
              </a>
            </Col>
          </Row>

          <Button
            type="submit"
            className="w-100 login-btn mb-3"
            // disabled={loading}
          >
            Sign In
          </Button>
          {error && <div className="text-danger text-center mb-2">{error}</div>}
        </Form>
      </div>
    </div>
  );
};

export default Login;
