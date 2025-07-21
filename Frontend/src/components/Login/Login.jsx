import React, { useState } from 'react';
import { Form, Button, InputGroup, FormCheck, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const onSubmit = data => {
    // Handle login logic here
    console.log(data);
    onLogin();
    navigate("/dashboard");
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
              {...register('email', { required: 'Email is required' })}
              isInvalid={!!errors.email}
              autoComplete="username"
              value="test@gmail.com"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="login-input"
                {...register('password', { required: 'Password is required' })}
                isInvalid={!!errors.password}
                autoComplete="current-password"
                value="123456"
              />
              <Button
                variant="link"
                className="px-2 text-decoration-none login-show-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                type="button"
              >
                {showPassword ? 'hide' : 'show'}
              </Button>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="align-items-center mb-3">
            <Col xs="auto">
              <FormCheck
                type="checkbox"
                label="Remember password"
                className="text-muted"
                {...register('remember')}
              />
            </Col>
            <Col className="text-end">
              <a className="text-decoration-none login-link-forgot">Forgot password?</a>
            </Col>
          </Row>

          <Button type="submit" className="w-100 login-btn mb-3">
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
