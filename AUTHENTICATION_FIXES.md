# Authentication & Patient API Fixes

## Issues Identified

### 1. **401 Unauthorized on Login**
- **Cause**: Login endpoint returning 401 (could be invalid credentials, inactive user, or role mismatch)
- **Status**: This is expected behavior for invalid credentials. Check user credentials and account status.

### 2. **500 Internal Server Error on Patient API Endpoints**
- **Root Cause**: JWT token was not including `patientId`, but patient controllers were trying to access `req.user.patientId`
- **Affected Endpoints**:
  - `/api/patient/prescriptions`
  - `/api/patient/billing`
  - `/api/patient/reports`
  - All other patient endpoints

## Fixes Applied

### 1. Updated JWT Token Generation (`backend/controllers/authController.js`)
**Problem**: JWT token only contained `id`, `email`, and `role` - missing role-specific IDs like `patientId`.

**Solution**: Include role-specific IDs in JWT token payload:
```javascript
// Before
const token = jwt.sign(
  { id: portalUser.id, email: portalUser.email, role: portalUser.role },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);

// After
const tokenPayload = {
  id: portalUser.id,
  email: portalUser.email,
  role: portalUser.role
};

// Add role-specific IDs
if (portalUser.doctorId) {
  tokenPayload.doctorId = userData.doctorId;
} else if (portalUser.patientId) {
  tokenPayload.patientId = portalUser.patientId;
} else if (portalUser.staffId) {
  tokenPayload.staffId = portalUser.staffId;
} else if (portalUser.employeeId) {
  tokenPayload.employeeId = portalUser.employeeId;
}

const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '8h' });
```

### 2. Enhanced Auth Middleware (`backend/middlewares/authMiddleware.js`)
**Problem**: If `patientId` was missing from token (old tokens), controllers would fail.

**Solution**: Added fallback to fetch `patientId` from database if missing from token:
```javascript
// If patientId is missing from token but role is patient, fetch it from database
if (decoded.role === 'patient' && !decoded.patientId) {
  const portalUser = await prisma.portalUser.findUnique({
    where: { id: decoded.id },
    select: { patientId: true }
  });
  if (portalUser?.patientId) {
    decoded.patientId = portalUser.patientId;
  }
}
```

### 3. Updated Patient Controllers
**Problem**: Controllers were using `req.user.patientId || req.user.id` which is incorrect (fallback to PortalUser ID instead of Patient ID).

**Solution**: Added validation to ensure `patientId` exists before proceeding:
```javascript
// Before
const patientId = req.user.patientId || req.user.id;

// After
const patientId = req.user.patientId;
if (!patientId) {
  return res.status(400).json({ error: 'Patient ID not found. Please log in again.' });
}
```

**Files Updated**:
- `backend/controllers/patient/prescriptionController.js`
- `backend/controllers/patient/billingController.js`
- `backend/controllers/patient/reportController.js`
- `backend/controllers/patient/appointmentController.js`

### 4. Created Patient Utility Helper (`backend/utils/patientUtils.js`)
Created reusable utility functions for patient ID validation:
```javascript
const { validatePatientId } = require('../utils/patientUtils');

const patientId = validatePatientId(req, res);
if (!patientId) return; // Error response already sent
```

## Testing Steps

### 1. Test Patient Login
1. Login as patient with valid credentials
2. Check browser DevTools → Application → Local Storage → `token`
3. Decode JWT token (use jwt.io) and verify `patientId` is present

### 2. Test Patient API Endpoints
After logging in as patient, test these endpoints:
- `GET /api/patient/prescriptions?page=1&limit=5`
- `GET /api/patient/billing?page=1&limit=10`
- `GET /api/patient/reports?page=1&limit=5`
- `GET /api/patient/appointments?page=1&limit=10`

All should return 200 OK with data, not 500 errors.

### 3. Test with Old Token
1. Use an old JWT token (before fix)
2. Make API request
3. Should still work (middleware fetches patientId from DB)

## Expected Behavior

### ✅ Success Cases
- Patient logs in → JWT token includes `patientId`
- Patient API calls work → Return 200 with data
- Old tokens still work → Middleware fetches `patientId` from DB

### ❌ Error Cases
- Missing `patientId` → Returns 400 with clear error message
- Invalid token → Returns 403
- No token → Returns 401

## Additional Notes

### For 401 Login Errors
If you're still getting 401 on login, check:
1. **User exists**: Verify patient email exists in `PortalUser` table
2. **Password correct**: Check password hash matches
3. **Account active**: Verify `isActive` and `canAccessSystem` are `true`
4. **Role match**: If role is specified in login, it must match `PortalUser.role`

### Database Check
Verify patient has PortalUser record:
```sql
SELECT pu.*, p.id as patient_id, p.firstName, p.lastName
FROM PortalUser pu
LEFT JOIN Patient p ON pu.patientId = p.id
WHERE pu.email = 'patient.john@example.com';
```

## Files Modified

1. `backend/controllers/authController.js` - JWT token generation
2. `backend/middlewares/authMiddleware.js` - Token verification with fallback
3. `backend/controllers/patient/prescriptionController.js` - Patient ID validation
4. `backend/controllers/patient/billingController.js` - Patient ID validation
5. `backend/controllers/patient/reportController.js` - Patient ID validation
6. `backend/controllers/patient/appointmentController.js` - Patient ID validation
7. `backend/utils/patientUtils.js` - New utility file (optional helper)

## Next Steps

1. **Restart Backend Server**: Changes require server restart
2. **Clear Browser Storage**: Clear localStorage tokens to get new tokens with `patientId`
3. **Test All Patient Endpoints**: Verify all patient API calls work
4. **Update Other Patient Controllers**: Apply same validation pattern to remaining controllers:
   - `admissionController.js`
   - `chatController.js`
   - `feedbackController.js`
   - `insuranceController.js`
   - `reminderController.js`
   - `paymentController.js`

## Summary

The main issue was that JWT tokens didn't include `patientId`, causing patient controllers to fail with 500 errors. The fix ensures:
1. ✅ `patientId` is included in JWT token for patient logins
2. ✅ Auth middleware fetches `patientId` if missing (backward compatibility)
3. ✅ Patient controllers validate `patientId` exists before proceeding
4. ✅ Clear error messages guide users to re-login if needed

