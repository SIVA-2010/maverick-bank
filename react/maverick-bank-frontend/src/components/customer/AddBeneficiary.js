import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomerMenu from './CustomerMenu';
import '../../styles/App.css';
import { API_BASE_URL } from '../../apiConfig';

const BRANCHES = {
    'Chennai': { address: '123 Anna Salai, Chennai, TN', ifsc: 'MAVK000CHN1' },
    'Mumbai': { address: '456 Nariman Point, Mumbai, MH', ifsc: 'MAVK000MUM2' },
    'Bengaluru': { address: '789 MG Road, Bengaluru, KA', ifsc: 'MAVK000BLR3' }
};

const AddBeneficiary = () => {
    const [beneficiary, setBeneficiary] = useState({
        beneficiaryId: Math.floor(Math.random() * 10000),
        accountName: '',
        accountNumber: '',
        bankName: 'Maverick Bank',
        branchName: '',
        ifscCode: ''
    });
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');
    const navigate = useNavigate();

    const handleBranchChange = (e) => {
        const selectedBranch = e.target.value;
        setBeneficiary({
            ...beneficiary,
            branchName: selectedBranch,
            ifscCode: selectedBranch ? BRANCHES[selectedBranch].ifsc : ''
        });
    };

    const handleSubmit = async () => {
        if (!beneficiary.branchName || !beneficiary.accountName || !beneficiary.accountNumber) {
            setMessage('Please fill in all details.');
            setMsgType('error');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post(API_BASE_URL + '/customer/beneficiary', beneficiary, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Beneficiary added successfully!');
            setMsgType('success');
            setTimeout(() => navigate('/customer-beneficiaries'), 2000);
        } catch (error) {
            setMessage('Error adding beneficiary');
            setMsgType('error');
            console.error(error);
        }
    };

    return (
        <div>
            <CustomerMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Add Beneficiary</h2>
                <div className="mv-card" style={{ maxWidth: '500px' }}>
                    <h3>👤 New Beneficiary</h3>
                    <div className="mv-form-group">
                        <label>Account Name</label>
                        <input className="mv-input" type="text" placeholder="Enter account name" value={beneficiary.accountName} onChange={(e) => setBeneficiary({ ...beneficiary, accountName: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Account Number</label>
                        <input className="mv-input" type="text" placeholder="Enter account number" value={beneficiary.accountNumber} onChange={(e) => setBeneficiary({ ...beneficiary, accountNumber: e.target.value })} />
                    </div>
                    <div className="mv-form-group">
                        <label>Bank Name</label>
                        <input className="mv-input" type="text" value={beneficiary.bankName} readOnly style={{ background: '#f1f5f9' }} />
                    </div>
                    <div className="mv-form-group">
                        <label>Branch Name</label>
                        <select className="mv-select" value={beneficiary.branchName} onChange={handleBranchChange}>
                            <option value="">Select a Branch</option>
                            {Object.keys(BRANCHES).map(branch => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mv-form-group">
                        <label>IFSC Code</label>
                        <input className="mv-input" type="text" placeholder="IFSC Code" value={beneficiary.ifscCode} readOnly style={{ background: '#f1f5f9' }} />
                    </div>
                    {message && <div className={`mv-alert ${msgType === 'success' ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}
                    <button className="mv-btn mv-btn-primary mv-btn-block" onClick={handleSubmit} style={{ marginTop: '16px' }}>Add Beneficiary</button>
                </div>
            </div>
        </div>
    );
};

export default AddBeneficiary;