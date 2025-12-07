/**
 * Patient Insurance Page
 * Upload and manage insurance documents
 */

import { useEffect, useState } from 'react';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import FormSelect from '../../components/shared/FormSelect';
import { insuranceApi } from '../../api/patient/insuranceApi';
import usePatientStore from '../../store/usePatientStore';
import toast from 'react-hot-toast';
import { FaUpload, FaTrash, FaFilePdf } from 'react-icons/fa';

const Insurance = () => {
  const { insuranceFiles, setInsuranceFiles } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    fileName: '',
    fileType: 'insurance_card',
    description: '',
    file: null
  });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const res = await insuranceApi.getAll();
      setInsuranceFiles(res.data.data || []);
    } catch (error) {
      toast.error('Error loading insurance files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file,
        fileName: file.name
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('fileName', formData.fileName);
      uploadFormData.append('fileType', formData.fileType);
      uploadFormData.append('description', formData.description);

      await insuranceApi.upload(uploadFormData);
      toast.success('File uploaded successfully!');
      setIsUploadModalOpen(false);
      setFormData({
        fileName: '',
        fileType: 'insurance_card',
        description: '',
        file: null
      });
      loadFiles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await insuranceApi.delete(id);
        toast.success('File deleted successfully');
        loadFiles();
      } catch (error) {
        toast.error('Error deleting file');
      }
    }
  };

  const columns = [
    { key: 'fileName', label: 'File Name' },
    {
      key: 'fileType',
      label: 'Type',
      accessor: (row) => row.fileType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    },
    {
      key: 'uploadedAt',
      label: 'Uploaded',
      accessor: (row) => new Date(row.uploadedAt).toLocaleDateString()
    },
    { key: 'description', label: 'Description' },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <a
            href={row.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            View
          </a>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const fileTypeOptions = [
    { value: 'insurance_card', label: 'Insurance Card' },
    { value: 'policy_document', label: 'Policy Document' },
    { value: 'claim_form', label: 'Claim Form' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insurance Documents</h1>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaUpload />
          <span>Upload Document</span>
        </button>
      </div>

      <DataTable data={insuranceFiles} columns={columns} loading={loading} />

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Insurance Document"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <FormSelect
            label="Document Type"
            name="fileType"
            value={formData.fileType}
            onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
            options={fileTypeOptions}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: PDF, JPG, PNG (Max 5MB)
            </p>
          </div>

          <FormInput
            label="Description (Optional)"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Insurance;

