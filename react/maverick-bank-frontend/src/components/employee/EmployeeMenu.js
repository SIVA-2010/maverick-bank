import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const EmployeeMenu = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        navigate('/');
    };

    return (
        <nav className="mv-navbar">
            <h2>👨‍💼 Maverick Bank — Employee</h2>
            <div className="mv-navbar-links">
                <Link to="/employee-dashboard">Dashboard</Link>
                <Link to="/all-customers">Customers</Link>
                <Link to="/all-accounts">Accounts</Link>
                <Link to="/all-transactions">Transactions</Link>
                <Link to="/loan-applications">Loan Apps</Link>
                <button onClick={handleLogout} className="mv-btn-logout">Logout</button>
            </div>
        </nav>
    );
};

export default EmployeeMenu;