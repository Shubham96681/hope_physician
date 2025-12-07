/**
 * Patient Appointments Page
 * View, book, cancel, and reschedule appointments
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import FormSelect from '../../components/shared/FormSelect';
import { appointmentApi } from '../../api/patient/appointmentApi';
import usePatientStore from '../../store/usePatientStore';
import toast from 'react-hot-toast';

const Appointments = () => {
  const navigate = useNavigate();
  const { appointments, setAppointments, availableDoctors, setAvailableDoctors } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    type: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, doctorsRes] = await Promise.all([
        appointmentApi.getAll({ page: 1, limit: 100 }),
        appointmentApi.getAvailableDoctors()
      ]);

      setAppointments(appointmentsRes.data.data || []);
      setAvailableDoctors(doctorsRes.data.data || []);
    } catch (error) {
      toast.error('Error loading appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    setFormData({
      doctorId: '',
      date: '',
      time: '',
      type: '',
      notes: ''
    });
    setIsBookingModalOpen(true);
  };

  const handleDoctorChange = async (doctorId) => {
    if (!formData.date) return;
    
    try {
      const res = await appointmentApi.getDoctorAvailability(doctorId, { date: formData.date });
      setAvailableSlots(res.data.data.availableSlots || []);
    } catch (error) {
      toast.error('Error loading availability');
    }
  };

  const handleDateChange = async (date) => {
    if (!formData.doctorId) return;
    
    try {
      const res = await appointmentApi.getDoctorAvailability(formData.doctorId, { date });
      setAvailableSlots(res.data.data.availableSlots || []);
    } catch (error) {
      toast.error('Error loading availability');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentApi.book(formData);
      toast.success('Appointment booked successfully!');
      setIsBookingModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking appointment');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentApi.cancel(id, 'Cancelled by patient');
        toast.success('Appointment cancelled');
        loadData();
      } catch (error) {
        toast.error('Error cancelling appointment');
      }
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      doctorId: appointment.doctorId,
      date: new Date(appointment.date).toISOString().split('T')[0],
      time: appointment.time,
      type: appointment.type || '',
      notes: ''
    });
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentApi.reschedule(selectedAppointment.id, {
        date: formData.date,
        time: formData.time,
        reason: formData.notes
      });
      toast.success('Appointment rescheduled successfully!');
      setIsRescheduleModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rescheduling appointment');
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      accessor: (row) => new Date(row.date).toLocaleDateString()
    },
    { key: 'time', label: 'Time' },
    {
      key: 'doctor',
      label: 'Doctor',
      accessor: (row) => `Dr. ${row.doctor?.firstName} ${row.doctor?.lastName}`
    },
    { key: 'type', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/patient/appointments/${row.id}`)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            View
          </button>
          {row.status === 'scheduled' && (
            <>
              <button
                onClick={() => handleReschedule(row)}
                className="text-yellow-600 hover:text-yellow-700 text-sm"
              >
                Reschedule
              </button>
              <button
                onClick={() => handleCancel(row.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  const doctorOptions = availableDoctors.map((d) => ({
    value: d.id,
    label: `Dr. ${d.firstName} ${d.lastName} - ${d.specialization}`
  }));

  const typeOptions = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'checkup', label: 'Checkup' },
    { value: 'emergency', label: 'Emergency' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <button
          onClick={handleBook}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </div>

      <DataTable data={appointments} columns={columns} loading={loading} />

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Book Appointment"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect
            label="Select Doctor"
            name="doctorId"
            value={formData.doctorId}
            onChange={(e) => {
              setFormData({ ...formData, doctorId: e.target.value });
              handleDoctorChange(e.target.value);
            }}
            options={doctorOptions}
            required
          />

          <FormInput
            label="Date"
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
              label="Available Time Slots"
              name="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              options={availableSlots.map(slot => ({ value: slot, label: slot }))}
              required
            />
          )}

          <FormSelect
            label="Appointment Type"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={typeOptions}
          />

          <FormInput
            label="Notes (Optional)"
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        title="Reschedule Appointment"
        size="lg"
      >
        {selectedAppointment && (
          <form onSubmit={handleRescheduleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Current Appointment</p>
              <p className="font-medium">
                {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
              </p>
              <p className="text-sm">
                Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
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
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
        )}
      </Modal>
    </div>
  );
};

export default Appointments;

