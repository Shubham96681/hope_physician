/**
 * Patient Layout Component
 * Wraps patient pages with navigation and layout
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../ProtectedRoute';
import {
  FaHome,
  FaCalendarAlt,
  FaFileMedical,
  FaDollarSign,
  FaPills,
  FaUser,
  FaShieldAlt,
  FaComments,
  FaHospital,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/patient', label: 'Dashboard', icon: FaHome },
    { path: '/patient/appointments', label: 'Appointments', icon: FaCalendarAlt },
    { path: '/patient/prescriptions', label: 'Prescriptions', icon: FaPills },
    { path: '/patient/reports', label: 'Reports', icon: FaFileMedical },
    { path: '/patient/billing', label: 'Billing', icon: FaDollarSign },
    { path: '/patient/insurance', label: 'Insurance', icon: FaShieldAlt },
    { path: '/patient/chat', label: 'Chat Support', icon: FaComments },
    { path: '/patient/admission', label: 'Admission', icon: FaHospital },
    { path: '/patient/profile', label: 'Profile', icon: FaUser },
    { path: '/patient/kyc-documents', label: 'KYC Documents', icon: FaFileMedical },
  ];

  const handleLogout = () => {
    logout();
    navigate('/portal/login');
  };

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-blue-600">Patient Portal</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 border-b bg-gray-50">
                <p className="font-semibold text-gray-900">{user.name || user.email}</p>
                <p className="text-sm text-gray-600">Patient</p>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FaBars className="text-xl" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PatientLayout;

