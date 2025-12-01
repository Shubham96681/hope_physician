import React from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import { FaUsers, FaUserMd, FaCalendarAlt, FaFileMedical, FaClock } from 'react-icons/fa';
import * as adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = React.useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalStaff: 0,
    appointmentsToday: 0,
    pendingKYC: 0
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: FaUsers,
      color: 'primary',
      change: '+12%'
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: FaUserMd,
      color: 'success',
      change: '+5%'
    },
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      icon: FaUsers,
      color: 'info',
      change: '+3%'
    },
    {
      title: 'Appointments Today',
      value: stats.appointmentsToday,
      icon: FaCalendarAlt,
      color: 'warning',
      change: '+8%'
    },
    {
      title: 'Pending KYC',
      value: stats.pendingKYC,
      icon: FaFileMedical,
      color: 'danger',
      change: 'Review needed'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Recent Appointments" className="h-full">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Patient Name</p>
                      <p className="text-sm text-gray-500">Today at 10:00 AM</p>
                    </div>
                    <Badge variant="primary">Scheduled</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Pending KYC Reviews" className="h-full">
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Patient Name</p>
                      <p className="text-sm text-gray-500">Submitted 2 days ago</p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

