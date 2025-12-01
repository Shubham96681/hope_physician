# 🔐 Portal Login Credentials

## Quick Reference - All User Accounts

### 👨‍💼 ADMIN
```
Email:    admin@hopephysicians.com
Password: admin123
Role:     admin
Route:    /admin
```

### 👨‍⚕️ DOCTOR
```
Email:    doctor@hopephysicians.com
Password: doctor123
Role:     doctor
Route:    /doctor
```

### 👤 PATIENT
```
Email:    patient@example.com
Password: patient123
Role:     patient
Route:    /patient
```

### 👥 STAFF
```
Email:    staff@hopephysicians.com
Password: staff123
Role:     staff
Route:    /staff
```

---

## 📋 Login Instructions

1. Navigate to: `http://localhost:5173/portal/login`
2. **Select your role** from the 4 options (Patient, Doctor, Admin, Staff)
3. Choose login method: **User Credentials**
4. Enter your **email** and **password** (see credentials above)
5. Click **Login**
6. You'll be automatically redirected to your role-specific dashboard

---

## 🎯 What Each Role Can Access

### Admin Dashboard (`/admin`)
- ✅ View all KPIs and statistics
- ✅ Manage employees (add, edit, delete)
- ✅ View all patients and their KYC status
- ✅ Manage doctors and their schedules
- ✅ Review and approve/reject KYC documents
- ✅ View attendance records
- ✅ Send notifications
- ✅ System settings

### Doctor Dashboard (`/doctor`)
- ✅ View today's appointments
- ✅ Manage appointments (accept/decline)
- ✅ Access patient profiles and medical history
- ✅ View appointment calendar
- ✅ Receive notifications

### Patient Dashboard (`/patient`)
- ✅ View upcoming appointments
- ✅ Book new appointments
- ✅ View appointment history
- ✅ Manage profile
- ✅ Upload KYC documents (drag & drop)
- ✅ View notifications

### Staff Dashboard (`/staff`)
- ✅ Check-in/Check-out for attendance
- ✅ View today's tasks
- ✅ Assist with KYC uploads
- ✅ View notifications

---

## 🚀 Quick Start

```bash
# Install dependencies (if not already done)
cd frontend
npm install

# Start development server
npm run dev

# Open browser to
http://localhost:5173/portal/login
```

---

## 🔄 Testing Different Roles

To test different roles:
1. Logout from current account (click profile → Logout)
2. Return to login page
3. Select different role
4. Use corresponding credentials

---

## ⚠️ Important Notes

- All accounts are **active** and have **system access enabled**
- Mock data is used when API is unavailable
- In production, these would connect to your actual backend
- Passwords are case-sensitive
- Email addresses must match exactly

---

## 🆘 Troubleshooting

**Can't login?**
- Verify email and password are correct
- Ensure role selection matches the account type
- Check browser console for errors
- Try clearing browser cache

**Wrong dashboard?**
- Logout and login again
- Verify role selection matches credentials
- Check that account is active

**Styling issues?**
- Ensure Tailwind CSS is installed: `npm install -D tailwindcss postcss autoprefixer`
- Check that `@tailwind` directives are in `index.css`
- Restart dev server

---

## 📞 Support

For login issues or account problems, contact:
- **Phone:** 252-522-3663
- **Email:** support@hopephysicians.com

