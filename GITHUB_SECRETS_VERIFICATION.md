# GitHub Secrets Verification Checklist

## 🔐 Required Secrets for Firebase Deployment

Your GitHub Actions workflow requires these secrets to be set correctly.

---

## ✅ Step-by-Step Verification

### 1. Access GitHub Secrets

Go to: **https://github.com/Nitinkumargits/Hope_Physicians/settings/secrets/actions**

Or navigate:
- Repository → **Settings** → **Secrets and variables** → **Actions**

---

## 📋 Required Secrets Checklist

### Secret 1: `FIREBASE_PROJECT_ID`

**Required Value:**
```
hope-physicians
```

**Verification:**
- [ ] Secret exists in GitHub Secrets
- [ ] Value is exactly: `hope-physicians` (lowercase, with hyphen)
- [ ] No extra spaces before or after
- [ ] No quotes around the value
- [ ] Matches your Firebase project ID exactly

**How to Verify Project ID:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click gear icon → Project Settings
4. Check "Project ID" field

---

### Secret 2: `FIREBASE_SERVICE_ACCOUNT`

**Required Value:**
Complete JSON content from your Firebase service account file.

**Format:**
```json
{
  "type": "service_account",
  "project_id": "hope-physicians",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@hope-physicians.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "...",
  "universe_domain": "googleapis.com"
}
```

**Verification:**
- [ ] Secret exists in GitHub Secrets
- [ ] Value starts with `{` and ends with `}`
- [ ] Contains `"project_id": "hope-physicians"` (must match!)
- [ ] Contains `"private_key"` field with complete key
- [ ] Contains `"client_email"` field
- [ ] No extra formatting or line breaks added
- [ ] JSON is valid (can be validated with JSON validator)

**How to Get/Regenerate:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **hope-physicians**
3. Click gear icon → **Project Settings** → **Service Accounts** tab
4. Click **"Generate New Private Key"**
5. Download the JSON file
6. Open the file and copy **ENTIRE** content (from `{` to `}`)
7. Paste into GitHub Secret `FIREBASE_SERVICE_ACCOUNT`

**⚠️ Important:**
- If you see the old service account (`firebase-adminsdk-fbsvc@...`), it was disabled by Google
- You MUST generate a new service account key
- Update the GitHub Secret with the new JSON

---

### Secret 3: `FIREBASE_TOKEN` (Optional - Can be removed)

**Status:** Deprecated - Not needed if using service account authentication

**Action:**
- [ ] Can be removed (workflow uses service account now)
- [ ] Or keep it if you want fallback authentication

---

### Secret 4: `VITE_API_URL`

**Required Value:**
```
https://us-central1-hope-physicians.cloudfunctions.net/api
```

**Verification:**
- [ ] Secret exists in GitHub Secrets
- [ ] Value matches the format above
- [ ] Project ID in URL matches: `hope-physicians`

---

## 🔍 Verify Service Account Permissions

After setting `FIREBASE_SERVICE_ACCOUNT`, verify the service account has proper permissions:

### Required Roles:
1. **Firebase Admin SDK Administrator Service Agent**
   - Role: `roles/firebase.adminsdk.adminServiceAgent`

2. **Cloud Functions Admin**
   - Role: `roles/cloudfunctions.admin`

3. **Firebase Hosting Admin**
   - Role: `roles/firebasehosting.admin`

### How to Check/Set Permissions:

1. Go to [Google Cloud Console - IAM](https://console.cloud.google.com/iam-admin/iam?project=hope-physicians)
2. Find your service account (email from the JSON file)
3. Check the **Roles** column
4. If missing roles, click **pencil icon** → **"+ ADD ANOTHER ROLE"**
5. Add the required roles listed above

---

## ✅ Complete Verification Checklist

### GitHub Secrets:
- [ ] `FIREBASE_PROJECT_ID` = `hope-physicians` (exact match)
- [ ] `FIREBASE_SERVICE_ACCOUNT` = Complete valid JSON
- [ ] JSON contains `"project_id": "hope-physicians"`
- [ ] `VITE_API_URL` = `https://us-central1-hope-physicians.cloudfunctions.net/api`

### Service Account:
- [ ] Service account exists in Firebase Console
- [ ] Service account has Firebase Admin SDK Administrator Service Agent role
- [ ] Service account has Cloud Functions Admin role
- [ ] Service account has Firebase Hosting Admin role
- [ ] Service account JSON matches the one in GitHub Secrets

### Project:
- [ ] Project `hope-physicians` exists in Firebase Console
- [ ] You have access to the project
- [ ] Project ID matches exactly: `hope-physicians`

---

## 🧪 Test Locally (Optional)

You can test the service account locally before deploying:

```bash
# Set service account
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"

# Test Firebase access
firebase projects:list
firebase use hope-physicians

# Should work without errors
```

---

## 🚨 Common Issues & Fixes

### Issue: "Invalid project selection"
**Causes:**
- Project ID mismatch
- Service account doesn't have access
- Service account JSON is invalid

**Fix:**
1. Verify `FIREBASE_PROJECT_ID` = `hope-physicians`
2. Check service account JSON has `"project_id": "hope-physicians"`
3. Verify service account has required roles
4. Regenerate service account if needed

### Issue: "Permission denied"
**Causes:**
- Service account missing required roles
- Service account disabled

**Fix:**
1. Add required roles in Google Cloud Console
2. Generate new service account if disabled
3. Update GitHub Secret with new JSON

### Issue: "Invalid JSON"
**Causes:**
- Malformed JSON in GitHub Secret
- Extra characters or formatting

**Fix:**
1. Copy JSON directly from downloaded file
2. Don't add extra formatting
3. Ensure it starts with `{` and ends with `}`

---

## 📝 Quick Reference

### Exact Values Needed:

| Secret Name | Value |
|------------|-------|
| `FIREBASE_PROJECT_ID` | `hope-physicians` |
| `FIREBASE_SERVICE_ACCOUNT` | (Complete JSON from downloaded file) |
| `VITE_API_URL` | `https://us-central1-hope-physicians.cloudfunctions.net/api` |

### Links:
- [GitHub Secrets](https://github.com/Nitinkumargits/Hope_Physicians/settings/secrets/actions)
- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud IAM](https://console.cloud.google.com/iam-admin/iam?project=hope-physicians)
- [GitHub Actions](https://github.com/Nitinkumargits/Hope_Physicians/actions)

---

**After verifying all secrets, push to master to trigger deployment!**

