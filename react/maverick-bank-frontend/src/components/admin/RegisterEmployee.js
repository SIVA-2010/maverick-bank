import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import '../../styles/App.css';

const RegisterEmployee = () => {
    const [employee, setEmployee] = useState({
        emplId: Math.floor(Math.random() * 1000) + 200,
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
            const response = await axios.post('http://16.171.9.141:5000/api/v1/auth/register/employee', employee, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data || 'Employee registered successfully!');
            setMsgType('success');
            setTimeout(() => navigate('/manage-employees'), 2000);
        } catch (error) {
            setMessage('Error registering employee');
            setMsgType('error');
        }
    };

    return (
        <div>
            <AdminMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Register New Employee</h2>
                <div className="mv-card" style={{ maxWidth: '500px' }}>
                    <h3>👨‍💼 New Employee</h3>
                    <div className="mv-form-group">
                        <label>Employee ID</label>
                        <input className="mv-input" type="text" value={employee.emplId} readOnly style={{ background: '#f1f5f9' }} />
                    </div>
                    <div className="mv-form-group">
                        <label>Full Name</label>
                        <input className="mv-input" type="text" placeholder="Enter full name" value={employee.name} onChange={(e) => setEmployee({ ...employee, name: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Email</label>
                        <input className="mv-input" type="email" placeholder="Enter email address" value={employee.email} onChange={(e) => setEmployee({ ...employee, email: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Password</label>
                        <input className="mv-input" type="password" placeholder="Enter password" value={employee.password} onChange={(e) => setEmployee({ ...employee, password: e.target.value })} />
                    </div>
                    {message && <div className={`mv-alert ${msgType === 'success' ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}
                    <button className="mv-btn mv-btn-primary mv-btn-block" onClick={handleSubmit} style={{ marginTop: '16px' }}>
                        Register Employee
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterEmployee;