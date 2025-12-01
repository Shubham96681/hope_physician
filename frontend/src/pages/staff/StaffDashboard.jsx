import React, { useState } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Badge from '../../components/shared/Badge';
import { FaClock, FaCheckCircle, FaFileMedical } from 'react-icons/fa';

const StaffDashboard = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now.toLocaleString());
    setCheckedIn(true);
    // In production, this would call the API
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    setCheckInTime(null);
    // In production, this would call the API
  };

  return (
    <ProtectedRoute allowedRoles={['staff', 'hr']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your attendance and tasks</p>
          </div>

          {/* Attendance Card */}
          <Card title="Attendance" className="bg-gradient-to-r from-primary to-primary-600 text-white">
            <div className="p-6">
              {!checkedIn ? (
                <div className="text-center">
                  <FaClock className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-xl mb-4">Ready to check in?</p>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleCheckIn}
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    Check In
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <FaCheckCircle className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-xl mb-2">Checked In</p>
                  <p className="text-sm opacity-80 mb-4">Time: {checkInTime}</p>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleCheckOut}
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    Check Out
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Today's Tasks" className="h-full">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Assist with KYC uploads</p>
                  <p className="text-sm text-gray-500">3 pending</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Schedule appointments</p>
                  <p className="text-sm text-gray-500">5 requests</p>
                </div>
              </div>
            </Card>

            <Card title="KYC Assistance" className="h-full">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">Patient Name</p>
                    <p className="text-sm text-gray-500">Needs help uploading</p>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default StaffDashboard;

