import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeMenu from './EmployeeMenu';
import '../../styles/App.css';

const AllAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/v1/employee/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching accounts:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (accountNo) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/v1/employee/account/${accountNo}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Account approved successfully!');
            setMsgType('success');
            fetchAccounts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data || 'Error approving account');
            setMsgType('error');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleReject = async (accountNo) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/v1/employee/account/${accountNo}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Account rejected successfully!');
            setMsgType('error');
            fetchAccounts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data || 'Error rejecting account');
            setMsgType('error');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const getBadgeClass = (status) => {
        if (status === 'ACTIVE') return 'mv-badge-active';
        if (status === 'REJECTED') return 'mv-badge-rejected';
        return 'mv-badge-pending';
    };

    return (
        <div>
            <EmployeeMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">All Accounts</h2>
                {message && <div className={`mv-alert ${msgType === 'success' ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}
                {loading ? (
                    <div className="mv-loading">Loading accounts...</div>
                ) : (
                    <div className="mv-table-wrapper">
                        <table className="mv-table">
                            <thead>
                                <tr>
                                    <th>Account No</th>
                                    <th>Customer ID</th>
                                    <th>Account Name</th>
                                    <th>Type</th>
                                    <th>Balance (₹)</th>
                                    <th>Branch</th>
                                    <th>IFSC</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((acc) => (
                                    <tr key={acc.accountNo}>
                                        <td><strong>{acc.accountNo}</strong></td>
                                        <td>{acc.customerId}</td>
                                        <td>{acc.accountName}</td>
                                        <td>{acc.type}</td>
                                        <td>₹{acc.balance?.toLocaleString()}</td>
                                        <td>{acc.branchName}</td>
                                        <td>{acc.ifsc}</td>
                                        <td>
                                            <span className={`mv-badge ${getBadgeClass(acc.status)}`}>
                                                {acc.status}
                                            </span>
                                        </td>
                                        <td>
                                            {acc.status === 'PENDING' ? (
                                                <div className="mv-action-group">
                                                    <button className="mv-btn mv-btn-success mv-btn-sm" onClick={() => handleApprove(acc.accountNo)}>
                                                        ✓ Approve
                                                    </button>
                                                    <button className="mv-btn mv-btn-danger mv-btn-sm" onClick={() => handleReject(acc.accountNo)}>
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
                )}
            </div>
        </div>
    );
};

export default AllAccounts;