# CI/CD Quick Start - Hope Physicians

## ⚡ 5-Minute Setup

### Step 1: Get Firebase Token
```bash
firebase login:ci
# Copy the token output
```

### Step 2: Get Service Account
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → Service Accounts
3. Generate New Private Key
4. Download JSON file

### Step 3: Add GitHub Secrets

Go to: `https://github.com/Nitinkumargits/Hope_Physicians/settings/secrets/actions`

Add these 4 secrets:

```
FIREBASE_PROJECT_ID = your-project-id
FIREBASE_SERVICE_ACCOUNT = {paste entire JSON content}
FIREBASE_TOKEN = {paste token from step 1}
VITE_API_URL = https://us-central1-your-project-id.cloudfunctions.net/api
```

### Step 4: Push to Deploy

```bash
git add .
git commit -m "Setup CI/CD"
git push origin master
```

### Step 5: Check Status

- GitHub Actions: `https://github.com/Nitinkumargits/Hope_Physicians/actions`
- Firebase Hosting: `https://your-project-id.web.app`

---

## ✅ That's It!

Your next push to `master` will automatically deploy to Firebase.

---

**Need help?** See `CI_CD_SETUP_GUIDE.md` for detailed instructions.

