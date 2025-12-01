import React, { useState } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Card from '../../components/shared/Card';
import DataTable from '../../components/shared/DataTable';
import Button from '../../components/shared/Button';
import Badge from '../../components/shared/Badge';
import Modal from '../../components/shared/Modal';
import * as adminService from '../../services/adminService';

const KYCReview = () => {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [remark, setRemark] = useState('');

  React.useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      // Mock KYC data
      setKycList([
        { id: 1, patient_name: 'John Doe', submitted_date: '2024-01-13', status: 'pending', documents: 3 },
        { id: 2, patient_name: 'Jane Smith', submitted_date: '2024-01-14', status: 'pending', documents: 2 }
      ]);
    } catch (error) {
      console.error('Failed to fetch KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action) => {
    if (!selectedKYC) return;
    try {
      await adminService.reviewKYC(selectedKYC.id, action, remark);
      fetchKYC();
      setReviewModal(false);
      setSelectedKYC(null);
      setRemark('');
    } catch (error) {
      console.error('Failed to review KYC:', error);
    }
  };

  const columns = [
    { header: 'Patient Name', accessor: 'patient_name' },
    { header: 'Submitted Date', accessor: 'submitted_date' },
    { header: 'Documents', accessor: 'documents' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value) => (
        <Badge variant={value === 'approved' ? 'success' : value === 'rejected' ? 'danger' : 'warning'}>
          {value}
        </Badge>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KYC Review</h1>
            <p className="text-gray-600 mt-1">Review and approve patient KYC documents</p>
          </div>

          <Card>
            <DataTable
              columns={columns}
              data={kycList}
              loading={loading}
              onRowClick={(row) => {
                setSelectedKYC(row);
                setReviewModal(true);
              }}
              actions={(row) => (
                <Button size="sm" variant="primary" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedKYC(row);
                  setReviewModal(true);
                }}>
                  Review
                </Button>
              )}
            />
          </Card>

          <Modal
            isOpen={reviewModal}
            onClose={() => {
              setReviewModal(false);
              setSelectedKYC(null);
              setRemark('');
            }}
            title={`Review KYC - ${selectedKYC?.patient_name}`}
            footer={
              <>
                <Button variant="danger" onClick={() => handleReview('reject')}>
                  Reject
                </Button>
                <Button variant="primary" onClick={() => handleReview('approve')}>
                  Approve
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Review the submitted documents and add remarks if needed.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add your remarks here..."
                />
              </div>
            </div>
          </Modal>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default KYCReview;

