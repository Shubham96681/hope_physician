/**
 * Patient Reports Page
 * View and download medical reports
 */

import { useEffect, useState } from 'react';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import { reportApi } from '../../api/patient/reportApi';
import usePatientStore from '../../store/usePatientStore';
import toast from 'react-hot-toast';
import { FaDownload, FaFilePdf } from 'react-icons/fa';

const Reports = () => {
  const { reports, labReports, setReports, setLabReports, selectedReport, setSelectedReport } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('medical'); // 'medical' or 'lab'

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [reportsRes, labRes] = await Promise.all([
        reportApi.getAll({ page: 1, limit: 100 }),
        reportApi.getLabReports({ page: 1, limit: 100 })
      ]);

      setReports(reportsRes.data.data || []);
      setLabReports(labRes.data.data || []);
    } catch (error) {
      toast.error('Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await reportApi.getById(id);
      setSelectedReport(res.data.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Error loading report');
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await reportApi.download(id);
      // Open PDF in new tab or download
      window.open(res.data.data.pdfUrl, '_blank');
    } catch (error) {
      toast.error('Error downloading report');
    }
  };

  const medicalReportColumns = [
    {
      key: 'createdAt',
      label: 'Date',
      accessor: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    { key: 'title', label: 'Title' },
    { key: 'recordType', label: 'Type' },
    {
      key: 'doctor',
      label: 'Doctor',
      accessor: (row) => `Dr. ${row.doctor?.firstName} ${row.doctor?.lastName}`
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row.id)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            View
          </button>
          {row.attachments?.length > 0 && (
            <button
              onClick={() => handleDownload(row.id)}
              className="text-green-600 hover:text-green-700 text-sm"
            >
              Download
            </button>
          )}
        </div>
      )
    }
  ];

  const labReportColumns = [
    {
      key: 'completedDate',
      label: 'Date',
      accessor: (row) => row.completedDate ? new Date(row.completedDate).toLocaleDateString() : 'N/A'
    },
    { key: 'testName', label: 'Test Name' },
    { key: 'testType', label: 'Type' },
    {
      key: 'doctor',
      label: 'Requested By',
      accessor: (row) => row.doctor ? `Dr. ${row.doctor.firstName} ${row.doctor.lastName}` : 'N/A'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedReport(row);
              setIsModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            View
          </button>
          {row.reportUrl && (
            <a
              href={row.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 text-sm"
            >
              Download
            </a>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('medical')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'medical'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Medical Reports
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'lab'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Lab Reports
        </button>
      </div>

      {/* Reports Table */}
      {activeTab === 'medical' ? (
        <DataTable data={reports} columns={medicalReportColumns} loading={loading} />
      ) : (
        <DataTable data={labReports} columns={labReportColumns} loading={loading} />
      )}

      {/* Report Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report Details"
        size="xl"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(selectedReport.createdAt || selectedReport.completedDate).toLocaleDateString()}
                  </p>
                </div>
                {selectedReport.doctor && (
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium">
                      Dr. {selectedReport.doctor.firstName} {selectedReport.doctor.lastName}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Title</h3>
              <p className="text-gray-700">{selectedReport.title || selectedReport.testName}</p>
            </div>

            {selectedReport.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{selectedReport.description}</p>
              </div>
            )}

            {selectedReport.diagnosis && (
              <div>
                <h3 className="font-semibold mb-2">Diagnosis</h3>
                <p className="text-gray-700">{selectedReport.diagnosis}</p>
              </div>
            )}

            {selectedReport.testResults && (
              <div>
                <h3 className="font-semibold mb-2">Test Results</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(selectedReport.testResults, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {selectedReport.attachments && selectedReport.attachments.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Attachments</h3>
                <div className="space-y-2">
                  {selectedReport.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <FaFilePdf className="text-red-600" />
                      <span>{attachment.name || `Attachment ${index + 1}`}</span>
                      <FaDownload className="ml-auto text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selectedReport.reportUrl && (
              <div className="flex justify-end pt-4 border-t">
                <a
                  href={selectedReport.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaDownload />
                  <span>Download Report</span>
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reports;

