import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/App.css';

const CustomerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://16.171.9.141:5000/api/v1/auth/login', {
                email: email,
                password: password
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('email', email);
                navigate('/customer-dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div className="mv-auth-wrapper">
            <div className="mv-auth-card">
                <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '8px' }}>🏦</div>
                <h2>Customer Login</h2>
                <p className="mv-auth-subtitle">Welcome back! Sign in to your account</p>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div className="mv-form-group">
                        <label>Email Address</label>
                        <input
                            className="mv-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mv-form-group">
                        <label>Password</label>
                        <input
                            className="mv-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {error && <div className="mv-alert mv-alert-error">{error}</div>}
                    <button type="submit" className="mv-btn mv-btn-primary mv-btn-block" style={{ marginTop: '20px' }}>
                        Sign In
                    </button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: '#64748b' }}>
                    Don't have an account? <Link to="/customer-register" style={{ color: '#4f46e5', fontWeight: 600 }}>Register here</Link>
                </p>
                <p style={{ marginTop: '8px', textAlign: 'center' }}>
                    <Link to="/" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>← Back to Home</Link>
                </p>
            </div>
        </div>
    );
};

export default CustomerLogin;