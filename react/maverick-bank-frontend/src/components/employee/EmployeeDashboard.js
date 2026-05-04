import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeMenu from './EmployeeMenu';
import '../../styles/App.css';

const EmployeeDashboard = () => {
    const [stats, setStats] = useState({
        customers: 0,
        accounts: 0,
        transactions: 0,
        pendingLoans: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const customers = await axios.get('http://localhost:5000/api/v1/employee/customers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const accounts = await axios.get('http://localhost:5000/api/v1/employee/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const transactions = await axios.get('http://localhost:5000/api/v1/employee/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const loans = await axios.get('http://localhost:5000/api/v1/employee/loan-applications', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStats({
                customers: customers.data.length,
                accounts: accounts.data.length,
                transactions: transactions.data.length,
                pendingLoans: loans.data.filter(l => l.status === 'PENDING').length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div>
            <EmployeeMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Employee Dashboard 📊</h2>
                <div className="mv-stats-grid">
                    <div className="mv-stat-card blue">
                        <h3>{stats.customers}</h3>
                        <p>Total Customers</p>
                    </div>
                    <div className="mv-stat-card green">
                        <h3>{stats.accounts}</h3>
                        <p>Total Accounts</p>
                    </div>
                    <div className="mv-stat-card purple">
                        <h3>{stats.transactions}</h3>
                        <p>Total Transactions</p>
                    </div>
                    <div className="mv-stat-card orange">
                        <h3>{stats.pendingLoans}</h3>
                        <p>Pending Loans</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;