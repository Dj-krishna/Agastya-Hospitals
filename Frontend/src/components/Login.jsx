import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

function Login({ onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    const validate = () => {
        const newErrors = {};
        if (!username) newErrors.username = 'Username is required.';
        else if (username.length < 4) newErrors.username = 'Username must be at least 4 characters.';
        if (!password) newErrors.password = 'Password is required.';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
        return newErrors;
    };

    const handleSubmit = e => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            onLogin();
        }
    };

    return (
        <div
            className="login-bg d-flex align-items-center justify-content-center"

        >
            <div
                className="glass-card p-4 border rounded shadow-lg"
                style={{
                    minWidth: 340,
                    background: 'rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
            >
                <h2 className="mb-4 text-center fw-bold" style={{ color: '#333', letterSpacing: 1 }}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className={`form-control form-control-lg rounded-pill shadow-sm${errors.username ? ' is-invalid' : ''}`}
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            style={{ background: 'rgba(255,255,255,0.7)', border: 'none', paddingLeft: 20 }}
                        />
                        {errors.username && <div className="invalid-feedback d-block" style={{ fontSize: 14 }}>{errors.username}</div>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className={`form-control form-control-lg rounded-pill shadow-sm${errors.password ? ' is-invalid' : ''}`}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{ background: 'rgba(255,255,255,0.7)', border: 'none', paddingLeft: 20 }}
                        />
                        {errors.password && <div className="invalid-feedback d-block" style={{ fontSize: 14 }}>{errors.password}</div>}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 rounded-pill fw-bold shadow"
                        style={{ letterSpacing: 1, fontSize: 18 }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;
