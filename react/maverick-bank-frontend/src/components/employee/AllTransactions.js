import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeMenu from './EmployeeMenu';
import '../../styles/App.css';

const AllTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/v1/employee/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <EmployeeMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">All Transactions</h2>
                {loading ? (
                    <div className="mv-loading">Loading transactions...</div>
                ) : transactions.length > 0 ? (
                    <div className="mv-table-wrapper">
                        <table className="mv-table">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>From Account</th>
                                    <th>To Account</th>
                                    <th>Amount (₹)</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <tr key={txn.transactionId}>
                                        <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{txn.transactionId?.substring(0, 8)}...</td>
                                        <td>{txn.fromAccountNo}</td>
                                        <td>{txn.toAccountNo}</td>
                                        <td><strong>₹{txn.amount?.toLocaleString()}</strong></td>
                                        <td>{new Date(txn.date).toLocaleString()}</td>
                                        <td>
                                            <span className={`mv-badge ${txn.type === 'DEPOSIT' ? 'mv-badge-success' : txn.type === 'WITHDRAWAL' ? 'mv-badge-rejected' : 'mv-badge-pending'}`}>
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td><span className="mv-badge mv-badge-active">{txn.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="mv-empty">
                        <div className="mv-empty-icon">📭</div>
                        <p>No transactions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllTransactions;