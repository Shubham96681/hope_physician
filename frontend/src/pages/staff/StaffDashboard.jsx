import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Badge from '../../components/shared/Badge';
import { 
  FaClock, 
  FaCheckCircle, 
  FaFileMedical,
  FaTasks,
  FaUserClock,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaUsers
} from 'react-icons/fa';

const StaffDashboard = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [kycAssistance, setKycAssistance] = useState([]);
  const [stats, setStats] = useState({
    tasksCompleted: 12,
    tasksPending: 5,
    kycPending: 3
  });

  useEffect(() => {
    // Check if already checked in today
    const todayCheckIn = localStorage.getItem('checkInTime');
    if (todayCheckIn) {
      setCheckedIn(true);
      setCheckInTime(todayCheckIn);
    }

    // Load tasks
    setTasks([
      { id: 1, title: 'Assist with KYC uploads', count: 3, priority: 'high', status: 'pending' },
      { id: 2, title: 'Schedule appointments', count: 5, priority: 'medium', status: 'pending' },
      { id: 3, title: 'Update patient records', count: 2, priority: 'low', status: 'completed' },
      { id: 4, title: 'Process insurance forms', count: 8, priority: 'high', status: 'pending' }
    ]);

    // Load KYC assistance requests
    setKycAssistance([
      { id: 1, patient: 'Robert Taylor', submitted: '2 days ago', documents: 3, status: 'pending' },
      { id: 2, patient: 'Emily Davis', submitted: '1 day ago', documents: 2, status: 'pending' },
      { id: 3, patient: 'David Wilson', submitted: '3 days ago', documents: 4, status: 'in-progress' }
    ]);
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleString();
    setCheckInTime(timeString);
    setCheckedIn(true);
    localStorage.setItem('checkInTime', timeString);
    // In production, this would call the API
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toLocaleString();
    setCheckOutTime(timeString);
    setCheckedIn(false);
    localStorage.removeItem('checkInTime');
    // In production, this would call the API
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'red',
      'medium': 'amber',
      'low': 'green'
    };
    return colors[priority] || 'gray';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your attendance and tasks</p>
          </div>
          <div className="flex gap-3">
            <Link to="/staff/tasks">
              <Button variant="outline">View All Tasks</Button>
            </Link>
          </div>
        </div>

        {/* Attendance Card */}
        <Card className={`p-6 bg-gradient-to-r ${checkedIn ? 'from-green-500 to-green-600' : 'from-primary to-primary-600'} text-white border-0`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {!checkedIn ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <FaClock className="w-8 h-8 opacity-90" />
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Ready to check in?</h3>
                      <p className="text-sm opacity-90">Start your workday by checking in</p>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleCheckIn}
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    <FaCheckCircle className="w-5 h-5 mr-2" />
                    Check In
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <FaCheckCircle className="w-8 h-8 opacity-90" />
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Checked In</h3>
                      <p className="text-sm opacity-90">Checked in at: {checkInTime}</p>
                      {checkOutTime && (
                        <p className="text-sm opacity-90">Checked out at: {checkOutTime}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleCheckOut}
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    <FaUserClock className="w-5 h-5 mr-2" />
                    Check Out
                  </Button>
                </>
              )}
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-4xl font-bold opacity-90">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-sm opacity-80">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tasks Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.tasksCompleted}</p>
                <p className="text-xs text-blue-600 mt-1">Today</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FaCheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.tasksPending}</p>
                <p className="text-xs text-amber-600 mt-1">Requires attention</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <FaTasks className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">KYC Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.kycPending}</p>
                <p className="text-xs text-red-600 mt-1">Needs assistance</p>
              </div>
              <div className="p-3 rounded-xl bg-red-100">
                <FaFileMedical className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <Card 
            title="Today's Tasks" 
            actions={
              <Link to="/staff/tasks">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            }
            className="h-full"
          >
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    task.status === 'completed' 
                      ? 'bg-green-50 border-green-400' 
                      : 'bg-gray-50 border-' + getPriorityColor(task.priority) + '-400'
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        {task.status === 'pending' && (
                          <Badge variant={getPriorityColor(task.priority) === 'red' ? 'danger' : getPriorityColor(task.priority) === 'amber' ? 'warning' : 'success'}>
                            {task.priority}
                          </Badge>
                        )}
                        {task.status === 'completed' && (
                          <Badge variant="success">Completed</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{task.count} items</p>
                    </div>
                    {task.status === 'pending' && (
                      <Button size="sm" variant="ghost">Start</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* KYC Assistance */}
          <Card 
            title="KYC Assistance Requests" 
            actions={
              <Link to="/staff/kyc-assistance">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            }
            className="h-full"
          >
            <div className="space-y-3">
              {kycAssistance.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No KYC assistance requests</div>
              ) : (
                kycAssistance.map((kyc) => (
                  <div 
                    key={kyc.id} 
                    className="p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FaUsers className="w-4 h-4 text-amber-600" />
                          <p className="font-semibold text-gray-900">{kyc.patient}</p>
                          <Badge variant="warning">{kyc.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Submitted {kyc.submitted}</p>
                        <p className="text-xs text-gray-500">{kyc.documents} documents uploaded</p>
                      </div>
                      <Button size="sm">Assist</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/staff/tasks">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaTasks className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">My Tasks</p>
              </div>
            </Link>
            <Link to="/staff/kyc-assistance">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaFileMedical className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">KYC Assistance</p>
              </div>
            </Link>
            <Link to="/staff/appointments">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaCalendarAlt className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Appointments</p>
              </div>
            </Link>
            <Link to="/staff/attendance">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer">
                <FaUserClock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Attendance</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
