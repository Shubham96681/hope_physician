/**
 * Inventory Management (Admin)
 * Manage hospital assets and equipment
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Modal from '../../../components/shared/Modal';
import FormInput from '../../../components/shared/FormInput';
import FormSelect from '../../../components/shared/FormSelect';
import { inventoryApi } from '../../../api/admin/staffManagementApi';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const InventoryManagement = () => {
  const { inventory, setInventory } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    category: '',
    description: '',
    manufacturer: '',
    modelNumber: '',
    serialNumber: '',
    quantity: 1,
    unit: 'unit',
    location: '',
    status: 'available',
    condition: '',
    purchaseDate: '',
    purchasePrice: '',
    warrantyExpiry: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAll({ page: 1, limit: 100 });
      setInventory(res.data.data || []);
    } catch (error) {
      toast.error('Error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      itemName: '',
      itemCode: '',
      category: '',
      description: '',
      manufacturer: '',
      modelNumber: '',
      serialNumber: '',
      quantity: 1,
      unit: 'unit',
      location: '',
      status: 'available',
      condition: '',
      purchaseDate: '',
      purchasePrice: '',
      warrantyExpiry: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.add(formData);
      toast.success('Inventory item added successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding item');
    }
  };

  const columns = [
    { key: 'itemName', label: 'Item Name' },
    { key: 'itemCode', label: 'Code' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'location', label: 'Location' },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    { key: 'condition', label: 'Condition' }
  ];

  const categoryOptions = [
    { value: 'equipment', label: 'Equipment' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'consumable', label: 'Consumable' },
    { value: 'medical_device', label: 'Medical Device' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'damaged', label: 'Damaged' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      <DataTable data={inventory} columns={columns} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Inventory Item"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Item Code"
              name="itemCode"
              value={formData.itemCode}
              onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
            />
            <FormSelect
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categoryOptions}
              required
            />
          </div>

          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
            <FormInput
              label="Model Number"
              name="modelNumber"
              value={formData.modelNumber}
              onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Serial Number"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />
            <FormInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            />
            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statusOptions}
            />
            <FormSelect
              label="Condition"
              name="condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              options={conditionOptions}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            />
            <FormInput
              label="Purchase Price"
              name="purchasePrice"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
            />
            <FormInput
              label="Warranty Expiry"
              name="warrantyExpiry"
              type="date"
              value={formData.warrantyExpiry}
              onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
            />
          </div>

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
              Add Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryManagement;

