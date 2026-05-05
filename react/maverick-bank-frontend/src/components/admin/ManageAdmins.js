import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMenu from './AdminMenu';
import '../../styles/App.css';
import { API_BASE_URL } from '../../apiConfig';

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_BASE_URL + '/admin/admins', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmins(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setLoading(false);
        }
    };

    const handleDeleteAdmin = async (adminId) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/admin/admin/${adminId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage('Admin deleted successfully!');
                setMsgType('success');
                fetchAdmins();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('Error deleting admin');
                setMsgType('error');
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

    return (
        <div>
            <AdminMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Manage Admins</h2>
                {message && <div className={`mv-alert ${msgType === 'success' ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}
                {loading ? (
                    <div className="mv-loading">Loading admins...</div>
                ) : (
                    <div className="mv-table-wrapper">
                        <table className="mv-table">
                            <thead>
                                <tr>
                                    <th>Admin ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin) => (
                                    <tr key={admin.adminId}>
                                        <td><strong>{admin.adminId}</strong></td>
                                        <td>{admin.name}</td>
                                        <td>{admin.email}</td>
                                        <td><span className="mv-badge mv-badge-active">{admin.roles}</span></td>
                                        <td>
                                            <button className="mv-btn mv-btn-danger mv-btn-sm" onClick={() => handleDeleteAdmin(admin.adminId)}>
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

export default ManageAdmins;