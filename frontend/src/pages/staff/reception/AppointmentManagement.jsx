/**
 * Appointment Management
 * View, create, edit, and cancel appointments
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Modal from '../../../components/shared/Modal';
import FormInput from '../../../components/shared/FormInput';
import FormSelect from '../../../components/shared/FormSelect';
import { appointmentApi, patientApi } from '../../../api/staff/receptionApi';
import { doctorService } from '../../../services/doctorService';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const AppointmentManagement = () => {
  const navigate = useNavigate();
  const { appointments, setAppointments, patients, setPatients } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: '',
    notes: '',
    department: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        appointmentApi.getAll({ page: 1, limit: 100 }),
        patientApi.getAll({ page: 1, limit: 100 }),
        doctorService.getAll()
      ]);

      setAppointments(appointmentsRes.data.data || []);
      setPatients(patientsRes.data.data || []);
      setDoctors(doctorsRes.data || []);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      type: '',
      notes: '',
      department: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentApi.create(formData);
      toast.success('Appointment created successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating appointment');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentApi.cancel(id, 'Cancelled by reception');
        toast.success('Appointment cancelled');
        loadData();
      } catch (error) {
        toast.error('Error cancelling appointment');
      }
    }
  };

  const columns = [
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
    { key: 'type', label: 'Type' },
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
            onClick={() => navigate(`/staff/reception/appointments/${row.id}`)}
            className="text-blue-600 hover:text-blue-700"
          >
            View
          </button>
          {row.status === 'scheduled' && (
            <button
              onClick={() => handleCancel(row.id)}
              className="text-red-600 hover:text-red-700"
            >
              Cancel
            </button>
          )}
        </div>
      )
    }
  ];

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }));

  const doctorOptions = doctors.map((d) => ({
    value: d.id,
    label: `Dr. ${d.firstName} ${d.lastName} - ${d.specialization}`
  }));

  const typeOptions = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'checkup', label: 'Checkup' },
    { value: 'emergency', label: 'Emergency' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Appointment
        </button>
      </div>

      <DataTable
        data={appointments}
        columns={columns}
        onRowClick={(row) => navigate(`/staff/reception/appointments/${row.id}`)}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Appointment"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect
            label="Patient"
            name="patientId"
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            options={patientOptions}
            required
          />
          <FormSelect
            label="Doctor"
            name="doctorId"
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            options={doctorOptions}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <FormInput
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
          <FormSelect
            label="Type"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={typeOptions}
          />
          <FormInput
            label="Department"
            name="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <FormInput
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentManagement;

