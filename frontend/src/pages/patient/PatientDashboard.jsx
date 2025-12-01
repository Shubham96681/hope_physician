import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import { FaCalendarAlt, FaFileMedical, FaBell } from 'react-icons/fa';

const PatientDashboard = () => {
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setAppointments([
        { id: 1, doctor: 'Dr. Okonkwo', date: '2024-01-20', time: '10:00 AM', status: 'scheduled' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your appointments and health records</p>
            </div>
            <Link to="/patient/book">
              <Button>Book Appointment</Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/patient/appointments" className="block">
                <FaCalendarAlt className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-gray-900">My Appointments</h3>
                <p className="text-sm text-gray-600 mt-1">View and manage appointments</p>
              </Link>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/patient/kyc" className="block">
                <FaFileMedical className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-gray-900">KYC Documents</h3>
                <p className="text-sm text-gray-600 mt-1">Upload and track documents</p>
              </Link>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/patient/notifications" className="block">
                <FaBell className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600 mt-1">View messages and updates</p>
              </Link>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card title="Upcoming Appointments">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No upcoming appointments</p>
                <Link to="/patient/book">
                  <Button>Book Your First Appointment</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{apt.doctor}</p>
                      <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                    </div>
                    <Badge variant="primary">{apt.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientDashboard;

