import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMenu from './AdminMenu';
import '../../styles/App.css';
import { API_BASE_URL } from '../../apiConfig';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        admins: 0,
        employees: 0,
        customers: 0,
        accounts: 0,
        transactions: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const admins = await axios.get(API_BASE_URL + '/admin/admins', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const employees = await axios.get(API_BASE_URL + '/admin/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const customers = await axios.get(API_BASE_URL + '/employee/customers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const accounts = await axios.get(API_BASE_URL + '/employee/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const transactions = await axios.get(API_BASE_URL + '/employee/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStats({
                admins: admins.data.length,
                employees: employees.data.length,
                customers: customers.data.length,
                accounts: accounts.data.length,
                transactions: transactions.data.length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div>
            <AdminMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Admin Control Panel 🛡️</h2>
                <div className="mv-stats-grid">
                    <div className="mv-stat-card red">
                        <h3>{stats.admins}</h3>
                        <p>Total Admins</p>
                    </div>
                    <div className="mv-stat-card purple">
                        <h3>{stats.employees}</h3>
                        <p>Total Employees</p>
                    </div>
                    <div className="mv-stat-card blue">
                        <h3>{stats.customers}</h3>
                        <p>Total Customers</p>
                    </div>
                    <div className="mv-stat-card green">
                        <h3>{stats.accounts}</h3>
                        <p>Total Accounts</p>
                    </div>
                    <div className="mv-stat-card orange">
                        <h3>{stats.transactions}</h3>
                        <p>Total Transactions</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;