/**
 * Lab Test Management
 * Create, assign, and manage lab tests
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Modal from '../../../components/shared/Modal';
import FormInput from '../../../components/shared/FormInput';
import FormSelect from '../../../components/shared/FormSelect';
import { labTestApi } from '../../../api/staff/labApi';
import { patientApi } from '../../../api/staff/receptionApi';
import { doctorService } from '../../../services/doctorService';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const LabTestManagement = () => {
  const { labTests, setLabTests, patients, setPatients } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    testName: '',
    testType: '',
    testCategory: '',
    testCode: '',
    doctorNotes: ''
  });
  const [reportData, setReportData] = useState({
    results: '',
    normalRange: '',
    abnormalFlag: false,
    criticalFlag: false,
    labNotes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [testsRes, patientsRes, doctorsRes] = await Promise.all([
        labTestApi.getAll({ page: 1, limit: 100 }),
        patientApi.getAll({ page: 1, limit: 100 }),
        doctorService.getAll()
      ]);

      setLabTests(testsRes.data.data || []);
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
      testName: '',
      testType: '',
      testCategory: '',
      testCode: '',
      doctorNotes: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await labTestApi.create(formData);
      toast.success('Lab test request created!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating lab test');
    }
  };

  const handleUploadReport = (test) => {
    setSelectedTest(test);
    setReportData({
      results: '',
      normalRange: '',
      abnormalFlag: false,
      criticalFlag: false,
      labNotes: ''
    });
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('results', JSON.stringify({ results: reportData.results }));
      formData.append('normalRange', reportData.normalRange);
      formData.append('abnormalFlag', reportData.abnormalFlag);
      formData.append('criticalFlag', reportData.criticalFlag);
      formData.append('labNotes', reportData.labNotes);

      await labTestApi.uploadReport(selectedTest.id, formData);
      toast.success('Lab report uploaded!');
      setIsReportModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Error uploading report');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await labTestApi.updateStatus(id, { status });
      toast.success('Status updated');
      loadData();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      accessor: (row) => `${row.patient?.firstName} ${row.patient?.lastName}`
    },
    { key: 'testName', label: 'Test Name' },
    { key: 'testType', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    {
      key: 'requestedDate',
      label: 'Requested',
      accessor: (row) => new Date(row.requestedDate).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          {row.status === 'pending' && (
            <button
              onClick={() => handleStatusUpdate(row.id, 'assigned')}
              className="text-blue-600 hover:text-blue-700"
            >
              Assign
            </button>
          )}
          {row.status === 'assigned' && (
            <button
              onClick={() => handleStatusUpdate(row.id, 'in_progress')}
              className="text-yellow-600 hover:text-yellow-700"
            >
              Start
            </button>
          )}
          {row.status === 'in_progress' && (
            <button
              onClick={() => handleUploadReport(row)}
              className="text-green-600 hover:text-green-700"
            >
              Upload Report
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
    label: `Dr. ${d.firstName} ${d.lastName}`
  }));

  const testTypeOptions = [
    { value: 'blood', label: 'Blood Test' },
    { value: 'urine', label: 'Urine Test' },
    { value: 'xray', label: 'X-Ray' },
    { value: 'mri', label: 'MRI' },
    { value: 'ct_scan', label: 'CT Scan' },
    { value: 'ultrasound', label: 'Ultrasound' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lab Test Management</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Test Request
        </button>
      </div>

      <DataTable data={labTests} columns={columns} loading={loading} />

      {/* Create Test Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Lab Test Request"
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
            label="Requesting Doctor"
            name="doctorId"
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            options={doctorOptions}
          />

          <FormInput
            label="Test Name"
            name="testName"
            value={formData.testName}
            onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
            required
          />

          <FormSelect
            label="Test Type"
            name="testType"
            value={formData.testType}
            onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
            options={testTypeOptions}
            required
          />

          <FormInput
            label="Test Category"
            name="testCategory"
            value={formData.testCategory}
            onChange={(e) => setFormData({ ...formData, testCategory: e.target.value })}
          />

          <FormInput
            label="Test Code"
            name="testCode"
            value={formData.testCode}
            onChange={(e) => setFormData({ ...formData, testCode: e.target.value })}
          />

          <FormInput
            label="Doctor Notes"
            name="doctorNotes"
            value={formData.doctorNotes}
            onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
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
              Create Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Upload Lab Report"
        size="lg"
      >
        {selectedTest && (
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-medium">Test: {selectedTest.testName}</p>
              <p className="text-sm text-gray-600">Patient: {selectedTest.patient?.firstName} {selectedTest.patient?.lastName}</p>
            </div>

            <FormInput
              label="Results"
              name="results"
              value={reportData.results}
              onChange={(e) => setReportData({ ...reportData, results: e.target.value })}
              placeholder="Enter test results"
              required
            />

            <FormInput
              label="Normal Range"
              name="normalRange"
              value={reportData.normalRange}
              onChange={(e) => setReportData({ ...reportData, normalRange: e.target.value })}
            />

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportData.abnormalFlag}
                  onChange={(e) => setReportData({ ...reportData, abnormalFlag: e.target.checked })}
                  className="mr-2"
                />
                Abnormal Flag
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportData.criticalFlag}
                  onChange={(e) => setReportData({ ...reportData, criticalFlag: e.target.checked })}
                  className="mr-2"
                />
                Critical Flag
              </label>
            </div>

            <FormInput
              label="Lab Notes"
              name="labNotes"
              value={reportData.labNotes}
              onChange={(e) => setReportData({ ...reportData, labNotes: e.target.value })}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Upload Report
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default LabTestManagement;

