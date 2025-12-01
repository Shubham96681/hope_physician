import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import { 
  FaCalendarAlt, 
  FaFileMedical, 
  FaBell,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserMd,
  FaCalendarCheck
} from 'react-icons/fa';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 2,
    completed: 15,
    pendingKYC: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAppointments([
        { 
          id: 1, 
          doctor: 'Dr. Okonkwo', 
          department: 'Family Medicine',
          date: '2024-01-25', 
          time: '10:00 AM', 
          status: 'scheduled',
          type: 'Follow-up'
        },
        { 
          id: 2, 
          doctor: 'Dr. Williams', 
          department: 'Cardiology',
          date: '2024-01-28', 
          time: '02:30 PM', 
          status: 'scheduled',
          type: 'Consultation'
        },
        { 
          id: 3, 
          doctor: 'Dr. Okonkwo', 
          department: 'Family Medicine',
          date: '2024-01-15', 
          time: '11:00 AM', 
          status: 'completed',
          type: 'Checkup'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'completed': 'success',
      'cancelled': 'danger',
      'pending': 'warning'
    };
    return variants[status] || 'default';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your appointments and health records</p>
          </div>
          <Link to="/patient/book-appointment">
            <Button>
              <FaCalendarCheck className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
                <p className="text-xs text-blue-600 mt-1">Next appointments</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FaCalendarAlt className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-xs text-green-600 mt-1">Total visits</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">KYC Status</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingKYC}</p>
                <p className="text-xs text-amber-600 mt-1">Pending review</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <FaFileMedical className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/patient/book-appointment">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaCalendarCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                  <p className="text-sm text-gray-600">Schedule a new visit</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/patient/kyc-documents">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <FaFileMedical className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">KYC Documents</h3>
                  <p className="text-sm text-gray-600">Upload and track documents</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/patient/notifications">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-100 rounded-xl">
                  <FaBell className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">View messages and updates</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <Card 
          title="Upcoming Appointments" 
          subtitle="Your scheduled visits"
          actions={
            <Link to="/patient/appointments">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          }
        >
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : appointments.filter(a => a.status === 'scheduled').length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No upcoming appointments</p>
              <Link to="/patient/book-appointment">
                <Button>Book Your First Appointment</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments
                .filter(apt => apt.status === 'scheduled')
                .map((apt) => (
                  <div 
                    key={apt.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-primary"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <FaUserMd className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{apt.doctor}</p>
                          <p className="text-sm text-gray-600">{apt.department}</p>
                        </div>
                        <Badge variant={getStatusBadge(apt.status)}>{apt.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          {apt.time}
                        </span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {apt.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>

        {/* Recent Appointments */}
        <Card 
          title="Recent Appointments" 
          subtitle="Your appointment history"
        >
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : appointments.filter(a => a.status === 'completed').length === 0 ? (
            <div className="text-center py-8 text-gray-500">No recent appointments</div>
          ) : (
            <div className="space-y-3">
              {appointments
                .filter(apt => apt.status === 'completed')
                .map((apt) => (
                  <div 
                    key={apt.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">{apt.doctor}</p>
                        <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                      </div>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
