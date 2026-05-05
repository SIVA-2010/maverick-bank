import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomerMenu from './CustomerMenu';
import '../../styles/App.css';
import { API_BASE_URL } from '../../apiConfig';

const ApplyForLoan = () => {
    const [loanProducts, setLoanProducts] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState('');
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        fetchLoanProducts();
    }, []);

    const fetchLoanProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://16.171.9.141:5000/api/loans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoanProducts(response.data);
        } catch (error) {
            console.error('Error fetching loan products:', error);
        }
    };

    const handleSubmit = async () => {
        if (!selectedLoan || !amount || !purpose) {
            setMessage('Please fill in all fields.');
            setMsgType('error');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post(API_BASE_URL + '/customer/loan-application', {
                loanId: selectedLoan,
                requestedAmount: parseFloat(amount),
                purpose: purpose
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Loan application submitted successfully!');
            setMsgType('success');
            setTimeout(() => navigate('/customer-loans'), 2000);
        } catch (error) {
            setMessage(error.response?.data || 'Error submitting application');
            setMsgType('error');
        }
    };

    const selectedLoanDetails = loanProducts.find(l => l.loanId === selectedLoan);

    return (
        <div>
            <CustomerMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Apply for Loan</h2>
                <div className="mv-card" style={{ maxWidth: '550px' }}>
                    <h3>📄 Loan Application Form</h3>
                    <div className="mv-form-group">
                        <label>Select Loan Type</label>
                        <select className="mv-select" value={selectedLoan} onChange={(e) => setSelectedLoan(e.target.value)}>
                            <option value="">Select Loan</option>
                            {loanProducts.map(loan => (
                                <option key={loan.loanId} value={loan.loanId}>
                                    {loan.loanType} - {loan.interestRate}% interest
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedLoanDetails && (
                        <div className="mv-loan-info">
                            <p><strong>Eligibility:</strong> {selectedLoanDetails.eligibilityCriteria}</p>
                            <p><strong>Interest Rate:</strong> {selectedLoanDetails.interestRate}%</p>
                            <p><strong>Max Amount:</strong> ₹{selectedLoanDetails.amount?.toLocaleString()}</p>
                            <p><strong>Tenure:</strong> {selectedLoanDetails.tenure} months</p>
                        </div>
                    )}

                    <div className="mv-form-group">
                        <label>Requested Amount (₹)</label>
                        <input className="mv-input" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter loan amount" />
                    </div>

                    <div className="mv-form-group">
                        <label>Purpose</label>
                        <textarea className="mv-textarea" rows="3" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Describe the purpose of this loan" />
                    </div>

                    {message && <div className={`mv-alert ${msgType === 'success' ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}
                    <button className="mv-btn mv-btn-primary mv-btn-block" onClick={handleSubmit} style={{ marginTop: '16px' }}>
                        Submit Application
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyForLoan;