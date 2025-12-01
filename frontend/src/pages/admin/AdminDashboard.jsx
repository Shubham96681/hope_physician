import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import { 
  FaUsers, 
  FaUserMd, 
  FaCalendarAlt, 
  FaFileMedical, 
  FaClock,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import * as adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 1247,
    totalDoctors: 24,
    totalStaff: 48,
    appointmentsToday: 32,
    pendingKYC: 8,
    activeAppointments: 18,
    completedToday: 14
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [pendingKYC, setPendingKYC] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
      
      // Mock recent appointments
      setRecentAppointments([
        { id: 1, patient: 'John Doe', doctor: 'Dr. Okonkwo', time: '10:00 AM', status: 'scheduled', date: '2024-01-20' },
        { id: 2, patient: 'Jane Smith', doctor: 'Dr. Williams', time: '11:30 AM', status: 'in-progress', date: '2024-01-20' },
        { id: 3, patient: 'Mike Johnson', doctor: 'Dr. Okonkwo', time: '02:00 PM', status: 'completed', date: '2024-01-20' },
        { id: 4, patient: 'Sarah Brown', doctor: 'Dr. Williams', time: '03:30 PM', status: 'scheduled', date: '2024-01-20' }
      ]);

      // Mock pending KYC
      setPendingKYC([
        { id: 1, patient: 'Robert Taylor', submitted: '2 days ago', documents: 3 },
        { id: 2, patient: 'Emily Davis', submitted: '1 day ago', documents: 2 },
        { id: 3, patient: 'David Wilson', submitted: '3 days ago', documents: 4 }
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: FaUsers,
      color: 'blue',
      change: '+12%',
      trend: 'up',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: FaUserMd,
      color: 'emerald',
      change: '+5%',
      trend: 'up',
      bgGradient: 'from-emerald-50 to-emerald-100'
    },
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      icon: FaUsers,
      color: 'violet',
      change: '+3%',
      trend: 'up',
      bgGradient: 'from-violet-50 to-violet-100'
    },
    {
      title: 'Appointments Today',
      value: stats.appointmentsToday,
      icon: FaCalendarAlt,
      color: 'amber',
      change: '+8%',
      trend: 'up',
      bgGradient: 'from-amber-50 to-amber-100'
    },
    {
      title: 'Pending KYC',
      value: stats.pendingKYC,
      icon: FaFileMedical,
      color: 'red',
      change: 'Review needed',
      trend: 'neutral',
      bgGradient: 'from-red-50 to-red-100'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'in-progress': 'info',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return variants[status] || 'default';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/employees">
              <Button variant="outline">Manage Employees</Button>
            </Link>
            <Link to="/admin/kyc-review">
              <Button>Review KYC</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className={`p-6 bg-gradient-to-br ${stat.bgGradient} border-2 border-${stat.color}-200 hover:shadow-lg transition-all duration-300`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  {stat.trend === 'up' && (
                    <div className="flex items-center text-green-600 text-sm">
                      <FaArrowUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
                  )}
                  {stat.trend === 'neutral' && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <FaExclamationTriangle className="w-3 h-3 mr-1" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stat.value}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAppointments}</p>
                <p className="text-xs text-green-600 mt-1">Currently in progress</p>
              </div>
              <FaCheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
                <p className="text-xs text-blue-600 mt-1">Successfully finished</p>
              </div>
              <FaChartLine className="w-10 h-10 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingKYC}</p>
                <p className="text-xs text-amber-600 mt-1">Requires attention</p>
              </div>
              <FaExclamationTriangle className="w-10 h-10 text-amber-500" />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <Card 
            title="Recent Appointments" 
            actions={
              <Link to="/admin/appointments">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            }
            className="h-full"
          >
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : recentAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No recent appointments</div>
              ) : (
                recentAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-gray-900">{apt.patient}</p>
                        <Badge variant={getStatusBadge(apt.status)}>{apt.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{apt.doctor}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          {apt.time}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Pending KYC Reviews */}
          <Card 
            title="Pending KYC Reviews" 
            actions={
              <Link to="/admin/kyc-review">
                <Button variant="ghost" size="sm">Review All</Button>
              </Link>
            }
            className="h-full"
          >
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : pendingKYC.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending KYC reviews</div>
              ) : (
                pendingKYC.map((kyc) => (
                  <div key={kyc.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-gray-900">{kyc.patient}</p>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Submitted {kyc.submitted}</p>
                      <p className="text-xs text-gray-500">{kyc.documents} documents uploaded</p>
                    </div>
                    <Link to={`/admin/kyc-review/${kyc.id}`}>
                      <Button size="sm">Review</Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/employees">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaUsers className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Manage Employees</p>
              </div>
            </Link>
            <Link to="/admin/kyc-review">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaFileMedical className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">KYC Review</p>
              </div>
            </Link>
            <Link to="/admin/appointments">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaCalendarAlt className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Appointments</p>
              </div>
            </Link>
            <Link to="/admin/reports">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaChartLine className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Reports</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
