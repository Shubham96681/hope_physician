/**
 * Nurse Dashboard
 * Main dashboard for nurses
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../../components/shared/StatCard';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import { vitalsApi, patientMonitorApi, emergencyApi } from '../../../api/staff/nurseApi';
import { FaHeartbeat, FaBed, FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import useStaffStore from '../../../store/useStaffStore';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { admittedPatients, setAdmittedPatients, emergencyAlerts, setEmergencyAlerts } = useStaffStore();
  const [stats, setStats] = useState({
    admittedPatients: 0,
    activeAlerts: 0,
    pendingVitals: 0,
    availableBeds: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [admittedRes, alertsRes] = await Promise.all([
        patientMonitorApi.getAdmitted(),
        emergencyApi.getAll({ status: 'active' })
      ]);

      setAdmittedPatients(admittedRes.data.data || []);
      setEmergencyAlerts(alertsRes.data.data || []);
      
      setStats({
        admittedPatients: admittedRes.data.data?.length || 0,
        activeAlerts: alertsRes.data.data?.length || 0,
        pendingVitals: 0, // Calculate from data
        availableBeds: 0 // Calculate from beds
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const patientColumns = [
    {
      key: 'patient',
      label: 'Patient',
      accessor: (row) => `${row.patient?.firstName} ${row.patient?.lastName}`
    },
    { key: 'roomNumber', label: 'Room' },
    { key: 'bedNumber', label: 'Bed' },
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
        <button
          onClick={() => navigate(`/staff/nurse/patients/${row.patientId}`)}
          className="text-blue-600 hover:text-blue-700"
        >
          View
        </button>
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
        <h1 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
        <button
          onClick={() => navigate('/staff/nurse/vitals')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Record Vitals
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Admitted Patients"
          value={stats.admittedPatients}
          icon={FaUsers}
          color="blue"
        />
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon={FaExclamationTriangle}
          color="red"
        />
        <StatCard
          title="Pending Vitals"
          value={stats.pendingVitals}
          icon={FaHeartbeat}
          color="yellow"
        />
        <StatCard
          title="Available Beds"
          value={stats.availableBeds}
          icon={FaBed}
          color="green"
        />
      </div>

      {/* Emergency Alerts */}
      {emergencyAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Active Emergency Alerts</h2>
          <div className="space-y-2">
            {emergencyAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{alert.description}</p>
                  <p className="text-sm text-gray-600">{alert.location}</p>
                </div>
                <StatusBadge status={alert.severity}>{alert.severity}</StatusBadge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admitted Patients */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Admitted Patients</h2>
          <button
            onClick={() => navigate('/staff/nurse/patients')}
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        <DataTable
          data={admittedPatients}
          columns={patientColumns}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default NurseDashboard;

