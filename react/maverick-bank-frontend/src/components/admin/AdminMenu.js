import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const AdminMenu = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        navigate('/');
    };

    return (
        <nav className="mv-navbar">
            <h2>🛡️ Maverick Bank — Admin</h2>
            <div className="mv-navbar-links">
                <Link to="/admin-dashboard">Dashboard</Link>
                <Link to="/manage-employees">Employees</Link>
                <Link to="/manage-admins">Admins</Link>
                <Link to="/register-employee">Add Employee</Link>
                <Link to="/register-admin">Add Admin</Link>
                <button onClick={handleLogout} className="mv-btn-logout">Logout</button>
            </div>
        </nav>
    );
};

export default AdminMenu;