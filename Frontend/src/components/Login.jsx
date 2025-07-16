import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    onLogin();
    navigate("/dashboard");
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center">
      <div className="glass-card p-4 border rounded shadow-lg">
        <h2 className="mb-4 text-center fw-bold login-title">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              type="text"
              className={`form-control form-control-lg rounded-pill shadow-sm login-input${
                errors.username ? " is-invalid" : ""
              }`}
              placeholder="Username"
              {...register("username", {
                required: "Username is required.",
                minLength: {
                  value: 4,
                  message: "Username must be at least 4 characters.",
                },
              })}
            />
            {errors.username && (
              <div
                className="invalid-feedback d-block"
                style={{ fontSize: 14 }}
              >
                {errors.username.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="password"
              className={`form-control form-control-lg rounded-pill shadow-sm login-input${
                errors.password ? " is-invalid" : ""
              }`}
              placeholder="Password"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
              })}
            />
            {errors.password && (
              <div
                className="invalid-feedback d-block"
                style={{ fontSize: 14 }}
              >
                {errors.password.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill fw-bold shadow login-btn"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
