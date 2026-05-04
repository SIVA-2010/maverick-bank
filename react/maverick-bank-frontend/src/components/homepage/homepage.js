import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/App.css';

const HomePage = () => {
    return (
        <div className="mv-hero">
            <div className="mv-hero-content">
                <div className="mv-hero-logo">🏦</div>
                <h1>Maverick Bank</h1>
                <p>Your Trusted Digital Banking Partner — Secure, Fast, and Modern</p>

                <div className="mv-hero-section">
                    <h3>Customer Access</h3>
                    <div className="mv-hero-buttons">
                        <Link to="/customer-login">
                            <button className="mv-hero-btn mv-hero-btn-primary">Customer Login</button>
                        </Link>
                        <Link to="/customer-register">
                            <button className="mv-hero-btn mv-hero-btn-outline">Register as Customer</button>
                        </Link>
                    </div>
                </div>

                <div className="mv-hero-section">
                    <h3>Employee Access</h3>
                    <div className="mv-hero-buttons">
                        <Link to="/employee-login">
                            <button className="mv-hero-btn mv-hero-btn-accent">Employee Login</button>
                        </Link>
                    </div>
                </div>

                <div className="mv-hero-section">
                    <h3>Admin Access</h3>
                    <div className="mv-hero-buttons">
                        <Link to="/admin-login">
                            <button className="mv-hero-btn mv-hero-btn-success">Admin Login</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;