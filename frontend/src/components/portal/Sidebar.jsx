import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaUsers,
  FaFileMedical,
  FaUserCheck,
  FaClock,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaBookMedical,
  FaPrescription,
  FaFileUpload,
  FaUserCircle
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const menuItems = {
    admin: [
      { path: '/admin', icon: FaHome, label: 'Dashboard' },
      { path: '/admin/employees', icon: FaUsers, label: 'Employees' },
      { path: '/admin/patients', icon: FaUserCircle, label: 'Patients' },
      { path: '/admin/doctors', icon: FaUserMd, label: 'Doctors' },
      { path: '/admin/appointments', icon: FaCalendarAlt, label: 'Appointments' },
      { path: '/admin/kyc', icon: FaFileMedical, label: 'KYC Review' },
      { path: '/admin/attendance', icon: FaClock, label: 'Attendance' },
      { path: '/admin/notifications', icon: FaBell, label: 'Notifications' },
      { path: '/admin/settings', icon: FaCog, label: 'Settings' }
    ],
    doctor: [
      { path: '/doctor', icon: FaHome, label: 'Dashboard' },
      { path: '/doctor/appointments', icon: FaCalendarAlt, label: 'Appointments' },
      { path: '/doctor/patients', icon: FaUserCircle, label: 'Patients' },
      { path: '/doctor/calendar', icon: FaCalendarAlt, label: 'Calendar' },
      { path: '/doctor/notifications', icon: FaBell, label: 'Notifications' }
    ],
    patient: [
      { path: '/patient', icon: FaHome, label: 'Dashboard' },
      { path: '/patient/appointments', icon: FaCalendarAlt, label: 'My Appointments' },
      { path: '/patient/book', icon: FaBookMedical, label: 'Book Appointment' },
      { path: '/patient/profile', icon: FaUserCircle, label: 'Profile' },
      { path: '/patient/kyc', icon: FaFileUpload, label: 'KYC Documents' },
      { path: '/patient/notifications', icon: FaBell, label: 'Notifications' }
    ],
    staff: [
      { path: '/staff', icon: FaHome, label: 'Dashboard' },
      { path: '/staff/attendance', icon: FaClock, label: 'Attendance' },
      { path: '/staff/kyc-assist', icon: FaFileMedical, label: 'KYC Assistance' },
      { path: '/staff/notifications', icon: FaBell, label: 'Notifications' }
    ]
  };

  const items = menuItems[user?.role] || [];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-primary">Hope Physicians</h2>
            <p className="text-sm text-gray-500 capitalize">{user?.role} Portal</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-colors duration-200
                        ${isActive(item.path)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

