import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const CustomerMenu = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        navigate('/');
    };

    return (
        <nav className="mv-navbar">
            <h2>🏦 Maverick Bank</h2>
            <div className="mv-navbar-links">
                <Link to="/customer-dashboard">Dashboard</Link>
                <Link to="/customer-accounts">Accounts</Link>
                <Link to="/customer-beneficiaries">Beneficiaries</Link>
                <Link to="/customer-transactions">Transactions</Link>
                <Link to="/customer-loans">My Loans</Link>
                <Link to="/apply-loan">Apply Loan</Link>
                <Link to="/add-beneficiary">Add Beneficiary</Link>
                <button onClick={handleLogout} className="mv-btn-logout">Logout</button>
            </div>
        </nav>
    );
};

export default CustomerMenu;