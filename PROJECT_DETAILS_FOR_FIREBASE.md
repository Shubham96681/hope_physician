# Hope Physicians - Project Details for Firebase Integration

## 📋 Project Overview

**Project Name:** Hope Physicians  
**Type:** Healthcare Management System / Medical Practice Portal  
**Purpose:** A comprehensive healthcare management platform for managing doctors, patients, appointments, employee attendance, KYC documents, and patient forms.

---

## 🏗️ Architecture

### Current Stack

**Backend:**
- **Runtime:** Node.js with Express.js (v5.1.0)
- **Database:** SQLite (via Prisma ORM)
- **ORM:** Prisma (v5.20.0)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer
- **Port:** 5000 (default)

**Frontend:**
- **Framework:** React (v19.2.0) with Vite (v7.2.4)
- **Routing:** React Router DOM (v7.9.6)
- **Styling:** Tailwind CSS (v3.4.0)
- **HTTP Client:** Axios (v1.13.2)
- **Notifications:** React Hot Toast (v2.6.0)
- **Icons:** React Icons (v5.5.0)
- **Port:** 5173 (default Vite dev server)

---

## 🗄️ Database Structure (Prisma Schema)

### Core Models

#### 1. **PortalUser** (Authentication & Authorization)
- Central user authentication model
- Roles: `admin`, `doctor`, `patient`, `staff`, `hr`
- Links to specific user types (Employee, Doctor, Patient, Staff)
- Fields: `id`, `email`, `passwordHash`, `role`, `isActive`, `canAccessSystem`

#### 2. **Employee**
- General employee management
- Fields: `empId`, `firstName`, `lastName`, `email`, `phone`, `designation`, `department`, `status`
- Status: `working`, `not_working`

#### 3. **Doctor**
- Doctor-specific information
- Fields: `empId`, `firstName`, `lastName`, `email`, `specialization`, `licenseNumber`, `yearsOfExperience`, `bio`, `isAvailable`
- Linked to appointments

#### 4. **Staff**
- Staff member management
- Fields: `empId`, `firstName`, `lastName`, `email`, `designation`, `department`
- Linked to tasks and attendance

#### 5. **Patient**
- Patient information and management
- Fields: `firstName`, `lastName`, `email`, `phone`, `dateOfBirth`, `gender`, `address`, `insuranceProvider`, `kycStatus`
- KYC Status: `pending`, `submitted`, `under_review`, `approved`, `rejected`
- Linked to appointments, KYC documents, and form submissions

#### 6. **Appointment**
- Appointment scheduling and management
- Fields: `patientId`, `doctorId`, `date`, `time`, `type`, `status`, `notes`, `department`
- Status: `scheduled`, `confirmed`, `in_progress`, `completed`, `cancelled`, `rescheduled`

#### 7. **Attendance**
- Employee/staff attendance tracking
- Fields: `employeeId`, `staffId`, `checkInTime`, `checkInPhoto`, `checkInLocation`, `checkOutTime`, `checkOutPhoto`, `checkOutLocation`, `workingHours`, `status`
- Status: `present`, `absent`, `late`, `half_day`

#### 8. **KYCDocument**
- Patient KYC document management
- Fields: `patientId`, `salarySlip1-3`, `cancelledCheque`, `passbook`, `aadhaarFront/Back`, `educationalDoc1-3`, `status`, `reviewedBy`, `reviewedAt`, `rejectionRemarks`
- Status: `pending`, `submitted`, `under_review`, `approved`, `rejected`

#### 9. **PatientFormSubmission**
- Patient form submissions (Patient Info, Privacy Acknowledgement, Parental Consent, Release of Information)
- Fields: Extensive form fields including patient info, signatures, dates, consent details
- Form Types: `patient_info`, `privacy_ack`, `parental_consent`, `release_info`

#### 10. **CalendarEvent**
- Calendar and event management
- Fields: `title`, `description`, `startDate`, `endDate`, `location`, `eventType`, `status`, `assignedToAll`, `createdBy`
- Event Types: `meeting`, `training`, `holiday`, `event`, `reminder`, `other`
- Status: `upcoming`, `active`, `completed`, `cancelled`

#### 11. **Notification**
- System notifications
- Fields: `title`, `message`, `type`, `priority`, `status`, `employeeId`, `doctorId`, `patientId`, `staffId`, `allEmployees`
- Types: `appointment`, `kyc`, `task`, `event`, `system`, `general`
- Priority: `low`, `medium`, `high`, `urgent`
- Status: `unread`, `read`, `archived`

#### 12. **Task**
- Staff task management
- Fields: `staffId`, `title`, `description`, `status`, `priority`, `dueDate`, `completedAt`
- Status: `pending`, `in_progress`, `completed`, `cancelled`
- Priority: `low`, `medium`, `high`, `urgent`

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- User login
- User registration
- Token verification

### Appointment Routes (`/api/appointments`)
- Create appointment
- Get appointments
- Update appointment
- Delete appointment

### Admin Routes (`/api/admin`)
- Admin dashboard data
- User management
- System settings

### Doctor Routes (`/api/doctor`)
- Doctor profile
- Today's appointments
- Patient list
- Patient profile

### Patient Routes (`/api/patients`)
- Patient registration
- Patient profile
- Patient list

### Patient Form Routes (`/api/patient-forms`)
- Submit patient information form
- Submit privacy acknowledgement
- Submit parental consent
- Submit release of information
- Get form submissions

---

## 🔐 Authentication System

**Current Implementation:**
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected routes via middleware

**User Roles:**
1. **Admin** - Full system access
2. **Doctor** - Access to appointments, patients, dashboard
3. **Patient** - Access to own profile, appointments, forms
4. **Staff** - Access to tasks, attendance, assigned events
5. **HR** - Employee management access

---

## 🎯 Key Features

### 1. **Doctor Dashboard**
- View today's appointments
- Patient management
- Appointment scheduling
- Profile management

### 2. **Patient Portal**
- Patient registration
- Appointment booking
- Form submissions (Patient Info, Privacy, Consent, Release)
- KYC document upload
- View appointment history

### 3. **Admin Dashboard**
- User management (Doctors, Patients, Staff, Employees)
- Appointment management
- KYC document review
- Attendance tracking
- Calendar event management
- Notification management
- Reports and analytics

### 4. **Staff Portal**
- Task management
- Attendance check-in/check-out
- Calendar events
- Notifications

### 5. **Employee Management**
- Employee registration
- Attendance tracking
- Calendar event assignments
- Department management

---

## 📊 Data Flow

```
Database (SQLite/Prisma)
    ↓
Backend API (Express.js)
    ↓
Frontend Service Layer (Axios)
    ↓
React Components
    ↓
UI Display
```

**Example Flow:**
1. Database query via Prisma
2. Backend controller processes request
3. Returns JSON response
4. Frontend service makes HTTP request
5. Component receives data and updates state
6. UI re-renders with new data

---

## 🔥 Firebase Integration Requirements

### What Needs to be Integrated:

#### 1. **Authentication (Firebase Auth)**
- Replace current JWT system with Firebase Authentication
- Support email/password, Google Sign-In, Phone Auth
- Migrate existing users to Firebase Auth
- Maintain role-based access control

#### 2. **Database (Firestore)**
- Migrate from SQLite to Firestore
- Convert Prisma models to Firestore collections
- Set up Firestore security rules
- Implement real-time listeners for live updates

#### 3. **File Storage (Firebase Storage)**
- Store KYC documents (salary slips, Aadhaar, educational docs)
- Store profile images (doctors, patients)
- Store attendance photos (check-in/check-out)
- Store form attachments

#### 4. **Cloud Functions (Optional)**
- Automated notifications
- Email sending via Firebase
- Scheduled tasks (appointment reminders)
- Data validation and processing

#### 5. **Hosting (Firebase Hosting)**
- Deploy frontend React app
- Configure custom domain
- SSL certificates

#### 6. **Cloud Messaging (FCM)**
- Push notifications for appointments
- KYC status updates
- Task assignments
- Event reminders

---

## 📁 Project Structure

```
Hope_Physicians/
├── backend/
│   ├── controllers/        # Request handlers
│   ├── routes/            # API routes
│   ├── middlewares/       # Auth, error handling
│   ├── prisma/           # Database schema & migrations
│   │   ├── schema.prisma # Database models
│   │   └── migrations/   # Database migrations
│   ├── services/         # Business logic (TypeScript)
│   ├── config/           # Database, mailer config
│   └── server.js         # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin pages
│   │   │   ├── doctor/   # Doctor pages
│   │   │   ├── patient/  # Patient pages
│   │   │   └── staff/    # Staff pages
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API service layer
│   │   ├── contexts/     # React contexts (Auth, Alert)
│   │   └── routes/       # Routing configuration
│   └── public/           # Static assets
│
└── DATA_FLOW_DIAGRAM.md  # Data flow documentation
```

---

## 🔧 Environment Variables Needed

### Backend (.env)
```
PORT=5000
DATABASE_URL="file:./prisma/hope_physicians.db"
JWT_SECRET="your-jwt-secret"
NODE_ENV="development"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-email-password"
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Firebase Configuration (To be added)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 📝 Migration Strategy

### Phase 1: Authentication Migration
1. Set up Firebase Authentication
2. Create Firebase Auth service in frontend
3. Update backend to verify Firebase tokens
4. Migrate existing users to Firebase Auth
5. Update all protected routes

### Phase 2: Database Migration
1. Set up Firestore database
2. Create Firestore collections matching Prisma models
3. Write migration scripts to transfer data
4. Update all Prisma queries to Firestore queries
5. Set up Firestore security rules

### Phase 3: Storage Migration
1. Set up Firebase Storage
2. Create storage service for file uploads
3. Migrate existing files to Firebase Storage
4. Update all file references

### Phase 4: Real-time Features
1. Implement Firestore real-time listeners
2. Add push notifications (FCM)
3. Update UI for real-time updates

### Phase 5: Deployment
1. Deploy backend to Firebase Functions or alternative
2. Deploy frontend to Firebase Hosting
3. Configure custom domain
4. Set up production environment variables

---

## 🎨 UI/UX Features

- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Modern UI:** Clean, professional healthcare interface
- **Real-time Updates:** Live appointment and notification updates
- **Form Management:** Comprehensive patient form system
- **Dashboard Analytics:** Stats cards, charts, and reports
- **Role-based Views:** Different interfaces for different user types

---

## 📊 Current Data Models Summary

| Model | Primary Use | Key Relationships |
|-------|------------|-------------------|
| PortalUser | Authentication | Links to Employee/Doctor/Patient/Staff |
| Employee | Employee Management | PortalUser, Attendance, CalendarEvents |
| Doctor | Doctor Management | PortalUser, Appointments, CalendarEvents |
| Staff | Staff Management | PortalUser, Tasks, Attendance |
| Patient | Patient Management | PortalUser, Appointments, KYC, Forms |
| Appointment | Scheduling | Patient, Doctor |
| Attendance | Time Tracking | Employee, Staff |
| KYCDocument | Document Management | Patient |
| PatientFormSubmission | Form Data | Patient |
| CalendarEvent | Event Management | Employee, Doctor, Staff |
| Notification | Notifications | Employee, Doctor, Patient, Staff |
| Task | Task Management | Staff |

---

## 🚀 Next Steps for Firebase Integration

1. **Create Firebase Project**
   - Go to Firebase Console
   - Create new project: "Hope Physicians"
   - Enable Authentication, Firestore, Storage, Hosting

2. **Set Up Authentication**
   - Enable Email/Password provider
   - Enable Google Sign-In (optional)
   - Configure authorized domains

3. **Set Up Firestore**
   - Create collections matching Prisma models
   - Set up indexes for queries
   - Configure security rules

4. **Set Up Storage**
   - Create storage buckets
   - Set up folder structure (kyc-docs/, profile-images/, attendance-photos/)
   - Configure storage rules

5. **Install Firebase SDK**
   - `npm install firebase` in frontend
   - `npm install firebase-admin` in backend

6. **Update Code**
   - Replace Prisma with Firestore queries
   - Replace JWT auth with Firebase Auth
   - Update file uploads to use Firebase Storage

---

## 📞 Support Information

**Project Location:** `D:\19.infofit_Soft\0. info-project\Hope_Physicians`  
**Backend Port:** 5000  
**Frontend Port:** 5173  
**Database:** SQLite (currently) → Firestore (target)

---

**Last Updated:** December 2024  
**Version:** 1.0.0

