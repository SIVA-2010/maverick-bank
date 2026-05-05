import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeMenu from './EmployeeMenu';
import '../../styles/App.css';

const AllCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://16.171.9.141:5000/api/v1/employee/customers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <EmployeeMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">All Customers</h2>
                {loading ? (
                    <div className="mv-loading">Loading customers...</div>
                ) : (
                    <div className="mv-table-wrapper">
                        <table className="mv-table">
                            <thead>
                                <tr>
                                    <th>Customer ID</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Aadhar No</th>
                                    <th>PAN No</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((cust) => (
                                    <tr key={cust.customerId}>
                                        <td><strong>{cust.customerId}</strong></td>
                                        <td>{cust.name}</td>
                                        <td>{cust.gender}</td>
                                        <td>{cust.email}</td>
                                        <td>{cust.phone}</td>
                                        <td>{cust.aadharNumber}</td>
                                        <td>{cust.panNumber}</td>
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

export default AllCustomers;