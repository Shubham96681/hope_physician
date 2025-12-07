// pages/doctor/PatientQueue.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaPhone,
  FaBell,
} from 'react-icons/fa';
import * as doctorService from '../../services/doctorService';

const PatientQueue = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (user?.doctorId) {
      fetchQueue();
      // Refresh queue every 10 seconds
      const interval = setInterval(fetchQueue, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchQueue = async () => {
    try {
      const response = await doctorService.getPatientQueue(user.doctorId);
      setQueue(response.data || []);
    } catch (error) {
      console.error('Error fetching queue:', error);
      toast.error('Failed to load patient queue');
    } finally {
      setLoading(false);
    }
  };

  const updateQueueStatus = async (appointmentId, status) => {
    try {
      setUpdating(appointmentId);
      await doctorService.updateQueueStatus(appointmentId, { status });
      toast.success('Queue status updated');
      fetchQueue();
    } catch (error) {
      console.error('Error updating queue status:', error);
      toast.error('Failed to update queue status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      waiting: 'warning',
      in_progress: 'info',
      completed: 'success',
      cancelled: 'danger',
      no_show: 'secondary',
    };
    return variants[status] || 'default';
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Queue</h1>
            <p className="text-gray-600 mt-1">Real-time patient queue status</p>
          </div>
          <Button
            variant="outline"
            onClick={fetchQueue}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FaBell className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total in Queue</p>
                <p className="text-2xl font-bold text-gray-900">{queue.length}</p>
              </div>
              <FaUser className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queue.filter(p => p.status === 'waiting').length}
                </p>
              </div>
              <FaClock className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queue.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <FaCheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4 bg-gray-50 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queue.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <FaCheckCircle className="w-8 h-8 text-gray-600" />
            </div>
          </Card>
        </div>

        {/* Queue List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Queue</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-gray-500">Loading queue...</p>
            </div>
          ) : queue.length === 0 ? (
            <div className="text-center py-8">
              <FaUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No patients in queue</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((patient) => (
                <div
                  key={patient.appointmentId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-primary"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {patient.queueNumber}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {patient.patient?.firstName} {patient.patient?.lastName}
                        </h3>
                        <Badge variant={getStatusBadge(patient.status)}>
                          {patient.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          {formatTime(patient.time)}
                        </span>
                        {patient.estimatedWaitTime && (
                          <span className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            Est. wait: {patient.estimatedWaitTime} min
                          </span>
                        )}
                        {patient.patient?.phone && (
                          <span className="flex items-center gap-1">
                            <FaPhone className="w-3 h-3" />
                            {patient.patient.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {patient.status === 'waiting' && (
                      <Button
                        size="sm"
                        onClick={() => updateQueueStatus(patient.appointmentId, 'in_progress')}
                        disabled={updating === patient.appointmentId}
                      >
                        {updating === patient.appointmentId ? (
                          <FaSpinner className="w-3 h-3 animate-spin" />
                        ) : (
                          'Call Patient'
                        )}
                      </Button>
                    )}
                    {patient.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => updateQueueStatus(patient.appointmentId, 'completed')}
                        disabled={updating === patient.appointmentId}
                      >
                        {updating === patient.appointmentId ? (
                          <FaSpinner className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <FaCheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </>
                        )}
                      </Button>
                    )}
                    {patient.status !== 'completed' && patient.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => updateQueueStatus(patient.appointmentId, 'cancelled')}
                        disabled={updating === patient.appointmentId}
                      >
                        <FaTimes className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientQueue;

