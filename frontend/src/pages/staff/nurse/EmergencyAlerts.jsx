/**
 * Emergency Alerts Management
 * View and manage emergency alerts
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Modal from '../../../components/shared/Modal';
import FormInput from '../../../components/shared/FormInput';
import FormSelect from '../../../components/shared/FormSelect';
import { emergencyApi } from '../../../api/staff/nurseApi';
import { patientApi } from '../../../api/staff/receptionApi';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';
import { FaExclamationTriangle } from 'react-icons/fa';

const EmergencyAlerts = () => {
  const { emergencyAlerts, setEmergencyAlerts, patients, setPatients } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    alertType: 'medical',
    severity: 'high',
    location: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [alertsRes, patientsRes] = await Promise.all([
        emergencyApi.getAll(),
        patientApi.getAll({ page: 1, limit: 100 })
      ]);

      setEmergencyAlerts(alertsRes.data.data || []);
      setPatients(patientsRes.data.data || []);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleTrigger = () => {
    setFormData({
      patientId: '',
      alertType: 'medical',
      severity: 'high',
      location: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await emergencyApi.trigger(formData);
      toast.success('Emergency alert triggered!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error triggering alert');
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await emergencyApi.acknowledge(id);
      toast.success('Alert acknowledged');
      loadData();
    } catch (error) {
      toast.error('Error acknowledging alert');
    }
  };

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      accessor: (row) => row.patient ? `${row.patient.firstName} ${row.patient.lastName}` : 'N/A'
    },
    { key: 'alertType', label: 'Type' },
    {
      key: 'severity',
      label: 'Severity',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    { key: 'location', label: 'Location' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    {
      key: 'createdAt',
      label: 'Time',
      accessor: (row) => new Date(row.createdAt).toLocaleString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        row.status === 'active' && (
          <button
            onClick={() => handleAcknowledge(row.id)}
            className="text-blue-600 hover:text-blue-700"
          >
            Acknowledge
          </button>
        )
      )
    }
  ];

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }));

  const alertTypeOptions = [
    { value: 'medical', label: 'Medical' },
    { value: 'cardiac', label: 'Cardiac' },
    { value: 'respiratory', label: 'Respiratory' },
    { value: 'fall', label: 'Fall' },
    { value: 'other', label: 'Other' }
  ];

  const severityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const activeAlerts = emergencyAlerts.filter(a => a.status === 'active');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Alerts</h1>
        <button
          onClick={handleTrigger}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
        >
          <FaExclamationTriangle />
          <span>Trigger Alert</span>
        </button>
      </div>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Active Alerts ({activeAlerts.length})
          </h2>
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between bg-white p-3 rounded">
                <div>
                  <p className="font-medium">{alert.description}</p>
                  <p className="text-sm text-gray-600">{alert.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={alert.severity}>{alert.severity}</StatusBadge>
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DataTable data={emergencyAlerts} columns={columns} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Trigger Emergency Alert"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect
            label="Patient (Optional)"
            name="patientId"
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            options={[{ value: '', label: 'None' }, ...patientOptions]}
          />

          <FormSelect
            label="Alert Type"
            name="alertType"
            value={formData.alertType}
            onChange={(e) => setFormData({ ...formData, alertType: e.target.value })}
            options={alertTypeOptions}
            required
          />

          <FormSelect
            label="Severity"
            name="severity"
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            options={severityOptions}
            required
          />

          <FormInput
            label="Location"
            name="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Room/Bed number"
          />

          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Trigger Alert
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmergencyAlerts;

