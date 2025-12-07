/**
 * Patient Prescriptions Page
 * View prescriptions and medication details
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import StatusBadge from '../../components/shared/StatusBadge';
import { prescriptionApi } from '../../api/patient/prescriptionApi';
import usePatientStore from '../../store/usePatientStore';
import toast from 'react-hot-toast';
import { FaDownload } from 'react-icons/fa';

const Prescriptions = () => {
  const navigate = useNavigate();
  const { prescriptions, setPrescriptions, selectedPrescription, setSelectedPrescription } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await prescriptionApi.getAll({ page: 1, limit: 100 });
      setPrescriptions(res.data.data || []);
    } catch (error) {
      toast.error('Error loading prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await prescriptionApi.getById(id);
      setSelectedPrescription(res.data.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Error loading prescription');
    }
  };

  const columns = [
    {
      key: 'issuedDate',
      label: 'Date',
      accessor: (row) => new Date(row.issuedDate).toLocaleDateString()
    },
    {
      key: 'doctor',
      label: 'Doctor',
      accessor: (row) => `Dr. ${row.doctor?.firstName} ${row.doctor?.lastName}`
    },
    {
      key: 'medications',
      label: 'Medications',
      accessor: (row) => `${row.medications?.length || 0} medications`
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
        <button
          onClick={() => handleView(row.id)}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          View Details
        </button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
      </div>

      <DataTable data={prescriptions} columns={columns} loading={loading} />

      {/* Prescription Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Prescription Details"
        size="lg"
      >
        {selectedPrescription && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-medium">
                    Dr. {selectedPrescription.doctor?.firstName} {selectedPrescription.doctor?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{selectedPrescription.doctor?.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(selectedPrescription.issuedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {selectedPrescription.diagnosis && (
              <div>
                <h3 className="font-semibold mb-2">Diagnosis</h3>
                <p className="text-gray-700">{selectedPrescription.diagnosis}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Medications</h3>
              <div className="space-y-2">
                {selectedPrescription.medications?.map((med, index) => (
                  <div key={index} className="border p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                        <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                        {med.duration && (
                          <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                        )}
                      </div>
                    </div>
                    {med.instructions && (
                      <p className="text-sm text-gray-700 mt-2">{med.instructions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedPrescription.instructions && (
              <div>
                <h3 className="font-semibold mb-2">General Instructions</h3>
                <p className="text-gray-700">{selectedPrescription.instructions}</p>
              </div>
            )}

            {selectedPrescription.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-gray-700">{selectedPrescription.notes}</p>
              </div>
            )}

            {selectedPrescription.pdfUrl && (
              <div className="flex justify-end pt-4 border-t">
                <a
                  href={selectedPrescription.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaDownload />
                  <span>Download PDF</span>
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Prescriptions;

