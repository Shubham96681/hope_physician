/**
 * Patient Dashboard
 * Main dashboard with quick actions and overview
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/shared/StatCard';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import { appointmentApi } from '../../api/patient/appointmentApi';
import { billingApi } from '../../api/patient/billingApi';
import { prescriptionApi } from '../../api/patient/prescriptionApi';
import { reportApi } from '../../api/patient/reportApi';
import { FaCalendarAlt, FaFileMedical, FaDollarSign, FaPills, FaExclamationTriangle } from 'react-icons/fa';
import usePatientStore from '../../store/usePatientStore';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const {
    appointments,
    upcomingAppointments,
    bills,
    pendingBills,
    prescriptions,
    reports,
    setAppointments,
    setBills,
    setPrescriptions,
    setReports
  } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    pendingBills: 0,
    totalBills: 0,
    recentPrescriptions: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, billsRes, prescriptionsRes, reportsRes] = await Promise.all([
        appointmentApi.getAll({ page: 1, limit: 10 }),
        billingApi.getAll({ page: 1, limit: 10 }),
        prescriptionApi.getAll({ page: 1, limit: 5 }),
        reportApi.getAll({ page: 1, limit: 5 })
      ]);

      setAppointments(appointmentsRes.data.data || []);
      setBills(billsRes.data.data || []);
      setPrescriptions(prescriptionsRes.data.data || []);
      setReports(reportsRes.data.data || []);

      // Calculate stats from loaded data
      const upcoming = (appointmentsRes.data.data || []).filter(apt => 
        new Date(apt.date) >= new Date() && 
        ['scheduled', 'confirmed'].includes(apt.status)
      );
      const pending = (billsRes.data.data || []).filter(bill => bill.paymentStatus !== 'paid');

      setStats({
        upcomingAppointments: upcoming.length,
        pendingBills: pending.length,
        totalBills: billsRes.data.data?.length || 0,
        recentPrescriptions: prescriptionsRes.data.data?.length || 0
      });
    } catch (error) {
      toast.error('Error loading dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const appointmentColumns = [
    {
      key: 'date',
      label: 'Date',
      accessor: (row) => new Date(row.date).toLocaleDateString()
    },
    { key: 'time', label: 'Time' },
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
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/patient/appointments/${row.id}`)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            View
          </button>
          {row.status === 'scheduled' && (
            <button
              onClick={() => navigate(`/patient/appointments/${row.id}/reschedule`)}
              className="text-yellow-600 hover:text-yellow-700 text-sm"
            >
              Reschedule
            </button>
          )}
        </div>
      )
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
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <button
          onClick={() => navigate('/patient/appointments/book')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/patient/appointments/book')}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <FaCalendarAlt className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Book Appointment</h3>
          <p className="text-sm text-gray-600">Schedule with a doctor</p>
        </button>

        <button
          onClick={() => navigate('/patient/reports')}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <FaFileMedical className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="font-semibold text-gray-900">View Reports</h3>
          <p className="text-sm text-gray-600">Medical reports & lab results</p>
        </button>

        <button
          onClick={() => navigate('/patient/billing')}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <FaDollarSign className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Pay Bills</h3>
          <p className="text-sm text-gray-600">View & pay invoices</p>
        </button>

        <button
          onClick={() => navigate('/patient/chat')}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left relative"
        >
          <FaExclamationTriangle className="w-8 h-8 text-red-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Chat Support</h3>
          <p className="text-sm text-gray-600">Get help from support</p>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={FaCalendarAlt}
          color="blue"
        />
        <StatCard
          title="Pending Bills"
          value={stats.pendingBills}
          icon={FaDollarSign}
          color="yellow"
        />
        <StatCard
          title="Recent Prescriptions"
          value={stats.recentPrescriptions}
          icon={FaPills}
          color="green"
        />
        <StatCard
          title="Total Bills"
          value={stats.totalBills}
          icon={FaFileMedical}
          color="purple"
        />
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
          <button
            onClick={() => navigate('/patient/appointments')}
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        {appointments.length > 0 ? (
          <DataTable
            data={appointments.filter(apt => 
              new Date(apt.date) >= new Date() && 
              ['scheduled', 'confirmed'].includes(apt.status)
            ).slice(0, 5)}
            columns={appointmentColumns}
            pagination={false}
          />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            No upcoming appointments. <button onClick={() => navigate('/patient/appointments/book')} className="text-blue-600 hover:text-blue-700 underline">Book one now</button>
          </div>
        )}
      </div>

      {/* Recent Prescriptions */}
      {prescriptions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Prescriptions</h2>
            <button
              onClick={() => navigate('/patient/prescriptions')}
              className="text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.slice(0, 2).map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/patient/prescriptions/${prescription.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(prescription.issuedDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {prescription.medications?.length || 0} medications
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
