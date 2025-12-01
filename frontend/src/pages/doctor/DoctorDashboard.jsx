import React from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import { FaCalendarAlt, FaUserInjured, FaClock } from 'react-icons/fa';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch appointments
    setTimeout(() => {
      setAppointments([
        { id: 1, patient: 'John Doe', time: '10:00 AM', status: 'scheduled' },
        { id: 2, patient: 'Jane Smith', time: '11:00 AM', status: 'scheduled' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-1">Today's schedule and patient information</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
                <FaCalendarAlt className="w-8 h-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <FaClock className="w-8 h-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                </div>
                <FaUserInjured className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </div>

          {/* Today's Appointments */}
          <Card title="Today's Appointments">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No appointments scheduled for today</div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{apt.patient}</p>
                      <p className="text-sm text-gray-500">{apt.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="primary">{apt.status}</Badge>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                        View Details
                      </button>
                    </div>
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

export default DoctorDashboard;

