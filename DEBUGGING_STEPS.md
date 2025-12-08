# Debugging Patient API 500 Errors

## Issue
Patient API endpoints returning 500 errors:
- `/api/patient/billing`
- `/api/patient/prescriptions`
- `/api/patient/reports`

## Steps to Debug

### 1. Check Backend Server Logs
Look at the backend console/terminal for error messages. The updated code now includes detailed logging:
- `🔐 Authenticated patient:` - Shows if authentication worked
- `📋 Get bills request` - Shows what `req.user` contains
- `❌ Patient ID missing` - Shows if patientId is missing

### 2. Verify Token Contains patientId
1. Open browser DevTools → Application → Local Storage
2. Copy the `token` value
3. Go to https://jwt.io
4. Paste the token
5. Check if `patientId` is in the decoded payload

**If patientId is NOT in token:**
- You're using an old token (before the fix)
- **Solution**: Clear localStorage and log in again

### 3. Clear Browser Storage and Re-login
```javascript
// In browser console:
localStorage.clear();
// Then refresh and log in again
```

### 4. Check Backend Server Status
Make sure the backend server was restarted after the code changes:
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd backend
npm start
# or
node server.js
```

### 5. Verify Patient User Exists
Check if the patient has a PortalUser record with patientId:
```sql
SELECT pu.*, p.id as patient_id 
FROM PortalUser pu
LEFT JOIN Patient p ON pu.patientId = p.id
WHERE pu.email = 'patient.john@example.com';
```

### 6. Check Server Console Output
After making a request, you should see:
```
🔐 Authenticated patient: userId=xxx, patientId=yyy
📋 Get bills request - req.user: { id: 'xxx', role: 'patient', patientId: 'yyy' }
```

If you see:
```
❌ Patient ID missing in request
```
Then the token doesn't have patientId and you need to re-login.

## Common Issues

### Issue 1: Old Token
**Symptom**: `req.user` exists but `patientId` is undefined
**Solution**: Clear localStorage and log in again

### Issue 2: Server Not Restarted
**Symptom**: Changes not taking effect
**Solution**: Restart backend server

### Issue 3: Patient Not Linked to PortalUser
**Symptom**: Patient exists but PortalUser.patientId is null
**Solution**: Update PortalUser record:
```sql
UPDATE PortalUser 
SET patientId = (SELECT id FROM Patient WHERE email = 'patient.john@example.com')
WHERE email = 'patient.john@example.com';
```

### Issue 4: JSON Parse Error
**Symptom**: Error parsing medications/items JSON
**Solution**: Fixed in latest code - handles null/undefined safely

## Quick Fix Checklist

- [ ] Backend server restarted
- [ ] Browser localStorage cleared
- [ ] User logged in again (to get new token)
- [ ] Check backend console for error messages
- [ ] Verify token contains patientId (jwt.io)
- [ ] Check database - PortalUser has patientId

## Expected Behavior After Fix

1. Login as patient → Token includes `patientId`
2. Make API request → Backend logs show `patientId` present
3. API returns 200 OK with data (or empty array if no data)

## If Still Getting 500 Errors

Check backend console for the actual error message. The updated code now logs:
- Authentication status
- What `req.user` contains
- Any database errors
- JSON parsing errors

Share the backend console output for further debugging.

