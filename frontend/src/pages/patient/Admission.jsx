/**
 * Patient Admission Page
 * Track admission status and history
 */

import { useEffect, useState } from 'react';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import StatCard from '../../components/shared/StatCard';
import { admissionApi } from '../../api/patient/admissionApi';
import usePatientStore from '../../store/usePatientStore';
import toast from 'react-hot-toast';
import { FaBed, FaHospital, FaCalendarAlt } from 'react-icons/fa';

const Admission = () => {
  const { admissionStatus, admissionHistory, setAdmissionStatus, setAdmissionHistory } = usePatientStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmissionData();
  }, []);

  const loadAdmissionData = async () => {
    try {
      setLoading(true);
      const [statusRes, historyRes] = await Promise.all([
        admissionApi.getStatus(),
        admissionApi.getHistory({ page: 1, limit: 100 })
      ]);

      setAdmissionStatus(statusRes.data.data);
      setAdmissionHistory(historyRes.data.data || []);
    } catch (error) {
      toast.error('Error loading admission data');
    } finally {
      setLoading(false);
    }
  };

  const historyColumns = [
    {
      key: 'admissionDate',
      label: 'Admission Date',
      accessor: (row) => new Date(row.admissionDate).toLocaleDateString()
    },
    { key: 'admissionType', label: 'Type' },
    {
      key: 'currentStatus',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    { key: 'roomNumber', label: 'Room' },
    { key: 'wardNumber', label: 'Ward' },
    {
      key: 'dischargeDate',
      label: 'Discharge Date',
      accessor: (row) => row.dischargeDate ? new Date(row.dischargeDate).toLocaleDateString() : 'N/A'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admission Status</h1>

      {/* Current Admission Status */}
      {admissionStatus ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Admission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Room Number"
              value={admissionStatus.roomNumber || 'N/A'}
              icon={FaHospital}
              color="blue"
            />
            <StatCard
              title="Bed Number"
              value={admissionStatus.bedAllocation?.bedNumber || 'N/A'}
              icon={FaBed}
              color="green"
            />
            <StatCard
              title="Admission Date"
              value={new Date(admissionStatus.admissionDate).toLocaleDateString()}
              icon={FaCalendarAlt}
              color="purple"
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Admission Type</p>
                <p className="font-medium">{admissionStatus.admissionType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge status={admissionStatus.currentStatus}>
                  {admissionStatus.currentStatus}
                </StatusBadge>
              </div>
            </div>

            {admissionStatus.reason && (
              <div>
                <p className="text-sm text-gray-600">Reason</p>
                <p className="font-medium">{admissionStatus.reason}</p>
              </div>
            )}

            {admissionStatus.bedAllocation && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Bed Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Room Type</p>
                    <p className="font-medium">{admissionStatus.bedAllocation.roomType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Floor</p>
                    <p className="font-medium">{admissionStatus.bedAllocation.floor || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {admissionStatus.expectedDischargeDate && (
              <div>
                <p className="text-sm text-gray-600">Expected Discharge Date</p>
                <p className="font-medium">
                  {new Date(admissionStatus.expectedDischargeDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No active admission</p>
        </div>
      )}

      {/* Admission History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Admission History</h2>
        <DataTable data={admissionHistory} columns={historyColumns} loading={loading} />
      </div>
    </div>
  );
};

export default Admission;

