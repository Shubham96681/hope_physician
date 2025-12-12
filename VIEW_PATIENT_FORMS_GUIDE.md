# 📋 How to View Submitted Patient Forms

## ✅ Where to View Forms

### **Admin Dashboard**

1. **Login as Admin:**

   - Go to: `http://52.66.236.157/portal/login`
   - Email: `admin@hopephysicians.com`
   - Password: `admin123`

2. **Navigate to Patient Forms:**

   - Click **"Patient Forms"** in the sidebar
   - Or go directly to: `http://52.66.236.157/admin/patient-forms`

3. **View All Submissions:**
   - See all submitted forms
   - Filter by form type
   - Search by patient name or email
   - Click "View Details" to see full form data

## 📋 What You'll See

### Form List View:

- **Form Type** (Patient Information, Privacy Acknowledgement, etc.)
- **Patient Name**
- **Email Address**
- **Phone Number**
- **Submission Date**
- **View Details** button

### Form Details View:

- **Complete form data:**
  - Patient Information (name, DOB, address, etc.)
  - Contact Information (phone, email)
  - Emergency Contact
  - Insurance Information
  - Signature and Date
  - All other form fields

## 🔍 Filtering Options

### By Form Type:

- All Forms
- Patient Information
- Privacy Acknowledgement
- Parental Consent
- Release of Information

### By Search:

- Search by patient name
- Search by email address

## 📊 Statistics

The page shows:

- **Total Submissions** - All forms submitted
- **Patient Information** - Count of patient info forms
- **Privacy Forms** - Count of privacy forms
- **Other Forms** - Count of other form types

## 🔗 Direct Links

**Admin View:**

- URL: `http://52.66.236.157/admin/patient-forms`
- Access: Admin role required

**API Endpoint:**

- `GET /api/patient-forms/all` - Get all submissions
- `GET /api/patient-forms/patient/:patientId` - Get submissions for specific patient

## 📝 Form Types Available

1. **Patient Information** (`patient_info`)

   - Complete patient demographics
   - Contact information
   - Insurance details
   - Emergency contacts

2. **Privacy Acknowledgement** (`privacy_ack`)

   - Privacy practices acknowledgement
   - Signature and date

3. **Parental Consent** (`parental_consent`)

   - Parent/guardian consent
   - Patient information
   - Signature

4. **Release of Information** (`release_info`)
   - Authorization to release medical records
   - Patient information
   - Signature

## ✅ Features

- ✅ View all submitted forms
- ✅ Filter by form type
- ✅ Search by patient name/email
- ✅ View complete form details
- ✅ See submission dates
- ✅ Statistics dashboard

---

**Location:** Admin Dashboard → Patient Forms
**URL:** `/admin/patient-forms`
