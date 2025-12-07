/**
 * Role Permissions Management (Admin)
 * Manage role-based permissions
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import Modal from '../../../components/shared/Modal';
import { rolePermissionApi } from '../../../api/admin/staffManagementApi';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const RolePermissions = () => {
  const { rolePermissions, setRolePermissions } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await rolePermissionApi.getAll();
      setRolePermissions(res.data.data || []);
    } catch (error) {
      toast.error('Error loading permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setPermissions(role.permissions || {});
    setIsModalOpen(true);
  };

  const handlePermissionChange = (resource, action, value) => {
    setPermissions({
      ...permissions,
      [resource]: {
        ...permissions[resource],
        [action]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await rolePermissionApi.update(selectedRole.role, { permissions });
      toast.success('Permissions updated successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Error updating permissions');
    }
  };

  const columns = [
    { key: 'role', label: 'Role' },
    { key: 'description', label: 'Description' },
    {
      key: 'isActive',
      label: 'Status',
      accessor: (row) => row.isActive ? 'Active' : 'Inactive'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <button
          onClick={() => handleEdit(row)}
          className="text-blue-600 hover:text-blue-700"
        >
          Edit Permissions
        </button>
      )
    }
  ];

  const resources = ['patients', 'appointments', 'billing', 'vitals', 'beds', 'lab', 'pharmacy', 'staff'];
  const actions = ['create', 'read', 'update', 'delete'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
      </div>

      <DataTable data={rolePermissions} columns={columns} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit Permissions - ${selectedRole?.role}`}
        size="xl"
      >
        {selectedRole && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                    {actions.map(action => (
                      <th key={action} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map(resource => (
                    <tr key={resource}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">{resource}</td>
                      {actions.map(action => (
                        <td key={action} className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={permissions[resource]?.[action] || false}
                            onChange={(e) => handlePermissionChange(resource, action, e.target.checked)}
                            className="rounded"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
                Save Permissions
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default RolePermissions;

