# CI/CD Setup Guide for Hope Physicians

## 🚀 GitHub Actions + Firebase CI/CD Pipeline

This guide will help you set up automated deployment to Firebase using GitHub Actions.

---

## 📋 Prerequisites

1. **GitHub Repository:** [https://github.com/Nitinkumargits/Hope_Physicians.git](https://github.com/Nitinkumargits/Hope_Physicians.git)
2. **Firebase Project:** Created in Firebase Console
3. **Firebase CLI:** Installed locally (for initial setup)

---

## 🔧 Step 1: Get Firebase Service Account Key

### Option A: Using Firebase CLI (Recommended)

1. **Install Firebase CLI locally:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Generate service account key:**
   ```bash
   # List your projects
   firebase projects:list
   
   # Get service account (replace PROJECT_ID with your actual project ID)
   firebase projects:list --json | jq -r '.[] | select(.projectId == "PROJECT_ID") | .projectId'
   ```

### Option B: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file

**⚠️ Keep this file secure! Never commit it to Git.**

---

## 🔐 Step 2: Configure GitHub Secrets

Go to your GitHub repository: `https://github.com/Nitinkumargits/Hope_Physicians`

1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

### Required Secrets:

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | Firebase Console → Project Settings → General |
| `FIREBASE_SERVICE_ACCOUNT` | Service account JSON (entire file content) | Firebase Console → Project Settings → Service Accounts → Generate Key |
| `FIREBASE_TOKEN` | Firebase CLI token | Run `firebase login:ci` locally |
| `VITE_API_URL` | Production API URL | `https://us-central1-PROJECT_ID.cloudfunctions.net/api` |

### How to Get Firebase Token:

```bash
# Run this locally (requires Firebase CLI)
firebase login:ci

# This will output a token like:
# 1//0abc123def456...
# Copy this entire token
```

### Setting Up Secrets:

1. **FIREBASE_PROJECT_ID:**
   ```
   your-project-id-here
   ```

2. **FIREBASE_SERVICE_ACCOUNT:**
   - Open the downloaded JSON file
   - Copy the entire content (including `{` and `}`)
   - Paste as the secret value

3. **FIREBASE_TOKEN:**
   ```
   1//0abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567...
   ```

4. **VITE_API_URL:**
   ```
   https://us-central1-your-project-id.cloudfunctions.net/api
   ```
   Or if using rewrites:
   ```
   /api
   ```

---

## 📁 Step 3: Verify Workflow Files

The workflow files are already created in `.github/workflows/`:

- ✅ `firebase-deploy.yml` - Main deployment workflow
- ✅ `firebase-preview.yml` - Preview deployments for PRs

### Workflow Structure:

```
.github/
└── workflows/
    ├── firebase-deploy.yml      # Deploys on push to master/main
    └── firebase-preview.yml     # Creates preview for PRs
```

---

## 🎯 Step 4: Create firebase.json

Create `firebase.json` in the project root (if not exists):

```json
{
  "hosting": {
    "public": "frontend/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "backend/functions",
    "runtime": "nodejs18"
  }
}
```

---

## 🚀 Step 5: Initialize Firebase Functions (If Not Done)

If you haven't set up Cloud Functions yet:

```bash
cd backend
firebase init functions

# Select:
# - Use existing project
# - JavaScript
# - ESLint: Yes
# - Install dependencies: Yes
```

Then create `backend/functions/index.js` (see `backend/functions/index.js.example`).

---

## ✅ Step 6: Test the Workflow

### Manual Test:

1. **Push to master/main branch:**
   ```bash
   git add .
   git commit -m "Setup CI/CD"
   git push origin master
   ```

2. **Check GitHub Actions:**
   - Go to your repo: `https://github.com/Nitinkumargits/Hope_Physicians`
   - Click **Actions** tab
   - You should see the workflow running

3. **Monitor deployment:**
   - Watch the workflow logs
   - Check for any errors
   - Verify deployment success

### Workflow Triggers:

- ✅ **Push to master/main** → Full deployment
- ✅ **Pull Request** → Preview deployment
- ✅ **Manual trigger** → Via GitHub Actions UI

---

## 🔍 Step 7: Verify Deployment

After successful deployment:

1. **Check Firebase Hosting:**
   ```
   https://your-project-id.web.app
   ```

2. **Check Cloud Functions:**
   ```
   https://us-central1-your-project-id.cloudfunctions.net/api
   ```

3. **Test API:**
   ```bash
   curl https://us-central1-your-project-id.cloudfunctions.net/api
   ```

---

## 🛠️ Troubleshooting

### Issue: "Firebase project not found"

**Solution:**
- Verify `FIREBASE_PROJECT_ID` secret is correct
- Check project exists in Firebase Console
- Ensure you have access to the project

### Issue: "Service account authentication failed"

**Solution:**
- Verify `FIREBASE_SERVICE_ACCOUNT` contains valid JSON
- Ensure the service account has proper permissions
- Check the JSON is not corrupted (valid JSON format)

### Issue: "Functions deployment failed"

**Solution:**
- Ensure `backend/functions/index.js` exists
- Check `backend/functions/package.json` is valid
- Verify all dependencies are listed in `package.json`
- Check Prisma setup in functions directory

### Issue: "Hosting deployment failed"

**Solution:**
- Verify `frontend/dist` directory exists after build
- Check `firebase.json` configuration
- Ensure `public` path in `firebase.json` matches build output

### Issue: "Environment variables not found"

**Solution:**
- Verify `VITE_API_URL` secret is set
- Check the secret name matches exactly (case-sensitive)
- Ensure `.env.production` is created in workflow

---

## 📊 Workflow Details

### Main Deployment Workflow (`firebase-deploy.yml`)

**Jobs:**
1. **build-frontend** - Builds React/Vite frontend
2. **build-backend** - Prepares backend functions
3. **deploy** - Deploys to Firebase (only on master/main)

**Steps:**
- ✅ Checkout code
- ✅ Setup Node.js
- ✅ Install dependencies
- ✅ Build frontend
- ✅ Prepare backend
- ✅ Deploy to Firebase

### Preview Deployment Workflow (`firebase-preview.yml`)

**Purpose:** Creates preview deployments for pull requests

**Features:**
- ✅ Builds frontend
- ✅ Creates Firebase Hosting preview channel
- ✅ Comments PR with preview URL

---

## 🔄 Continuous Deployment Flow

```
Developer pushes to master/main
         ↓
GitHub Actions triggered
         ↓
Build Frontend (npm run build)
         ↓
Build Backend (prepare functions)
         ↓
Deploy to Firebase Hosting
         ↓
Deploy Cloud Functions
         ↓
✅ Live at your-project.web.app
```

---

## 📝 Environment-Specific Configuration

### Development
- Uses local backend: `http://localhost:5000/api`
- Local environment variables

### Production (CI/CD)
- Uses Cloud Functions: `https://us-central1-PROJECT_ID.cloudfunctions.net/api`
- Secrets from GitHub Secrets

---

## 🎯 Next Steps

1. ✅ Set up GitHub Secrets
2. ✅ Create `firebase.json`
3. ✅ Push to master/main to trigger deployment
4. ✅ Monitor first deployment
5. ✅ Set up custom domain (optional)
6. ✅ Configure preview deployments for PRs

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

## 🔒 Security Best Practices

1. ✅ **Never commit secrets** - Use GitHub Secrets
2. ✅ **Rotate tokens regularly** - Update `FIREBASE_TOKEN` periodically
3. ✅ **Limit service account permissions** - Only grant necessary permissions
4. ✅ **Review workflow logs** - Check for exposed secrets
5. ✅ **Use branch protection** - Require PR reviews before merging

---

**Last Updated:** December 2024  
**Repository:** [https://github.com/Nitinkumargits/Hope_Physicians.git](https://github.com/Nitinkumargits/Hope_Physicians.git)

