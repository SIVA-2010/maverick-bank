import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMenu from './AdminMenu';
import '../../styles/App.css';

const ManageEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/v1/admin/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (emplId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/v1/admin/employee/${emplId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage('Employee deleted successfully!');
                setMsgType('success');
                fetchEmployees();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('Error deleting employee');
                setMsgType('error');
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

    return (
        <div>
            <AdminMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Manage Employees</h2>
                {message && <div className={`mv-alert ${msgType === 'success' ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}
                {loading ? (
                    <div className="mv-loading">Loading employees...</div>
                ) : (
                    <div className="mv-table-wrapper">
                        <table className="mv-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.emplId}>
                                        <td><strong>{emp.emplId}</strong></td>
                                        <td>{emp.name}</td>
                                        <td>{emp.email}</td>
                                        <td><span className="mv-badge mv-badge-active">{emp.roles}</span></td>
                                        <td>
                                            <button className="mv-btn mv-btn-danger mv-btn-sm" onClick={() => handleDeleteEmployee(emp.emplId)}>
                                                🗑 Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageEmployees;