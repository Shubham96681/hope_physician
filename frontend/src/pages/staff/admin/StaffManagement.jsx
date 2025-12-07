/**
 * Staff Management (Admin)
 * Add, update, delete staff members
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import Modal from '../../../components/shared/Modal';
import FormInput from '../../../components/shared/FormInput';
import FormSelect from '../../../components/shared/FormSelect';
import { staffApi } from '../../../api/admin/staffManagementApi';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const StaffManagement = () => {
  const { staff, setStaff } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    password: '',
    role: 'staff'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const staffRes = await staffApi.getAll({ page: 1, limit: 100 });
      setStaff(staffRes.data.data || []);
    } catch (error) {
      toast.error('Error loading staff');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: '',
      department: '',
      password: '',
      role: 'staff'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffApi.add(formData);
      toast.success('Staff member added successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding staff');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this staff member?')) {
      try {
        await staffApi.delete(id);
        toast.success('Staff member deactivated');
        loadData();
      } catch (error) {
        toast.error('Error deactivating staff');
      }
    }
  };

  const columns = [
    { key: 'empId', label: 'Employee ID' },
    {
      key: 'name',
      label: 'Name',
      accessor: (row) => `${row.firstName} ${row.lastName}`
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'designation', label: 'Designation' },
    { key: 'department', label: 'Department' },
    {
      key: 'role',
      label: 'Role',
      accessor: (row) => row.portalUser?.role || 'N/A'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-600 hover:text-red-700"
        >
          Deactivate
        </button>
      )
    }
  ];

  const roleOptions = [
    { value: 'staff', label: 'Staff' },
    { value: 'reception', label: 'Reception' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'lab', label: 'Lab' },
    { value: 'pharmacy', label: 'Pharmacy' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Staff Member
        </button>
      </div>

      <DataTable data={staff} columns={columns} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Staff Member"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <FormInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
            <FormInput
              label="Department"
              name="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <FormSelect
            label="Role"
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={roleOptions}
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Leave blank for default password"
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
              Add Staff
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffManagement;

