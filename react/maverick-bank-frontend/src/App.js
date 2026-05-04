import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import HomePage from './components/homepage/homepage';
import CustomerLogin from './components/auth/CustomerLogin';
import EmployeeLogin from './components/auth/EmployeeLogin';
import AdminLogin from './components/auth/AdminLogin';
import CustomerMenu from './components/customer/CustomerMenu';
import CustomerDashboard from './components/customer/CustomerDashboard';
import CustomerAccounts from './components/customer/CustomerAccounts.js';
import CustomerBeneficiaries from './components/customer/CustomerBeneficiaries';
import CustomerTransactions from './components/customer/CustomerTransactions';
import CustomerLoanApplications from './components/customer/CustomerLoanApplications';
import ApplyForLoan from './components/customer/ApplyForLoan';
import AddBeneficiary from './components/customer/AddBeneficiary';
import EmployeeMenu from './components/employee/EmployeeMenu';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import AllCustomers from './components/employee/AllCustomers';
import AllAccounts from './components/employee/AllAccounts';
import AllTransactions from './components/employee/AllTransactions';
import LoanApplicationsList from './components/employee/LoanApplicationsList';
import AdminMenu from './components/admin/AdminMenu';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageEmployees from './components/admin/ManageEmployees';
import ManageAdmins from './components/admin/ManageAdmins';
import RegisterEmployee from './components/admin/RegisterEmployee';
import CustomerRegister from './components/auth/CustomerRegister';
import RegisterAdmin from './components/admin/RegisterAdmin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/customer-menu" element={<CustomerMenu />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/customer-accounts" element={<CustomerAccounts />} />
          <Route path="/customer-beneficiaries" element={<CustomerBeneficiaries />} />
          <Route path="/customer-transactions" element={<CustomerTransactions />} />
          <Route path="/customer-loans" element={<CustomerLoanApplications />} />
          <Route path="/apply-loan" element={<ApplyForLoan />} />
          <Route path="/add-beneficiary" element={<AddBeneficiary />} />
          <Route path="/employee-menu" element={<EmployeeMenu />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/all-customers" element={<AllCustomers />} />
          <Route path="/all-accounts" element={<AllAccounts />} />
          <Route path="/all-transactions" element={<AllTransactions />} />
          <Route path="/loan-applications" element={<LoanApplicationsList />} />
          <Route path="/admin-menu" element={<AdminMenu />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manage-employees" element={<ManageEmployees />} />
          <Route path="/manage-admins" element={<ManageAdmins />} />
          <Route path="/register-employee" element={<RegisterEmployee />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;