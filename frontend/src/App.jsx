// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import VerifyEmail from './Pages/VerifyEmail';
import Dashboard from './Pages/Dashboard';
import Accounts from './Pages/Accounts';
import Goals from './Pages/Goals';
import Transactions from './Pages/Transactions';
import Advisor from './Pages/Advisor';
import Settings from './Pages/Settings';
import AddTransaction from './Pages/AddTransaction';
import ResetPassword from './Pages/ResetPassword';
import ForgotPassword from './Pages/ForgotPassword';
import VerifyLogin from './Pages/VerifyLogin';
import Sidebar from './Components/Sidebar';
import { TransactionsProvider } from './Hooks/useTransactions';
import TransactionsTable from './Components/TransactionsTable';

function App() {
  return (
    <TransactionsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/ai-advisor" element={<Advisor />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-login" element={<VerifyLogin />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/transactions-table" element={<TransactionsTable />} />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen text-2xl text-red-600">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </TransactionsProvider>
  );
}

export default App;
