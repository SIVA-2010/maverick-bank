import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerMenu from './CustomerMenu';
import '../../styles/App.css';

const CustomerTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');
    const [activeTab, setActiveTab] = useState('history');

    const [beneficiaries, setBeneficiaries] = useState([]);

    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
        fetchBeneficiaries();
    }, []);

    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/v1/customer/my-accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/v1/customer/my-transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchBeneficiaries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/v1/customer/my-beneficiaries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBeneficiaries(response.data);
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
        }
    };

    const showMsg = (text, type = 'success') => {
        setMessage(text);
        setMsgType(type);
        setTimeout(() => setMessage(''), 4000);
    };

    const handleDeposit = async () => {
        if (!selectedAccount || !depositAmount || depositAmount <= 0) {
            showMsg('Please select an account and enter a valid amount.', 'error');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/v1/customer/deposit/${selectedAccount}/${depositAmount}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMsg(res.data || `Deposited ₹${depositAmount} successfully!`);
            fetchAccounts();
            fetchTransactions();
            setDepositAmount('');
        } catch (error) {
            showMsg(error.response?.data || 'Error making deposit', 'error');
        }
    };

    const handleWithdraw = async () => {
        if (!selectedAccount || !withdrawAmount || withdrawAmount <= 0) {
            showMsg('Please select an account and enter a valid amount.', 'error');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/v1/customer/withdraw/${selectedAccount}/${withdrawAmount}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMsg(res.data || `Withdrawn ₹${withdrawAmount} successfully!`);
            fetchAccounts();
            fetchTransactions();
            setWithdrawAmount('');
        } catch (error) {
            showMsg(error.response?.data || 'Insufficient balance or error', 'error');
        }
    };

    const handleTransfer = async () => {
        if (!fromAccount || !toAccount || !amount || amount <= 0) {
            showMsg('Please fill in all transfer fields.', 'error');
            return;
        }
        if (fromAccount === toAccount) {
            showMsg('Cannot transfer to the same account.', 'error');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/v1/customer/transfer/${fromAccount}/${toAccount}/${amount}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMsg(res.data || `Transferred ₹${amount} successfully!`);
            fetchAccounts();
            fetchTransactions();
            setFromAccount('');
            setToAccount('');
            setAmount('');
        } catch (error) {
            showMsg(error.response?.data || 'Transfer failed', 'error');
        }
    };

    return (
        <div>
            <CustomerMenu />
            <div className="mv-container">
                <h2 className="mv-page-title">Transactions</h2>

                <div className="mv-tab-group">
                    <button className={`mv-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>📋 History</button>
                    <button className={`mv-tab ${activeTab === 'deposit' ? 'active' : ''}`} onClick={() => setActiveTab('deposit')}>💰 Deposit</button>
                    <button className={`mv-tab ${activeTab === 'withdraw' ? 'active' : ''}`} onClick={() => setActiveTab('withdraw')}>🏧 Withdraw</button>
                    <button className={`mv-tab ${activeTab === 'transfer' ? 'active' : ''}`} onClick={() => setActiveTab('transfer')}>🔄 Transfer</button>
                </div>

                {message && <div className={`mv-alert ${msgType === 'success' ? 'mv-alert-success' : 'mv-alert-error'}`}>{message}</div>}

                {activeTab === 'history' && (
                    transactions.length > 0 ? (
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
                                            <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{txn.transactionId.substring(0, 8)}...</td>
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
                            <p>No transactions yet. Make your first deposit!</p>
                        </div>
                    )
                )}

                {activeTab === 'deposit' && (
                    <div className="mv-card" style={{ maxWidth: '500px' }}>
                        <h3>💰 Deposit Money</h3>
                        <div className="mv-form-group">
                            <label>Select Account</label>
                            <select className="mv-select" value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                                <option value="">Select Account</option>
                                {accounts.filter(acc => acc.status === 'ACTIVE').map(acc => (
                                    <option key={acc.accountNo} value={acc.accountNo}>
                                        {acc.accountNo} - {acc.type} - Balance: ₹{acc.balance?.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mv-form-group">
                            <label>Amount to Deposit (₹)</label>
                            <input className="mv-input" type="number" min="1" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Enter amount" />
                        </div>
                        <button className="mv-btn mv-btn-success mv-btn-block" onClick={handleDeposit}>Deposit</button>
                    </div>
                )}

                {activeTab === 'withdraw' && (
                    <div className="mv-card" style={{ maxWidth: '500px' }}>
                        <h3>🏧 Withdraw Money</h3>
                        <div className="mv-form-group">
                            <label>Select Account</label>
                            <select className="mv-select" value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                                <option value="">Select Account</option>
                                {accounts.filter(acc => acc.status === 'ACTIVE').map(acc => (
                                    <option key={acc.accountNo} value={acc.accountNo}>
                                        {acc.accountNo} - {acc.type} - Balance: ₹{acc.balance?.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mv-form-group">
                            <label>Amount to Withdraw (₹)</label>
                            <input className="mv-input" type="number" min="1" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter amount" />
                        </div>
                        <button className="mv-btn mv-btn-danger mv-btn-block" onClick={handleWithdraw}>Withdraw</button>
                    </div>
                )}

                {activeTab === 'transfer' && (
                    <div className="mv-card" style={{ maxWidth: '500px' }}>
                        <h3>🔄 Transfer Money</h3>
                        <div className="mv-form-group">
                            <label>From Account</label>
                            <select className="mv-select" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
                                <option value="">Select Account</option>
                                {accounts.filter(acc => acc.status === 'ACTIVE').map(acc => (
                                    <option key={acc.accountNo} value={acc.accountNo}>
                                        {acc.accountNo} - {acc.type} - Balance: ₹{acc.balance?.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mv-form-group">
                            <label>To Account Number</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input className="mv-input" type="text" value={toAccount} onChange={(e) => setToAccount(e.target.value)} placeholder="Enter destination account number" style={{ flex: 1 }} />
                                <select className="mv-select" style={{ width: 'auto' }} onChange={(e) => setToAccount(e.target.value)} value={beneficiaries.some(b => b.accountNumber === toAccount) ? toAccount : ""}>
                                    <option value="">Select Beneficiary...</option>
                                    {beneficiaries.map(ben => (
                                        <option key={ben.beneficiaryId} value={ben.accountNumber}>
                                            {ben.accountName} ({ben.accountNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mv-form-group">
                            <label>Amount to Transfer (₹)</label>
                            <input className="mv-input" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
                        </div>
                        <button className="mv-btn mv-btn-primary mv-btn-block" onClick={handleTransfer}>Transfer</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerTransactions;