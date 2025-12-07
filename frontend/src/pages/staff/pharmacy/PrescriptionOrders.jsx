/**
 * Prescription Orders Management
 * Process prescription orders from doctors
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import { orderApi } from '../../../api/staff/pharmacyApi';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const PrescriptionOrders = () => {
  const { prescriptionOrders, setPrescriptionOrders } = useStaffStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const ordersRes = await orderApi.getAll({ page: 1, limit: 100 });
      setPrescriptionOrders(ordersRes.data.data || []);
    } catch (error) {
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderApi.updateStatus(id, { status });
      toast.success('Order status updated');
      loadData();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      accessor: (row) => `${row.prescription?.patient?.firstName} ${row.prescription?.patient?.lastName}`
    },
    {
      key: 'medicine',
      label: 'Medicine',
      accessor: (row) => row.pharmacy?.medicineName
    },
    { key: 'quantity', label: 'Quantity' },
    {
      key: 'priority',
      label: 'Priority',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    {
      key: 'createdAt',
      label: 'Ordered',
      accessor: (row) => new Date(row.createdAt).toLocaleString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          {row.status === 'pending' && (
            <button
              onClick={() => handleStatusUpdate(row.id, 'processing')}
              className="text-blue-600 hover:text-blue-700"
            >
              Process
            </button>
          )}
          {row.status === 'processing' && (
            <button
              onClick={() => handleStatusUpdate(row.id, 'ready')}
              className="text-green-600 hover:text-green-700"
            >
              Mark Ready
            </button>
          )}
          {row.status === 'ready' && (
            <button
              onClick={() => handleStatusUpdate(row.id, 'delivered')}
              className="text-purple-600 hover:text-purple-700"
            >
              Mark Delivered
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prescription Orders</h1>
      </div>

      <DataTable data={prescriptionOrders} columns={columns} loading={loading} />
    </div>
  );
};

export default PrescriptionOrders;

