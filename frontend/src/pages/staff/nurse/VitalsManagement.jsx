/**
 * Vitals Management
 * Record and view patient vitals
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/shared/DataTable';
import Modal from '../../../components/shared/Modal';
import FormInput from '../../../components/shared/FormInput';
import FormSelect from '../../../components/shared/FormSelect';
import { vitalsApi, patientMonitorApi } from '../../../api/staff/nurseApi';
import { patientApi } from '../../../api/staff/receptionApi';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const VitalsManagement = () => {
  const navigate = useNavigate();
  const { vitals, setVitals, patients, setPatients } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    bloodPressure: '',
    systolicBP: '',
    diastolicBP: '',
    pulse: '',
    temperature: '',
    temperatureUnit: 'celsius',
    respiratoryRate: '',
    oxygenSaturation: '',
    bloodSugar: '',
    weight: '',
    height: '',
    painLevel: '',
    consciousness: 'alert',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [patientsRes] = await Promise.all([
        patientApi.getAll({ page: 1, limit: 100 })
      ]);
      setPatients(patientsRes.data.data || []);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecord = () => {
    setFormData({
      patientId: '',
      appointmentId: '',
      bloodPressure: '',
      systolicBP: '',
      diastolicBP: '',
      pulse: '',
      temperature: '',
      temperatureUnit: 'celsius',
      respiratoryRate: '',
      oxygenSaturation: '',
      bloodSugar: '',
      weight: '',
      height: '',
      painLevel: '',
      consciousness: 'alert',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await vitalsApi.record(formData);
      toast.success('Vitals recorded successfully!');
      setIsModalOpen(false);
      if (formData.patientId) {
        const vitalsRes = await vitalsApi.getByPatient(formData.patientId);
        setVitals(vitalsRes.data.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error recording vitals');
    }
  };

  const handleViewHistory = async (patientId) => {
    try {
      const vitalsRes = await vitalsApi.getByPatient(patientId);
      setVitals(vitalsRes.data.data || []);
      navigate(`/staff/nurse/vitals/patient/${patientId}`);
    } catch (error) {
      toast.error('Error loading vitals history');
    }
  };

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      accessor: (row) => `${row.patient?.firstName} ${row.patient?.lastName}`
    },
    {
      key: 'bloodPressure',
      label: 'BP',
      accessor: (row) => row.bloodPressure || `${row.systolicBP}/${row.diastolicBP}`
    },
    { key: 'pulse', label: 'Pulse (bpm)' },
    { key: 'temperature', label: 'Temp (°C)' },
    { key: 'oxygenSaturation', label: 'SpO2 (%)' },
    {
      key: 'createdAt',
      label: 'Recorded',
      accessor: (row) => new Date(row.createdAt).toLocaleString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <button
          onClick={() => handleViewHistory(row.patientId)}
          className="text-blue-600 hover:text-blue-700"
        >
          History
        </button>
      )
    }
  ];

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }));

  const consciousnessOptions = [
    { value: 'alert', label: 'Alert' },
    { value: 'drowsy', label: 'Drowsy' },
    { value: 'unconscious', label: 'Unconscious' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vitals Management</h1>
        <button
          onClick={handleRecord}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Record Vitals
        </button>
      </div>

      <DataTable data={vitals} columns={columns} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Patient Vitals"
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
              label="Blood Pressure (e.g., 120/80)"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
              placeholder="120/80"
            />
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                label="Systolic"
                name="systolicBP"
                type="number"
                value={formData.systolicBP}
                onChange={(e) => setFormData({ ...formData, systolicBP: e.target.value })}
              />
              <FormInput
                label="Diastolic"
                name="diastolicBP"
                type="number"
                value={formData.diastolicBP}
                onChange={(e) => setFormData({ ...formData, diastolicBP: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Pulse (bpm)"
              name="pulse"
              type="number"
              value={formData.pulse}
              onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
            />
            <FormInput
              label="Temperature"
              name="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
            />
            <FormSelect
              label="Unit"
              name="temperatureUnit"
              value={formData.temperatureUnit}
              onChange={(e) => setFormData({ ...formData, temperatureUnit: e.target.value })}
              options={[
                { value: 'celsius', label: '°C' },
                { value: 'fahrenheit', label: '°F' }
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Respiratory Rate"
              name="respiratoryRate"
              type="number"
              value={formData.respiratoryRate}
              onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
            />
            <FormInput
              label="SpO2 (%)"
              name="oxygenSaturation"
              type="number"
              step="0.1"
              value={formData.oxygenSaturation}
              onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
            />
            <FormInput
              label="Blood Sugar (mg/dL)"
              name="bloodSugar"
              type="number"
              step="0.1"
              value={formData.bloodSugar}
              onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Weight (kg)"
              name="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
            <FormInput
              label="Height (cm)"
              name="height"
              type="number"
              step="0.1"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
            <FormInput
              label="Pain Level (0-10)"
              name="painLevel"
              type="number"
              min="0"
              max="10"
              value={formData.painLevel}
              onChange={(e) => setFormData({ ...formData, painLevel: e.target.value })}
            />
          </div>

          <FormSelect
            label="Consciousness"
            name="consciousness"
            value={formData.consciousness}
            onChange={(e) => setFormData({ ...formData, consciousness: e.target.value })}
            options={consciousnessOptions}
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
              Record Vitals
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VitalsManagement;

