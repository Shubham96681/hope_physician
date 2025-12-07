/**
 * Reception Dashboard
 * Main dashboard for reception staff
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../../components/shared/StatCard';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import { patientApi, appointmentApi, billingApi } from '../../../api/staff/receptionApi';
import { FaUsers, FaCalendarAlt, FaDollarSign, FaFileInvoice } from 'react-icons/fa';
import useStaffStore from '../../../store/useStaffStore';

const ReceptionDashboard = () => {
  const navigate = useNavigate();
  const { billingStats, setBillingStats, setAppointments, setPatients } = useStaffStore();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingBills: 0,
    totalRevenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const [patientsRes, appointmentsRes, billingRes, statsRes] = await Promise.all([
        patientApi.getAll({ page: 1, limit: 1 }),
        appointmentApi.getAll({ page: 1, limit: 10, status: 'scheduled' }),
        billingApi.getAll({ page: 1, limit: 10, paymentStatus: 'unpaid' }),
        billingApi.getStats()
      ]);

      setStats({
        totalPatients: patientsRes.data.pagination?.total || 0,
        todayAppointments: appointmentsRes.data.data?.length || 0,
        pendingBills: billingRes.data.pagination?.total || 0,
        totalRevenue: statsRes.data.data?.totalRevenue || 0
      });

      setRecentAppointments(appointmentsRes.data.data || []);
      setAppointments(appointmentsRes.data.data || []);
      setPatients(patientsRes.data.data || []);
      setBillingStats(statsRes.data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const appointmentColumns = [
    { key: 'date', label: 'Date', accessor: (row) => new Date(row.date).toLocaleDateString() },
    { key: 'time', label: 'Time' },
    {
      key: 'patient',
      label: 'Patient',
      accessor: (row) => `${row.patient?.firstName} ${row.patient?.lastName}`
    },
    {
      key: 'doctor',
      label: 'Doctor',
      accessor: (row) => `Dr. ${row.doctor?.firstName} ${row.doctor?.lastName}`
    },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reception Dashboard</h1>
        <button
          onClick={() => navigate('/staff/reception/patients/register')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Register Patient
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={FaUsers}
          color="blue"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={FaCalendarAlt}
          color="green"
        />
        <StatCard
          title="Pending Bills"
          value={stats.pendingBills}
          icon={FaFileInvoice}
          color="yellow"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={FaDollarSign}
          color="purple"
        />
      </div>

      {/* Recent Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Appointments</h2>
          <button
            onClick={() => navigate('/staff/reception/appointments')}
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        <DataTable
          data={recentAppointments}
          columns={appointmentColumns}
          onRowClick={(row) => navigate(`/staff/reception/appointments/${row.id}`)}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default ReceptionDashboard;

