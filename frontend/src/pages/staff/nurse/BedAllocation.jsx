/**
 * Bed Allocation Management
 * Allocate and manage hospital beds
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Modal from '../../../components/shared/Modal';
import FormInput from '../../../components/shared/FormInput';
import FormSelect from '../../../components/shared/FormSelect';
import { bedApi } from '../../../api/staff/nurseApi';
import { patientApi } from '../../../api/staff/receptionApi';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const BedAllocation = () => {
  const { beds, setBeds, patients, setPatients } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    bedNumber: '',
    roomNumber: '',
    roomType: 'general',
    floor: '',
    expectedDischargeDate: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bedsRes, patientsRes] = await Promise.all([
        bedApi.getAll(),
        patientApi.getAll({ page: 1, limit: 100 })
      ]);

      setBeds(bedsRes.data.data || []);
      setPatients(patientsRes.data.data || []);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = () => {
    setFormData({
      patientId: '',
      bedNumber: '',
      roomNumber: '',
      roomType: 'general',
      floor: '',
      expectedDischargeDate: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bedApi.allocate(formData);
      toast.success('Bed allocated successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error allocating bed');
    }
  };

  const handleRelease = async (id) => {
    if (window.confirm('Are you sure you want to release this bed?')) {
      try {
        await bedApi.release(id, { dischargeNotes: 'Discharged' });
        toast.success('Bed released successfully');
        loadData();
      } catch (error) {
        toast.error('Error releasing bed');
      }
    }
  };

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      accessor: (row) => `${row.patient?.firstName} ${row.patient?.lastName}`
    },
    { key: 'roomNumber', label: 'Room' },
    { key: 'bedNumber', label: 'Bed' },
    { key: 'roomType', label: 'Type' },
    { key: 'floor', label: 'Floor' },
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
        row.status === 'occupied' && (
          <button
            onClick={() => handleRelease(row.id)}
            className="text-red-600 hover:text-red-700"
          >
            Release
          </button>
        )
      )
    }
  ];

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }));

  const roomTypeOptions = [
    { value: 'general', label: 'General' },
    { value: 'private', label: 'Private' },
    { value: 'icu', label: 'ICU' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'isolation', label: 'Isolation' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bed Allocation</h1>
        <button
          onClick={handleAllocate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Allocate Bed
        </button>
      </div>

      <DataTable data={beds} columns={columns} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Allocate Bed"
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

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Room Number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              required
            />
            <FormInput
              label="Bed Number"
              name="bedNumber"
              value={formData.bedNumber}
              onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Room Type"
              name="roomType"
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              options={roomTypeOptions}
              required
            />
            <FormInput
              label="Floor"
              name="floor"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            />
          </div>

          <FormInput
            label="Expected Discharge Date"
            name="expectedDischargeDate"
            type="date"
            value={formData.expectedDischargeDate}
            onChange={(e) => setFormData({ ...formData, expectedDischargeDate: e.target.value })}
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
              Allocate Bed
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BedAllocation;

