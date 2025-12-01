import React, { useState } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Card from '../../components/shared/Card';
import DataTable from '../../components/shared/DataTable';
import Button from '../../components/shared/Button';
import Badge from '../../components/shared/Badge';
import Modal from '../../components/shared/Modal';
import * as adminService from '../../services/adminService';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await adminService.getEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Role', 
      accessor: 'role',
      render: (value) => <Badge variant="primary">{value}</Badge>
    },
    { 
      header: 'Status', 
      accessor: 'is_active',
      render: (value) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-600 mt-1">Manage all employees and staff members</p>
            </div>
            <Button onClick={() => setShowModal(true)}>Add Employee</Button>
          </div>

          <Card>
            <DataTable
              columns={columns}
              data={employees}
              loading={loading}
              actions={(row) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedEmployee(row);
                    setShowModal(true);
                  }}>
                    Edit
                  </Button>
                </div>
              )}
            />
          </Card>

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedEmployee(null);
            }}
            title={selectedEmployee ? 'Edit Employee' : 'Add Employee'}
          >
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  defaultValue={selectedEmployee?.name || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  defaultValue={selectedEmployee?.email || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>staff</option>
                  <option>hr</option>
                  <option>admin</option>
                </select>
              </div>
            </form>
          </Modal>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Employees;

