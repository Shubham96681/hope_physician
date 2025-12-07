/**
 * Attendance Management (Admin)
 * View and manage staff attendance
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import { attendanceApi } from '../../../api/admin/staffManagementApi';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const AttendanceManagement = () => {
  const { attendance, setAttendance } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    employeeId: '',
    status: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await attendanceApi.getAll({ page: 1, limit: 100, ...filters });
      setAttendance(res.data.data || []);
    } catch (error) {
      toast.error('Error loading attendance');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      accessor: (row) => `${row.employee?.firstName} ${row.employee?.lastName}`
    },
    { key: 'empId', label: 'Employee ID', accessor: (row) => row.employee?.empId },
    {
      key: 'checkInTime',
      label: 'Check In',
      accessor: (row) => new Date(row.checkInTime).toLocaleString()
    },
    {
      key: 'checkOutTime',
      label: 'Check Out',
      accessor: (row) => row.checkOutTime ? new Date(row.checkOutTime).toLocaleString() : 'N/A'
    },
    {
      key: 'workingHours',
      label: 'Hours',
      accessor: (row) => row.workingHours ? `${row.workingHours.toFixed(2)}h` : 'N/A'
    },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            placeholder="From Date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            placeholder="To Date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Employee ID"
            value={filters.employeeId}
            onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Filter
          </button>
        </div>
      </div>

      <DataTable data={attendance} columns={columns} loading={loading} />
    </div>
  );
};

export default AttendanceManagement;

