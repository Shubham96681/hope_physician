# 👨‍⚕️ Patient Dashboard System - Architecture & Folder Structure

## System Overview
Complete Patient Dashboard system for Hospital Management with appointment booking, prescriptions, reports, billing, chat, and more.

---

## 📁 Folder Structure

```
Hope_Physicians/
├── backend/
│   ├── controllers/
│   │   ├── patient/                    # NEW: Patient-specific controllers
│   │   │   ├── appointmentController.js
│   │   │   ├── prescriptionController.js
│   │   │   ├── reportController.js
│   │   │   ├── billingController.js
│   │   │   ├── paymentController.js
│   │   │   ├── insuranceController.js
│   │   │   ├── reminderController.js
│   │   │   ├── chatController.js
│   │   │   ├── admissionController.js
│   │   │   └── feedbackController.js
│   │   │
│   │   └── [existing controllers]
│   │
│   ├── routes/
│   │   ├── patient/                    # NEW: Patient routes
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── prescriptionRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   ├── billingRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── insuranceRoutes.js
│   │   │   ├── reminderRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   ├── admissionRoutes.js
│   │   │   └── feedbackRoutes.js
│   │   │
│   │   └── [existing routes]
│   │
│   ├── services/
│   │   ├── paymentService.js           # NEW: Payment gateway integration
│   │   ├── reminderService.js          # NEW: Email/SMS reminders
│   │   ├── chatService.js              # NEW: Real-time chat
│   │   └── [existing services]
│   │
│   ├── utils/
│   │   ├── otpService.js               # NEW: OTP generation/verification
│   │   └── [existing utils]
│   │
│   └── prisma/
│       └── schema.prisma               # Extended with patient models
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── patient/                # NEW: Patient API clients
│   │   │   │   ├── appointmentApi.js
│   │   │   │   ├── prescriptionApi.js
│   │   │   │   ├── reportApi.js
│   │   │   │   ├── billingApi.js
│   │   │   │   ├── paymentApi.js
│   │   │   │   ├── insuranceApi.js
│   │   │   │   ├── reminderApi.js
│   │   │   │   ├── chatApi.js
│   │   │   │   ├── admissionApi.js
│   │   │   │   └── feedbackApi.js
│   │   │   │
│   │   │   └── [existing APIs]
│   │   │
│   │   ├── components/
│   │   │   ├── patient/                # NEW: Patient-specific components
│   │   │   │   ├── AppointmentBooking.jsx
│   │   │   │   ├── AppointmentCalendar.jsx
│   │   │   │   ├── DoctorCard.jsx
│   │   │   │   ├── PrescriptionCard.jsx
│   │   │   │   ├── ReportViewer.jsx
│   │   │   │   ├── BillCard.jsx
│   │   │   │   ├── PaymentGateway.jsx
│   │   │   │   ├── InsuranceUpload.jsx
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── AdmissionTracker.jsx
│   │   │   │   ├── FeedbackModal.jsx
│   │   │   │   └── EmergencyButton.jsx
│   │   │   │
│   │   │   └── [existing components]
│   │   │
│   │   ├── pages/
│   │   │   ├── patient/                 # NEW: Patient pages
│   │   │   │   ├── PatientDashboard.jsx
│   │   │   │   ├── Appointments.jsx
│   │   │   │   ├── Prescriptions.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   ├── Billing.jsx
│   │   │   │   ├── Insurance.jsx
│   │   │   │   ├── Chat.jsx
│   │   │   │   ├── Admission.jsx
│   │   │   │   └── Feedback.jsx
│   │   │   │
│   │   │   └── [existing pages]
│   │   │
│   │   ├── store/
│   │   │   ├── usePatientStore.js      # NEW: Patient state management
│   │   │   └── [existing stores]
│   │   │
│   │   └── hooks/
│   │       ├── useChat.js              # NEW: Chat hook
│   │       ├── useReminders.js         # NEW: Reminders hook
│   │       └── [existing hooks]
│   │
│   └── [existing files]
│
└── [root files]
```

---

## 🗄️ Database Schema Extensions

### New Models to Add:
1. **InsuranceFile** - Insurance document uploads
2. **Reminder** - Medication/appointment reminders
3. **ChatMessage** - Real-time chat messages
4. **Feedback** - Doctor/hospital feedback
5. **PaymentTransaction** - Payment gateway transactions
6. **AdmissionStatus** - Admission tracking

---

## 🔐 Authentication & Security

### Patient Authentication:
- Email/Phone + Password
- OTP-based login (optional)
- Session management with JWT
- Password reset flow

### Data Privacy:
- HIPAA compliance considerations
- Encrypted sensitive data
- Secure file uploads
- Access control

---

## 📊 API Structure

### Base URL: `/api/patient`

#### Appointment Routes:
- `GET /appointments` - List patient appointments
- `POST /appointments` - Book appointment
- `PUT /appointments/:id` - Reschedule appointment
- `DELETE /appointments/:id` - Cancel appointment
- `GET /doctors/available` - Get available doctors

#### Prescription Routes:
- `GET /prescriptions` - List prescriptions
- `GET /prescriptions/:id` - Get prescription details

#### Report Routes:
- `GET /reports` - List medical reports
- `GET /reports/:id` - View report
- `GET /reports/:id/download` - Download PDF

#### Billing Routes:
- `GET /billing` - List bills
- `GET /billing/:id` - Get bill details
- `POST /billing/:id/payment` - Process payment

#### Payment Routes:
- `POST /payments/create` - Create payment intent
- `POST /payments/verify` - Verify payment
- `GET /payments/history` - Payment history

#### Insurance Routes:
- `GET /insurance` - Get insurance info
- `POST /insurance/upload` - Upload documents
- `DELETE /insurance/:id` - Delete document

#### Reminder Routes:
- `GET /reminders` - List reminders
- `POST /reminders` - Create reminder
- `PUT /reminders/:id` - Update reminder
- `DELETE /reminders/:id` - Delete reminder

#### Chat Routes:
- `GET /chat/messages` - Get chat history
- `POST /chat/messages` - Send message
- `GET /chat/support` - Get support agents

#### Admission Routes:
- `GET /admission/status` - Get admission status
- `GET /admission/history` - Admission history

#### Feedback Routes:
- `GET /feedback` - List feedback
- `POST /feedback` - Submit feedback
- `PUT /feedback/:id` - Update feedback

---

## 🎨 UI Component Architecture

### Dashboard Layout:
```
PatientDashboard
├── Quick Actions (Cards)
│   ├── Book Appointment
│   ├── View Reports
│   ├── Pay Bills
│   └── Chat Support
├── Upcoming Appointments
├── Recent Prescriptions
├── Pending Bills
└── Medication Reminders
```

### Key Components:
- **AppointmentBooking**: Calendar + Doctor selection
- **PrescriptionCard**: Prescription details with medications
- **ReportViewer**: PDF viewer with download
- **BillCard**: Bill summary with payment button
- **PaymentGateway**: Razorpay/Stripe integration
- **ChatWindow**: Real-time chat interface
- **EmergencyButton**: SOS trigger
- **FeedbackModal**: Rating & feedback form

---

## 🔄 Workflow Examples

### 1. Appointment Booking Flow:
1. Patient views available doctors
2. Selects doctor & time slot
3. Confirms appointment
4. Receives confirmation email/SMS
5. Reminder sent 24h before
6. Appointment completed → Prescription generated

### 2. Payment Flow:
1. Patient views bill
2. Clicks "Pay Now"
3. Redirected to payment gateway
4. Completes payment
5. Receives payment confirmation
6. Bill status updated to "Paid"

### 3. Chat Support Flow:
1. Patient clicks "Chat Support"
2. Connects to available agent
3. Real-time messaging via WebSocket
4. Chat history saved
5. Issue resolved → Chat closed

---

## 🚀 Next Steps

1. ✅ Create folder structure
2. ✅ Extend Prisma schema
3. ⏳ Build API routes & controllers
4. ⏳ Create UI components
5. ⏳ Implement state management
6. ⏳ Add payment gateway
7. ⏳ Set up WebSocket for chat
8. ⏳ Implement reminders
9. ⏳ Testing & validation

