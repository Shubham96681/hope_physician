# 🔍 Check Backend Console Logs

## Critical: You MUST Check Backend Server Console

The 500 errors indicate the backend is throwing an exception. **Check your backend server console/terminal** to see the actual error message.

## What to Look For

When you make a request to `/api/patient/billing`, you should see logs like:

### ✅ Expected Output (Success):
```
🔐 Authenticated patient: userId=abc123, patientId=xyz789
📋 Get bills request - req.user: { id: 'abc123', role: 'patient', patientId: 'xyz789' }
```

### ❌ Error Output (Failure):
You'll see one of these:

1. **Import Error:**
```
❌ Error loading Prisma client in billingController: Cannot find module '../../src/lib/prisma.js'
```

2. **PatientId Missing:**
```
❌ Patient ID missing in request: { user: { id: '...', role: 'patient' } }
```

3. **Database Error:**
```
Get bills error: PrismaClientKnownRequestError: ...
```

4. **Other Error:**
```
Get bills error: [actual error message]
```

## Quick Fixes Based on Error Type

### If you see "Cannot find module":
The import path might be wrong. Try using absolute path or check file structure.

### If you see "Patient ID missing":
1. Clear browser localStorage
2. Log in again to get new token with `patientId`

### If you see database errors:
1. Check if database file exists: `backend/prisma/hope_physicians.db`
2. Run migrations: `cd backend && npx prisma migrate dev`
3. Check database connection

### If you see other errors:
Share the **exact error message** from backend console.

## Steps to Debug

1. **Open backend terminal/console** where server is running
2. **Make a request** (refresh patient dashboard)
3. **Copy the error message** from backend console
4. **Share it** so we can fix the specific issue

## Common Issues

### Server Not Restarted
- **Symptom**: Changes not taking effect
- **Fix**: Stop server (Ctrl+C) and restart

### Old Token
- **Symptom**: `patientId` is undefined
- **Fix**: Clear localStorage and log in again

### Database Not Connected
- **Symptom**: Prisma connection errors
- **Fix**: Check database file exists and migrations are run

## Next Steps

**Please check your backend console and share the error message you see!**

The frontend errors don't tell us what's wrong - we need the backend error to fix it.

