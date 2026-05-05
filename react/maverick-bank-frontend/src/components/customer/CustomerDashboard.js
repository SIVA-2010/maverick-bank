import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerMenu from './CustomerMenu';
import '../../styles/App.css';
import { API_BASE_URL } from '../../apiConfig';

const CustomerDashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(API_BASE_URL + '/customer/my-accounts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAccounts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div>
            <CustomerMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Welcome Back 👋</h2>
                <div className="mv-stats-grid">
                    <div className="mv-stat-card blue">
                        <h3>{accounts.length}</h3>
                        <p>Total Accounts</p>
                    </div>
                    <div className="mv-stat-card green">
                        <h3>₹{totalBalance.toLocaleString()}</h3>
                        <p>Total Balance</p>
                    </div>
                    <div className="mv-stat-card purple">
                        <h3>{accounts.filter(a => a.status === 'ACTIVE').length}</h3>
                        <p>Active Accounts</p>
                    </div>
                </div>
                {loading ? (
                    <div className="mv-loading">Loading your accounts...</div>
                ) : accounts.length > 0 ? (
                    <div className="mv-table-wrapper">
                        <table className="mv-table">
                            <thead>
                                <tr>
                                    <th>Account No</th>
                                    <th>Account Name</th>
                                    <th>Type</th>
                                    <th>Balance (₹)</th>
                                    <th>IFSC</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((acc) => (
                                    <tr key={acc.accountNo}>
                                        <td><strong>{acc.accountNo}</strong></td>
                                        <td>{acc.accountName}</td>
                                        <td>{acc.type}</td>
                                        <td>₹{acc.balance.toLocaleString()}</td>
                                        <td>{acc.ifsc}</td>
                                        <td>
                                            <span className={`mv-badge ${acc.status === 'ACTIVE' ? 'mv-badge-active' : 'mv-badge-inactive'}`}>
                                                {acc.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="mv-empty">
                        <div className="mv-empty-icon">📭</div>
                        <p>No accounts found. Open your first account!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;