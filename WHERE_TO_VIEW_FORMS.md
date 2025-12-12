# 📋 Where to View Submitted Patient Forms

## ✅ Quick Answer

**Admin Dashboard → Patient Forms**

**Direct URL:** `http://52.66.236.157/admin/patient-forms`

## 🚀 How to Access

### Step 1: Login as Admin

1. Go to: `http://52.66.236.157/portal/login`
2. Select role: **Admin**
3. Email: `admin@hopephysicians.com`
4. Password: `admin123`
5. Click **Login**

### Step 2: Navigate to Patient Forms

**Option A: Via Sidebar**

- After login, you'll see the Admin Dashboard
- In the left sidebar, click **"Patient Forms"**
- (It's between "Patients" and "Doctors")

**Option B: Direct URL**

- Go to: `http://52.66.236.157/admin/patient-forms`

## 📋 What You'll See

### Dashboard View:

- **Statistics Cards:**
  - Total Submissions
  - Patient Information forms count
  - Privacy forms count
  - Other forms count

### Form List:

- All submitted forms displayed in cards
- Each card shows:
  - Form Type (badge)
  - Patient Name
  - Email Address
  - Phone Number
  - Submission Date
  - "View Details" button

### Filter Options:

- **Filter by Form Type:**

  - All Forms
  - Patient Information
  - Privacy Acknowledgement
  - Parental Consent
  - Release of Information

- **Search:**
  - Search by patient name
  - Search by email address

### Form Details Modal:

When you click "View Details", you'll see:

- Complete form data
- All fields filled by patient
- Submission date and time
- Patient information
- Insurance details
- Signature information

## 📝 Form Types You Can View

1. **Patient Information Form**

   - Patient demographics
   - Contact information
   - Address details
   - Emergency contacts
   - Insurance information
   - Signature and date

2. **Privacy Acknowledgement**

   - Privacy practices acknowledgement
   - Signature and date

3. **Parental Consent**

   - Parent/guardian consent
   - Patient information
   - Signature

4. **Release of Information**
   - Authorization to release records
   - Patient information
   - Signature

## 🔍 Features

- ✅ View all submitted forms
- ✅ Filter by form type
- ✅ Search by patient name/email
- ✅ View complete form details
- ✅ See submission dates
- ✅ Statistics dashboard
- ✅ Responsive design

## 📊 API Endpoints

**For Developers:**

- `GET /api/patient-forms/all` - Get all submissions (Admin/Staff only)
- `GET /api/patient-forms/patient/:patientId` - Get submissions for specific patient

**Authentication Required:**

- Both endpoints require admin or staff role
- Token must be included in Authorization header

## ✅ Summary

**Where:** Admin Dashboard → Patient Forms  
**URL:** `/admin/patient-forms`  
**Access:** Admin or Staff role required  
**Features:** View, filter, search, and view details of all submitted forms

---

**Status:** ✅ Ready to use
**After deployment:** Login as admin → Click "Patient Forms" in sidebar
