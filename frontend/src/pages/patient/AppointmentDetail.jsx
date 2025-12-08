/**
 * Patient Appointment Detail Page
 * View detailed information about a specific appointment
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentApi } from '../../api/patient/appointmentApi';
import StatusBadge from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import FormSelect from '../../components/shared/FormSelect';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaUserMd, FaClock, FaMapMarkerAlt, FaNotesMedical } from 'react-icons/fa';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const res = await appointmentApi.getById(id);
      setAppointment(res.data.data);
    } catch (error) {
      toast.error('Error loading appointment');
      navigate('/patient/appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    if (!appointment?.doctorId) return;
    
    try {
      const res = await appointmentApi.getDoctorAvailability(appointment.doctorId, { date });
      setAvailableSlots(res.data.data.availableSlots || []);
    } catch (error) {
      toast.error('Error loading availability');
    }
  };

  const handleReschedule = () => {
    setFormData({
      date: new Date(appointment.date).toISOString().split('T')[0],
      time: appointment.time,
      reason: ''
    });
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentApi.reschedule(id, {
        date: formData.date,
        time: formData.time,
        reason: formData.reason
      });
      toast.success('Appointment rescheduled successfully!');
      setIsRescheduleModalOpen(false);
      loadAppointment();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rescheduling appointment');
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentApi.cancel(id, 'Cancelled by patient');
        toast.success('Appointment cancelled');
        navigate('/patient/appointments');
      } catch (error) {
        toast.error('Error cancelling appointment');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading appointment...</div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">Appointment not found</p>
          <button
            onClick={() => navigate('/patient/appointments')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/patient/appointments')}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back to Appointments
        </button>
        <div className="flex space-x-2">
          {appointment.status === 'scheduled' && (
            <>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Reschedule
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
          <StatusBadge status={appointment.status}>{appointment.status}</StatusBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <FaCalendarAlt className="text-blue-600 text-xl mt-1" />
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium text-lg">
                {new Date(appointment.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <FaClock className="text-blue-600 text-xl mt-1" />
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-medium text-lg">{appointment.time}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <FaUserMd className="text-blue-600 text-xl mt-1" />
            <div>
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-medium text-lg">
                Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
              </p>
              <p className="text-sm text-gray-600">{appointment.doctor?.specialization}</p>
            </div>
          </div>

          {appointment.type && (
            <div className="flex items-start space-x-4">
              <FaNotesMedical className="text-blue-600 text-xl mt-1" />
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-lg">{appointment.type}</p>
              </div>
            </div>
          )}
        </div>

        {appointment.notes && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Notes</p>
            <p className="text-gray-900">{appointment.notes}</p>
          </div>
        )}

        {appointment.department && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Department</p>
            <p className="text-gray-900">{appointment.department}</p>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        title="Reschedule Appointment"
        size="lg"
      >
        <form onSubmit={handleRescheduleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Current Appointment</p>
            <p className="font-medium">
              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
            </p>
            <p className="text-sm">
              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
            </p>
          </div>

          <FormInput
            label="New Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value });
              handleDateChange(e.target.value);
            }}
            min={new Date().toISOString().split('T')[0]}
            required
          />

          {availableSlots.length > 0 && (
            <FormSelect
              label="New Time Slot"
              name="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              options={availableSlots.map(slot => ({ value: slot, label: slot }))}
              required
            />
          )}

          <FormInput
            label="Reason for Rescheduling"
            name="reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Optional"
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsRescheduleModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reschedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentDetail;

