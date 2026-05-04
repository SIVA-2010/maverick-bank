import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import '../../styles/App.css';

const RegisterAdmin = () => {
    const [admin, setAdmin] = useState({
        adminId: Math.floor(Math.random() * 100) + 10,
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/v1/auth/register/admin', admin, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data || 'Admin registered successfully!');
            setMsgType('success');
            setTimeout(() => navigate('/manage-admins'), 2000);
        } catch (error) {
            setMessage('Error registering admin');
            setMsgType('error');
        }
    };

    return (
        <div>
            <AdminMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Register New Admin</h2>
                <div className="mv-card" style={{ maxWidth: '500px' }}>
                    <h3>🛡️ New Admin</h3>
                    <div className="mv-form-group">
                        <label>Admin ID</label>
                        <input className="mv-input" type="text" value={admin.adminId} readOnly style={{ background: '#f1f5f9' }} />
                    </div>
                    <div className="mv-form-group">
                        <label>Full Name</label>
                        <input className="mv-input" type="text" placeholder="Enter full name" value={admin.name} onChange={(e) => setAdmin({ ...admin, name: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Email</label>
                        <input className="mv-input" type="email" placeholder="Enter email address" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Password</label>
                        <input className="mv-input" type="password" placeholder="Enter password" value={admin.password} onChange={(e) => setAdmin({ ...admin, password: e.target.value })} />
                    </div>
                    {message && <div className={`mv-alert ${msgType === 'success' ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}
                    <button className="mv-btn mv-btn-primary mv-btn-block" onClick={handleSubmit} style={{ marginTop: '16px' }}>
                        Register Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterAdmin;