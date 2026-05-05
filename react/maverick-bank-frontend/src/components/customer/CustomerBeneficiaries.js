import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerMenu from './CustomerMenu';
import '../../styles/App.css';
import { API_BASE_URL } from '../../apiConfig';

const CustomerBeneficiaries = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const fetchBeneficiaries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_BASE_URL + '/customer/my-beneficiaries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBeneficiaries(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <CustomerMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">My Beneficiaries</h2>
                {loading ? (
                    <div className="mv-loading">Loading beneficiaries...</div>
                ) : beneficiaries.length > 0 ? (
                    <div className="mv-table-wrapper">
                        <table className="mv-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Account Name</th>
                                    <th>Account Number</th>
                                    <th>Bank Name</th>
                                    <th>Branch</th>
                                    <th>IFSC Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beneficiaries.map((ben) => (
                                    <tr key={ben.beneficiaryId}>
                                        <td><strong>{ben.beneficiaryId}</strong></td>
                                        <td>{ben.accountName}</td>
                                        <td>{ben.accountNumber}</td>
                                        <td>{ben.bankName}</td>
                                        <td>{ben.branchName}</td>
                                        <td>{ben.ifscCode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="mv-empty">
                        <div className="mv-empty-icon">👥</div>
                        <p>No beneficiaries added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerBeneficiaries;