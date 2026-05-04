import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerMenu from './CustomerMenu';
import '../../styles/App.css';

const CustomerLoanApplications = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/v1/customer/my-loan-applications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoans(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching loans:', error);
            setLoading(false);
        }
    };

    const getBadgeClass = (status) => {
        if (status === 'APPROVED') return 'mv-badge-approved';
        if (status === 'REJECTED') return 'mv-badge-rejected';
        return 'mv-badge-pending';
    };

    return (
        <div>
            <CustomerMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">My Loan Applications</h2>
                {loading ? (
                    <div className="mv-loading">Loading loan applications...</div>
                ) : loans.length > 0 ? (
                    <div className="mv-table-wrapper">
                        <table className="mv-table">
                            <thead>
                                <tr>
                                    <th>App ID</th>
                                    <th>Loan ID</th>
                                    <th>Requested Amount (₹)</th>
                                    <th>Purpose</th>
                                    <th>Application Date</th>
                                    <th>Status</th>
                                    <th>Approval Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map((loan) => (
                                    <tr key={loan.applicationId}>
                                        <td><strong>{loan.applicationId}</strong></td>
                                        <td>{loan.loanId}</td>
                                        <td>₹{loan.requestedAmount?.toLocaleString()}</td>
                                        <td>{loan.purpose}</td>
                                        <td>{new Date(loan.applicationDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`mv-badge ${getBadgeClass(loan.status)}`}>
                                                {loan.status}
                                            </span>
                                        </td>
                                        <td>{loan.approvalDate ? new Date(loan.approvalDate).toLocaleDateString() : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="mv-empty">
                        <div className="mv-empty-icon">📋</div>
                        <p>No loan applications yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerLoanApplications;