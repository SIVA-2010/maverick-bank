import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/App.css';
import { API_BASE_URL } from '../../apiConfig';

const CustomerRegister = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        customerId: Math.floor(Math.random() * 9000) + 1000,
        name: '',
        gender: 'Male',
        dateOfBirth: '',
        age: 0,
        aadharNumber: '',
        panNumber: '',
        phone: '',
        email: '',
        address: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(API_BASE_URL + '/auth/register/customer', customer);
            setMessage(response.data || 'Registration successful!');
            setIsSuccess(true);
            setTimeout(() => navigate('/customer-login'), 2000);
        } catch (error) {
            setMessage('Registration failed. Email may already exist.');
            setIsSuccess(false);
        }
    };

    const handleDateChange = (e) => {
        const dob = e.target.value;
        const age = calculateAge(dob);
        setCustomer({ ...customer, dateOfBirth: dob, age: age });
    };

    return (
        <div className="mv-auth-wrapper">
            <div className="mv-auth-card mv-auth-card-wide">
                <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '8px' }}>🏦</div>
                <h2>Customer Registration</h2>
                <p className="mv-auth-subtitle">Create your Maverick Bank account</p>
                <div className="mv-form-grid">
                    <div className="mv-form-group">
                        <label>Full Name</label>
                        <input className="mv-input" type="text" placeholder="Full Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Gender</label>
                        <select className="mv-select" value={customer.gender} onChange={(e) => setCustomer({ ...customer, gender: e.target.value })}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="mv-form-group">
                        <label>Date of Birth</label>
                        <input className="mv-input" type="date" onChange={handleDateChange} />
                    </div>
                    <div className="mv-form-group">
                        <label>Age</label>
                        <input className="mv-input" type="text" value={customer.age} readOnly />
                    </div>
                    <div className="mv-form-group">
                        <label>Aadhar Number</label>
                        <input className="mv-input" type="text" placeholder="Aadhar Number" value={customer.aadharNumber} onChange={(e) => setCustomer({ ...customer, aadharNumber: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>PAN Number</label>
                        <input className="mv-input" type="text" placeholder="PAN Number" value={customer.panNumber} onChange={(e) => setCustomer({ ...customer, panNumber: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Phone</label>
                        <input className="mv-input" type="text" placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Email</label>
                        <input className="mv-input" type="email" placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Address</label>
                        <input className="mv-input" type="text" placeholder="Address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Password</label>
                        <input className="mv-input" type="password" placeholder="Password" value={customer.password} onChange={(e) => setCustomer({ ...customer, password: e.target.value })} />
                    </div>
                </div>
                {message && <div className={`mv-alert ${isSuccess ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}
                <button className="mv-btn mv-btn-primary mv-btn-block" onClick={handleSubmit} style={{ marginTop: '20px' }}>Register</button>
                <p style={{ marginTop: '20px', textAlign: 'center', color: '#64748b' }}>
                    Already have an account? <Link to="/customer-login" style={{ color: '#4f46e5', fontWeight: 600 }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default CustomerRegister;