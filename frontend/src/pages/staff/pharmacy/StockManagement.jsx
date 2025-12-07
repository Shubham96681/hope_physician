/**
 * Pharmacy Stock Management
 * Manage medicine inventory and stock
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Modal from '../../../components/shared/Modal';
import FormInput from '../../../components/shared/FormInput';
import FormSelect from '../../../components/shared/FormSelect';
import StatCard from '../../../components/shared/StatCard';
import { medicineApi, pharmacyStatsApi } from '../../../api/staff/pharmacyApi';
import { FaPills, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const StockManagement = () => {
  const { medicines, setMedicines } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    genericName: '',
    brandName: '',
    quantity: 0,
    unit: 'unit',
    reorderLevel: 10,
    maxStock: '',
    unitPrice: 0,
    sellingPrice: '',
    category: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    shelfLocation: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medicinesRes, statsRes] = await Promise.all([
        medicineApi.getAll({ page: 1, limit: 100 }),
        pharmacyStatsApi.getStats()
      ]);

      setMedicines(medicinesRes.data.data || []);
      setStats(statsRes.data.data);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      medicineName: '',
      genericName: '',
      brandName: '',
      quantity: 0,
      unit: 'unit',
      reorderLevel: 10,
      maxStock: '',
      unitPrice: 0,
      sellingPrice: '',
      category: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: '',
      shelfLocation: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await medicineApi.create(formData);
      toast.success('Medicine added successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding medicine');
    }
  };

  const columns = [
    { key: 'medicineName', label: 'Medicine Name' },
    { key: 'genericName', label: 'Generic Name' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unit', label: 'Unit' },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      accessor: (row) => `$${row.unitPrice.toFixed(2)}`
    },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      accessor: (row) => row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : 'N/A'
    },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    }
  ];

  const unitOptions = [
    { value: 'unit', label: 'Unit' },
    { value: 'box', label: 'Box' },
    { value: 'bottle', label: 'Bottle' },
    { value: 'strip', label: 'Strip' }
  ];

  const categoryOptions = [
    { value: 'antibiotic', label: 'Antibiotic' },
    { value: 'painkiller', label: 'Painkiller' },
    { value: 'vitamin', label: 'Vitamin' },
    { value: 'supplement', label: 'Supplement' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Medicine
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Medicines"
            value={stats.totalMedicines || 0}
            icon={FaPills}
            color="blue"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStock || 0}
            icon={FaExclamationTriangle}
            color="yellow"
          />
          <StatCard
            title="Out of Stock"
            value={stats.outOfStock || 0}
            icon={FaClock}
            color="red"
          />
          <StatCard
            title="Expiring Soon"
            value={stats.expiringSoon || 0}
            icon={FaCheckCircle}
            color="orange"
          />
        </div>
      )}

      <DataTable data={medicines} columns={columns} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Medicine"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Medicine Name"
            name="medicineName"
            value={formData.medicineName}
            onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Generic Name"
              name="genericName"
              value={formData.genericName}
              onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
            />
            <FormInput
              label="Brand Name"
              name="brandName"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              required
            />
            <FormSelect
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={unitOptions}
            />
            <FormInput
              label="Reorder Level"
              name="reorderLevel"
              type="number"
              value={formData.reorderLevel}
              onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Unit Price"
              name="unitPrice"
              type="number"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
              required
            />
            <FormInput
              label="Selling Price"
              name="sellingPrice"
              type="number"
              step="0.01"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categoryOptions}
            />
            <FormInput
              label="Manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Batch Number"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
            />
            <FormInput
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          <FormInput
            label="Shelf Location"
            name="shelfLocation"
            value={formData.shelfLocation}
            onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
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
              Add Medicine
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StockManagement;

