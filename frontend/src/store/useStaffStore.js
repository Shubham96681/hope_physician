/**
 * Zustand Store for Staff Dashboard
 * Centralized state management for staff-related data
 */

import { create } from 'zustand';

const useStaffStore = create((set, get) => ({
  // User & Auth
  user: null,
  role: null,
  setUser: (user) => set({ user, role: user?.role }),

  // Patients
  patients: [],
  selectedPatient: null,
  setPatients: (patients) => set({ patients }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),

  // Appointments
  appointments: [],
  selectedAppointment: null,
  setAppointments: (appointments) => set({ appointments }),
  setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),

  // Billing
  billings: [],
  billingStats: null,
  setBillings: (billings) => set({ billings }),
  setBillingStats: (stats) => set({ billingStats: stats }),

  // Vitals
  vitals: [],
  setVitals: (vitals) => set({ vitals }),

  // Admitted Patients
  admittedPatients: [],
  setAdmittedPatients: (patients) => set({ admittedPatients: patients }),

  // Medication Schedules
  medicationSchedules: [],
  setMedicationSchedules: (schedules) => set({ medicationSchedules: schedules }),

  // Bed Allocations
  beds: [],
  setBeds: (beds) => set({ beds }),

  // Emergency Alerts
  emergencyAlerts: [],
  setEmergencyAlerts: (alerts) => set({ emergencyAlerts: alerts }),

  // Lab Tests
  labTests: [],
  setLabTests: (tests) => set({ labTests: tests }),

  // Pharmacy
  medicines: [],
  prescriptionOrders: [],
  setMedicines: (medicines) => set({ medicines }),
  setPrescriptionOrders: (orders) => set({ prescriptionOrders: orders }),

  // Staff Management (Admin)
  staff: [],
  employees: [],
  setStaff: (staff) => set({ staff }),
  setEmployees: (employees) => set({ employees }),

  // Role Permissions
  rolePermissions: [],
  setRolePermissions: (permissions) => set({ rolePermissions: permissions }),

  // Attendance
  attendance: [],
  setAttendance: (attendance) => set({ attendance }),

  // Inventory
  inventory: [],
  setInventory: (inventory) => set({ inventory }),

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
    patients: [],
    selectedPatient: null,
    appointments: [],
    selectedAppointment: null,
    billings: [],
    billingStats: null,
    vitals: [],
    admittedPatients: [],
    medicationSchedules: [],
    beds: [],
    emergencyAlerts: [],
    labTests: [],
    medicines: [],
    prescriptionOrders: [],
    staff: [],
    employees: [],
    rolePermissions: [],
    attendance: [],
    inventory: [],
    loading: false,
    error: null,
    isModalOpen: false,
    modalType: null
  })
}));

export default useStaffStore;

