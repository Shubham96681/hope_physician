/**
 * Zustand Store for Patient Dashboard
 * Centralized state management for patient-related data
 */

import { create } from 'zustand';

const usePatientStore = create((set, get) => ({
  // User & Auth
  user: null,
  patient: null,
  setUser: (user) => set({ user }),
  setPatient: (patient) => set({ patient }),

  // Appointments
  appointments: [],
  upcomingAppointments: [],
  selectedAppointment: null,
  setAppointments: (appointments) => {
    const upcoming = appointments.filter(apt => 
      new Date(apt.date) >= new Date() && 
      ['scheduled', 'confirmed'].includes(apt.status)
    );
    set({ appointments, upcomingAppointments: upcoming });
  },
  setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),

  // Doctors
  availableDoctors: [],
  setAvailableDoctors: (doctors) => set({ availableDoctors: doctors }),

  // Prescriptions
  prescriptions: [],
  selectedPrescription: null,
  setPrescriptions: (prescriptions) => set({ prescriptions }),
  setSelectedPrescription: (prescription) => set({ selectedPrescription: prescription }),

  // Reports
  reports: [],
  labReports: [],
  selectedReport: null,
  setReports: (reports) => set({ reports }),
  setLabReports: (reports) => set({ labReports: reports }),
  setSelectedReport: (report) => set({ selectedReport: report }),

  // Billing
  bills: [],
  pendingBills: [],
  paymentHistory: [],
  setBills: (bills) => {
    const pending = bills.filter(bill => bill.paymentStatus !== 'paid');
    set({ bills, pendingBills: pending });
  },
  setPaymentHistory: (history) => set({ paymentHistory: history }),

  // Insurance
  insuranceFiles: [],
  setInsuranceFiles: (files) => set({ insuranceFiles: files }),

  // Reminders
  reminders: [],
  setReminders: (reminders) => set({ reminders }),

  // Chat
  chatMessages: [],
  supportAgents: [],
  unreadCount: 0,
  setChatMessages: (messages) => {
    const unread = messages.filter(msg => !msg.isRead && msg.senderType !== 'patient').length;
    set({ chatMessages: messages, unreadCount: unread });
  },
  setSupportAgents: (agents) => set({ supportAgents: agents }),
  addChatMessage: (message) => {
    const messages = [...get().chatMessages, message];
    set({ chatMessages: messages });
  },

  // Admission
  admissionStatus: null,
  admissionHistory: [],
  setAdmissionStatus: (status) => set({ admissionStatus: status }),
  setAdmissionHistory: (history) => set({ admissionHistory: history }),

  // Feedback
  feedbacks: [],
  setFeedbacks: (feedbacks) => set({ feedbacks }),

  // UI State
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Modals
  isModalOpen: false,
  modalType: null,
  openModal: (type) => set({ isModalOpen: true, modalType: type }),
  closeModal: () => set({ isModalOpen: false, modalType: null }),

  // Reset store
  reset: () => set({
    appointments: [],
    upcomingAppointments: [],
    selectedAppointment: null,
    availableDoctors: [],
    prescriptions: [],
    selectedPrescription: null,
    reports: [],
    labReports: [],
    selectedReport: null,
    bills: [],
    pendingBills: [],
    paymentHistory: [],
    insuranceFiles: [],
    reminders: [],
    chatMessages: [],
    supportAgents: [],
    unreadCount: 0,
    admissionStatus: null,
    admissionHistory: [],
    feedbacks: [],
    loading: false,
    error: null,
    isModalOpen: false,
    modalType: null
  })
}));

export default usePatientStore;

