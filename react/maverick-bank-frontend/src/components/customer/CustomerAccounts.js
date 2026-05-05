import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerMenu from './CustomerMenu';
import '../../styles/App.css';

const BRANCHES = {
    'Chennai': { address: '123 Anna Salai, Chennai, TN', ifsc: 'MAVK000CHN1' },
    'Mumbai': { address: '456 Nariman Point, Mumbai, MH', ifsc: 'MAVK000MUM2' },
    'Bengaluru': { address: '789 MG Road, Bengaluru, KA', ifsc: 'MAVK000BLR3' }
};

const CustomerAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    const generateDummyAccount = () => {
        const branches = Object.keys(BRANCHES);
        const randomBranch = branches[Math.floor(Math.random() * branches.length)];
        return {
            accountNo: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
            accountName: 'Test User ' + Math.floor(Math.random() * 1000),
            type: 'Savings',
            balance: 10000,
            branchName: randomBranch,
            branchAddress: BRANCHES[randomBranch].address,
            ifsc: BRANCHES[randomBranch].ifsc,
            openingDate: new Date().toISOString().split('T')[0],
            status: 'PENDING'
        };
    };

    const [newAccount, setNewAccount] = useState(generateDummyAccount());
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://16.171.9.141:5000/api/v1/customer/my-accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleOpenAccount = async () => {
        if (!newAccount.branchName) {
            setMessage('Please select a branch.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://16.171.9.141:5000/api/v1/customer/open-account', newAccount, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Account requested successfully! Pending employee approval.');
            setShowForm(false);
            fetchAccounts();
            setNewAccount(generateDummyAccount());
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error opening account');
            console.error(error);
        }
    };

    const handleBranchChange = (e) => {
        const selectedBranch = e.target.value;
        setNewAccount({
            ...newAccount,
            branchName: selectedBranch,
            branchAddress: selectedBranch ? BRANCHES[selectedBranch].address : '',
            ifsc: selectedBranch ? BRANCHES[selectedBranch].ifsc : ''
        });
    };

    const getBadgeClass = (status) => {
        if (status === 'ACTIVE') return 'mv-badge-active';
        if (status === 'REJECTED') return 'mv-badge-rejected';
        return 'mv-badge-pending';
    };

    return (
        <div>
            <CustomerMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">My Accounts</h2>

                <button className="mv-btn mv-btn-primary" onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px' }}>
                    {showForm ? '✕ Cancel' : '+ Open New Account'}
                </button>

                {showForm && (
                    <div className="mv-card">
                        <h3>Open New Account</h3>
                        <div className="mv-form-grid">
                            <div className="mv-form-group">
                                <label>Account Number</label>
                                <input className="mv-input" type="text" placeholder="Account Number" value={newAccount.accountNo} onChange={(e) => setNewAccount({ ...newAccount, accountNo: e.target.value })} />
                            </div>
                            <div className="mv-form-group">
                                <label>Account Name</label>
                                <input className="mv-input" type="text" placeholder="Account Name" value={newAccount.accountName} onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })} />
                            </div>
                            <div className="mv-form-group">
                                <label>Account Type</label>
                                <select className="mv-select" value={newAccount.type} onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}>
                                    <option value="Savings">Savings</option>
                                    <option value="Checking">Checking</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>
                            <div className="mv-form-group">
                                <label>Initial Deposit (₹)</label>
                                <input className="mv-input" type="number" placeholder="Initial Deposit" value={newAccount.balance} onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) })} />
                            </div>
                            <div className="mv-form-group">
                                <label>Branch Name</label>
                                <select className="mv-select" value={newAccount.branchName} onChange={handleBranchChange}>
                                    <option value="">Select a Branch</option>
                                    {Object.keys(BRANCHES).map(branch => (
                                        <option key={branch} value={branch}>{branch}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mv-form-group">
                                <label>Branch Address</label>
                                <input className="mv-input" type="text" placeholder="Branch Address" value={newAccount.branchAddress} readOnly style={{ background: '#f1f5f9' }} />
                            </div>
                            <div className="mv-form-group">
                                <label>IFSC Code</label>
                                <input className="mv-input" type="text" placeholder="IFSC Code" value={newAccount.ifsc} readOnly style={{ background: '#f1f5f9' }} />
                            </div>
                        </div>
                        <button className="mv-btn mv-btn-success mv-btn-block" onClick={handleOpenAccount} style={{ marginTop: '16px' }}>Submit Request</button>
                    </div>
                )}

                {message && <div className="mv-alert mv-alert-success">{message}</div>}

                <div className="mv-table-wrapper">
                    <table className="mv-table">
                        <thead>
                            <tr>
                                <th>Account No</th>
                                <th>Account Name</th>
                                <th>Type</th>
                                <th>Balance (₹)</th>
                                <th>Branch</th>
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
                                    <td>{acc.branchName}</td>
                                    <td>{acc.ifsc}</td>
                                    <td>
                                        <span className={`mv-badge ${getBadgeClass(acc.status)}`}>
                                            {acc.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerAccounts;