import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeMenu from './EmployeeMenu';
import '../../styles/App.css';
import { API_BASE_URL } from '../../apiConfig';

const LoanApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_BASE_URL + '/employee/loan-applications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (applicationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/employee/loan-application/${applicationId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Loan approved successfully!');
            setMsgType('success');
            fetchApplications();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data || 'Error approving loan');
            setMsgType('error');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleReject = async (applicationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/employee/loan-application/${applicationId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Loan rejected!');
            setMsgType('error');
            fetchApplications();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data || 'Error rejecting loan');
            setMsgType('error');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const getBadgeClass = (status) => {
        if (status === 'APPROVED') return 'mv-badge-approved';
        if (status === 'REJECTED') return 'mv-badge-rejected';
        return 'mv-badge-pending';
    };

    return (
        <div>
            <EmployeeMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Loan Applications</h2>
                {message && <div className={`mv-alert ${msgType === 'success' ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}
                {loading ? (
                    <div className="mv-loading">Loading loan applications...</div>
                ) : applications.length > 0 ? (
                    <div className="mv-table-wrapper">
                        <table className="mv-table">
                            <thead>
                                <tr>
                                    <th>App ID</th>
                                    <th>Customer ID</th>
                                    <th>Loan ID</th>
                                    <th>Amount (₹)</th>
                                    <th>Purpose</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.applicationId}>
                                        <td><strong>{app.applicationId}</strong></td>
                                        <td>{app.customerId}</td>
                                        <td>{app.loanId}</td>
                                        <td>₹{app.requestedAmount?.toLocaleString()}</td>
                                        <td>{app.purpose}</td>
                                        <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`mv-badge ${getBadgeClass(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            {app.status === 'PENDING' ? (
                                                <div className="mv-action-group">
                                                    <button className="mv-btn mv-btn-success mv-btn-sm" onClick={() => handleApprove(app.applicationId)}>
                                                        ✓ Approve
                                                    </button>
                                                    <button className="mv-btn mv-btn-danger mv-btn-sm" onClick={() => handleReject(app.applicationId)}>
                                                        ✕ Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="mv-empty">
                        <div className="mv-empty-icon">📋</div>
                        <p>No loan applications found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanApplicationsList;