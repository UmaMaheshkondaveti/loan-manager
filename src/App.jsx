import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from '@/pages/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ApplicationFormPage from '@/pages/ApplicationFormPage';
import LoansPage from '@/pages/LoansPage';
import UserLoanViewPage from '@/pages/UserLoanViewPage';
import { Toaster } from '@/components/ui/toaster';
import useChatData from '@/hooks/useChatData'; // Keep this if you're using it elsewhere

export const UserRoleContext = React.createContext();

function App() {
  // Persist userRole using localStorage
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'user');

  useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/apply" replace />} />
            <Route path="apply" element={<ApplicationFormPage />} />
            <Route path="dashboard" element={userRole === 'admin' ? <DashboardPage /> : <Navigate to="/my-loans" replace />} />
            <Route path="loans" element={userRole === 'admin' ? <LoansPage /> : <Navigate to="/my-loans" replace />} />
            <Route path="my-loans" element={userRole === 'user' ? <UserLoanViewPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
            <Route path="borrowers" element={userRole === 'admin' ? <PlaceholderPage title="Borrowers" /> : <Navigate to="/my-loans" replace />} />
            <Route path="portfolio" element={<PlaceholderPage title="Loan Portfolio" />} />
            <Route path="payments" element={<PlaceholderPage title="Payments" />} />
            <Route path="savings" element={<PlaceholderPage title="Savings" />} />
            <Route path="accounts" element={<PlaceholderPage title="Accounts" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="logout" element={<LogoutSimulation />} />
            <Route path="*" element={<Navigate to="/apply" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </UserRoleContext.Provider>
  );
}

export const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full p-10 text-center">
    <img className="w-64 h-64 mb-8 opacity-50" alt="Under construction illustration" src="https://images.unsplash.com/photo-1495104353955-305782baa7be" />
    <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
    <p className="text-xl text-muted-foreground">This page is currently under construction.</p>
    <p className="text-md text-muted-foreground mt-2">Check back soon for updates!</p>
  </div>
);

const LogoutSimulation = () => {
  const navigate = useNavigate();
  const { setUserRole } = React.useContext(UserRoleContext);

  useEffect(() => {
    alert("Simulating Sign Out. In a real app, you'd clear tokens and redirect.");
    setUserRole('user');
    localStorage.setItem('userRole', 'user');
    navigate('/apply');
  }, [navigate, setUserRole]);

  return null;
};

export default App;
