import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PhoneNumbersPage from './pages/PhoneNumbersPage';
import PortingPage from './pages/PortingPage';
import FraudAlertsPage from './pages/FraudAlertsPage';
import AuditLogPage from './pages/AuditLogPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg m-4">
          Something went wrong in this section. Please refresh.
        </div>
      );
    }
    return this.props.children;
  }
}

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0B]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: '#111114', color: '#E4E4E7', border: '1px solid #27272A' } }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout><DashboardPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/phones"
            element={
              <ProtectedRoute>
                <AppLayout><PhoneNumbersPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/porting"
            element={
              <ProtectedRoute>
                <AppLayout><PortingPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fraud"
            element={
              <ProtectedRoute>
                <AppLayout><FraudAlertsPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute>
                <AppLayout><AuditLogPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
