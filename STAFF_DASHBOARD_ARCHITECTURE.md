# 🏥 Staff Dashboard System - Architecture & Folder Structure

## System Overview
Complete Staff Dashboard system for Hospital Management with role-based access control (Reception, Nurses, Lab/Pharmacy, Admin).

---

## 📁 Folder Structure

```
Hope_Physicians/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── mailer.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── medicalRecordController.js
│   │   ├── patientController.js
│   │   ├── prescriptionController.js
│   │   │
│   │   ├── staff/                    # NEW: Staff-specific controllers
│   │   │   ├── receptionController.js
│   │   │   ├── nurseController.js
│   │   │   ├── labController.js
│   │   │   ├── pharmacyController.js
│   │   │   ├── billingController.js
│   │   │   ├── vitalsController.js
│   │   │   ├── bedAllocationController.js
│   │   │   ├── inventoryController.js
│   │   │   └── attendanceController.js
│   │   │
│   │   └── admin/
│   │       ├── staffManagementController.js
│   │       ├── rolePermissionController.js
│   │       └── assetManagementController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── roleMiddleware.js          # NEW: Role-based access control
│   │   └── validationMiddleware.js    # NEW: Request validation
│   │
│   ├── models/
│   │   ├── adminModel.js
│   │   ├── appointmentModel.js
│   │   └── [existing models]
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── medicalRecordRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   │
│   │   ├── staff/                    # NEW: Staff-specific routes
│   │   │   ├── receptionRoutes.js
│   │   │   ├── nurseRoutes.js
│   │   │   ├── labRoutes.js
│   │   │   ├── pharmacyRoutes.js
│   │   │   ├── billingRoutes.js
│   │   │   ├── vitalsRoutes.js
│   │   │   ├── bedAllocationRoutes.js
│   │   │   └── inventoryRoutes.js
│   │   │
│   │   └── admin/
│   │       ├── staffManagementRoutes.js
│   │       └── rolePermissionRoutes.js
│   │
│   ├── services/
│   │   ├── pdfService.js              # Existing
│   │   ├── invoiceService.js          # NEW: Invoice generation
│   │   ├── notificationService.ts     # Existing
│   │   ├── emailService.js            # NEW: Email notifications
│   │   └── emergencyAlertService.js   # NEW: Emergency alerts
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── validators.js              # NEW: Validation helpers
│   │   ├── permissions.js             # NEW: Permission checks
│   │   └── constants.js               # NEW: Constants & enums
│   │
│   ├── prisma/
│   │   ├── schema.prisma              # Extended with new models
│   │   └── migrations/
│   │
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── appointmentApi.js
│   │   │   ├── patientApi.js
│   │   │   │
│   │   │   ├── staff/                 # NEW: Staff API clients
│   │   │   │   ├── receptionApi.js
│   │   │   │   ├── nurseApi.js
│   │   │   │   ├── labApi.js
│   │   │   │   ├── pharmacyApi.js
│   │   │   │   ├── billingApi.js
│   │   │   │   ├── vitalsApi.js
│   │   │   │   └── bedAllocationApi.js
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── staffManagementApi.js
│   │   │       └── rolePermissionApi.js
│   │   │
│   │   ├── components/
│   │   │   ├── portal/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   │
│   │   │   ├── shared/                # NEW: Reusable components
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Drawer.jsx
│   │   │   │   ├── FormInput.jsx
│   │   │   │   ├── FormSelect.jsx
│   │   │   │   ├── FormDatePicker.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── GraphCard.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   │
│   │   │   ├── staff/                 # NEW: Staff-specific components
│   │   │   │   ├── reception/
│   │   │   │   │   ├── PatientRegistrationForm.jsx
│   │   │   │   │   ├── AppointmentBooking.jsx
│   │   │   │   │   ├── AppointmentCalendar.jsx
│   │   │   │   │   ├── BillingForm.jsx
│   │   │   │   │   ├── InvoiceView.jsx
│   │   │   │   │   └── PaymentStatusBadge.jsx
│   │   │   │   │
│   │   │   │   ├── nurse/
│   │   │   │   │   ├── VitalsEntryForm.jsx
│   │   │   │   │   ├── PatientMonitor.jsx
│   │   │   │   │   ├── MedicationSchedule.jsx
│   │   │   │   │   ├── BedAllocationForm.jsx
│   │   │   │   │   ├── BedStatusGrid.jsx
│   │   │   │   │   └── EmergencyAlertButton.jsx
│   │   │   │   │
│   │   │   │   ├── lab/
│   │   │   │   │   ├── LabTestRequestForm.jsx
│   │   │   │   │   ├── LabTestList.jsx
│   │   │   │   │   ├── LabReportUpload.jsx
│   │   │   │   │   └── TestStatusBadge.jsx
│   │   │   │   │
│   │   │   │   ├── pharmacy/
│   │   │   │   │   ├── MedicineStockTable.jsx
│   │   │   │   │   ├── ExpiryAlert.jsx
│   │   │   │   │   ├── PrescriptionOrderList.jsx
│   │   │   │   │   └── StockUpdateForm.jsx
│   │   │   │   │
│   │   │   │   └── admin/
│   │   │   │       ├── StaffManagementTable.jsx
│   │   │   │       ├── RolePermissionPanel.jsx
│   │   │   │       ├── AttendanceCalendar.jsx
│   │   │   │       └── AssetManagementTable.jsx
│   │   │   │
│   │   │   └── [existing components]
│   │   │
│   │   ├── pages/
│   │   │   ├── staff/                 # Existing, will be extended
│   │   │   │   ├── StaffDashboard.jsx
│   │   │   │   ├── Appointments.jsx
│   │   │   │   ├── Attendance.jsx
│   │   │   │   │
│   │   │   │   ├── reception/         # NEW: Reception pages
│   │   │   │   │   ├── ReceptionDashboard.jsx
│   │   │   │   │   ├── PatientRegistration.jsx
│   │   │   │   │   ├── AppointmentManagement.jsx
│   │   │   │   │   ├── BillingManagement.jsx
│   │   │   │   │   └── InvoiceViewer.jsx
│   │   │   │   │
│   │   │   │   ├── nurse/             # NEW: Nurse pages
│   │   │   │   │   ├── NurseDashboard.jsx
│   │   │   │   │   ├── VitalsManagement.jsx
│   │   │   │   │   ├── PatientMonitor.jsx
│   │   │   │   │   ├── MedicationManagement.jsx
│   │   │   │   │   ├── BedAllocation.jsx
│   │   │   │   │   └── EmergencyAlerts.jsx
│   │   │   │   │
│   │   │   │   ├── lab/               # NEW: Lab pages
│   │   │   │   │   ├── LabDashboard.jsx
│   │   │   │   │   ├── LabTestManagement.jsx
│   │   │   │   │   └── LabReportManagement.jsx
│   │   │   │   │
│   │   │   │   ├── pharmacy/          # NEW: Pharmacy pages
│   │   │   │   │   ├── PharmacyDashboard.jsx
│   │   │   │   │   ├── StockManagement.jsx
│   │   │   │   │   └── PrescriptionOrders.jsx
│   │   │   │   │
│   │   │   │   └── admin/             # NEW: Admin pages
│   │   │   │       ├── AdminDashboard.jsx
│   │   │   │       ├── StaffManagement.jsx
│   │   │   │       ├── RolePermissions.jsx
│   │   │   │       ├── AttendanceManagement.jsx
│   │   │   │       └── AssetManagement.jsx
│   │   │   │
│   │   │   └── [existing pages]
│   │   │
│   │   ├── store/                     # NEW: State management (Zustand)
│   │   │   ├── useAuthStore.js
│   │   │   ├── useStaffStore.js
│   │   │   ├── usePatientStore.js
│   │   │   ├── useAppointmentStore.js
│   │   │   └── useNotificationStore.js
│   │   │
│   │   ├── hooks/                     # NEW: Custom hooks
│   │   │   ├── useRole.js
│   │   │   ├── usePermissions.js
│   │   │   ├── useTable.js
│   │   │   └── useForm.js
│   │   │
│   │   ├── utils/                     # NEW: Frontend utilities
│   │   │   ├── constants.js
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── pdfGenerator.js
│   │   │
│   │   ├── contexts/
│   │   │   ├── AlertContext.jsx
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── AppRouter.jsx          # Extended with staff routes
│   │   │
│   │   └── [existing files]
│   │
│   └── [existing config files]
│
└── [root files]
```

---

## 🗄️ Database Schema Extensions

### New Models to Add:
1. **Billing** - Invoice & payment tracking
2. **PatientVitals** - Vital signs records
3. **BedAllocation** - Room & bed management
4. **LabTest** - Lab test requests & results
5. **Pharmacy** - Medicine inventory
6. **Inventory** - Equipment & asset management
7. **RolePermission** - Role-based access control
8. **MedicationSchedule** - Medication tracking
9. **EmergencyAlert** - Emergency notifications

---

## 🔐 Role-Based Access Control

### Roles:
- **admin** - Full system access
- **reception** - Patient registration, appointments, billing
- **nurse** - Vitals, medication, bed allocation, emergency alerts
- **lab** - Lab test management, report uploads
- **pharmacy** - Stock management, prescription orders
- **doctor** - Existing doctor dashboard features

### Permission Matrix:
| Feature | Admin | Reception | Nurse | Lab | Pharmacy | Doctor |
|---------|-------|-----------|-------|-----|----------|--------|
| Patient Registration | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Appointment Management | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Billing & Invoices | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Vitals Entry | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Bed Allocation | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Lab Test Requests | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Lab Report Upload | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Pharmacy Stock | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Prescription Orders | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Staff Management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Role Permissions | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Attendance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 📊 API Structure

### Base URL: `/api/staff`

#### Reception Routes:
- `POST /reception/patients` - Register new patient
- `GET /reception/patients` - List patients
- `POST /reception/appointments` - Create appointment
- `PUT /reception/appointments/:id` - Update appointment
- `DELETE /reception/appointments/:id` - Cancel appointment
- `POST /reception/billing` - Create invoice
- `GET /reception/billing` - List invoices
- `GET /reception/billing/:id/pdf` - Generate PDF invoice
- `PUT /reception/billing/:id/payment` - Update payment status

#### Nurse Routes:
- `POST /nurse/vitals` - Record vitals
- `GET /nurse/vitals/:patientId` - Get patient vitals history
- `GET /nurse/patients/admitted` - List admitted patients
- `POST /nurse/medication` - Update medication schedule
- `GET /nurse/beds` - List beds & rooms
- `POST /nurse/beds/allocate` - Allocate bed
- `PUT /nurse/beds/:id/release` - Release bed
- `POST /nurse/emergency` - Trigger emergency alert

#### Lab Routes:
- `POST /lab/tests` - Create lab test request
- `GET /lab/tests` - List lab tests
- `PUT /lab/tests/:id/status` - Update test status
- `POST /lab/tests/:id/report` - Upload lab report
- `GET /lab/tests/:id/report` - Download lab report

#### Pharmacy Routes:
- `GET /pharmacy/stock` - List medicine stock
- `POST /pharmacy/stock` - Add/update stock
- `GET /pharmacy/expiry` - Get expiring medicines
- `GET /pharmacy/orders` - List prescription orders
- `PUT /pharmacy/orders/:id/status` - Update order status

#### Admin Routes:
- `GET /admin/staff` - List all staff
- `POST /admin/staff` - Add staff member
- `PUT /admin/staff/:id` - Update staff
- `DELETE /admin/staff/:id` - Delete staff
- `GET /admin/roles` - List roles & permissions
- `PUT /admin/roles/:id/permissions` - Update permissions
- `GET /admin/attendance` - Attendance reports
- `GET /admin/inventory` - Asset inventory
- `POST /admin/inventory` - Add asset

---

## 🎨 UI Component Architecture

### Layout Structure:
```
DashboardLayout
├── Sidebar (role-based menu)
├── Topbar (notifications, profile)
└── Main Content Area
    ├── Page Header
    ├── Stats Cards (GraphCard components)
    ├── Data Tables / Lists
    └── Action Buttons / Modals
```

### Reusable Components:
- **DataTable**: Sortable, filterable, paginated tables
- **StatusBadge**: Color-coded status indicators
- **Modal/Drawer**: Form containers
- **FormInput/Select/DatePicker**: Validated form fields
- **GraphCard**: Chart containers (stats, trends)
- **StatCard**: Summary cards with icons

---

## 🔄 Workflow Examples

### 1. Appointment Flow:
1. Reception creates appointment → assigns doctor
2. Patient arrives → Reception checks in
3. Nurse records vitals → updates patient status
4. Doctor consultation → creates prescription
5. Pharmacy processes prescription → updates order status
6. Billing generates invoice → tracks payment

### 2. Patient Admission Flow:
1. Reception registers patient (if new)
2. Doctor recommends admission
3. Nurse allocates bed → updates room status
4. Nurse records initial vitals
5. Continuous monitoring → vitals updates
6. Discharge → bed release → final billing

### 3. Lab Test Flow:
1. Doctor requests lab test → creates test record
2. Lab receives request → assigns technician
3. Test performed → results recorded
4. Lab uploads report → updates status
5. Doctor reviews report → updates medical record

---

## 🚀 Scalability Improvements

1. **Caching**: Redis for frequently accessed data
2. **Real-time Updates**: WebSocket/Socket.io for live dashboards
3. **File Storage**: Cloud storage (AWS S3/Cloudinary) for reports/images
4. **Queue System**: Bull/BullMQ for background jobs (PDF generation, emails)
5. **Search**: Elasticsearch for advanced patient/search
6. **Monitoring**: Logging & error tracking (Winston, Sentry)
7. **API Rate Limiting**: Prevent abuse
8. **Database Indexing**: Optimize query performance
9. **Microservices**: Split by domain (billing, lab, pharmacy)
10. **CDN**: Static asset delivery

---

## 📝 Next Steps

1. ✅ Create folder structure
2. ✅ Extend Prisma schema
3. ⏳ Build API routes & controllers
4. ⏳ Create middleware for role-based access
5. ⏳ Build UI components
6. ⏳ Implement state management
7. ⏳ Add PDF generation
8. ⏳ Testing & validation

