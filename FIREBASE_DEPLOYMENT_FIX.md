# 🔥 Firebase CI/CD Deployment Fix - Complete Solution

## ✔ Identify Root Cause(s)

The error **"Failed to get Firebase project. Please make sure the project exists and your account has permission to access it"** typically occurs due to:

### Root Causes:

1. **Service Account Not Authenticated Properly**
   - `GOOGLE_APPLICATION_CREDENTIALS` not set correctly
   - Service account JSON file not readable or invalid
   - Environment variable not propagated to all commands

2. **Missing Firebase-Specific Permissions**
   - Service account has Google Cloud IAM roles but not Firebase-specific roles
   - Firebase Admin SDK permissions not granted
   - Project-level Firebase access not configured

3. **Project ID Mismatch or Invalid**
   - Using project name instead of project ID
   - Project ID in JSON doesn't match `FIREBASE_PROJECT_ID` secret
   - Project doesn't exist or was deleted

4. **Firebase API Not Enabled**
   - Firebase API not enabled for the project
   - Billing not enabled (required for some Firebase features)

5. **Service Account Key Issues**
   - Key expired or was revoked
   - Key doesn't have access to the Firebase project
   - JSON format corrupted or incomplete

---

## ✔ Step-by-Step Fix + Validation Commands

### Step 1: Verify Project ID

**Get the correct Project ID:**
```bash
# Option A: Firebase Console
# Go to: https://console.firebase.google.com/
# Select project → ⚙️ Settings → Project Settings
# Check "Project ID" field (NOT "Project name")

# Option B: Using Firebase CLI (if authenticated)
firebase projects:list

# Option C: Extract from service account JSON
python3 -c "import json; print(json.load(open('service-account.json'))['project_id'])"
```

**Verify GitHub Secret:**
- Go to: https://github.com/Nitinkumargits/Hope_Physicians/settings/secrets/actions
- `FIREBASE_PROJECT_ID` should be exactly: `hope-physicians` (lowercase, no spaces)

### Step 2: Validate Service Account JSON

```bash
# Test JSON validity
python3 -m json.tool service-account.json > /dev/null && echo "✅ Valid JSON" || echo "❌ Invalid JSON"

# Extract and verify project_id
JSON_PROJECT_ID=$(python3 -c "import json; print(json.load(open('service-account.json'))['project_id'])")
echo "Project ID in JSON: $JSON_PROJECT_ID"
echo "Expected: hope-physicians"
[ "$JSON_PROJECT_ID" = "hope-physicians" ] && echo "✅ Match" || echo "❌ Mismatch"
```

### Step 3: Test Authentication Locally

```bash
# Set service account
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
chmod 600 "$GOOGLE_APPLICATION_CREDENTIALS"

# Test Firebase access
firebase projects:list --project "hope-physicians"

# Test project access
firebase use hope-physicians --non-interactive

# Test deployment (dry run)
firebase deploy --project "hope-physicians" --only hosting --dry-run
```

### Step 4: Verify IAM Permissions

```bash
# Using gcloud (if installed)
gcloud projects get-iam-policy hope-physicians \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:*@hope-physicians.iam.gserviceaccount.com" \
    --format="table(bindings.role)"
```

---

## ✔ Final Working Script for CI

### GitHub Actions Workflow (Complete Fix)

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [master, main]
  workflow_dispatch:

env:
  NODE_VERSION: "18"
  FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}

jobs:
  deploy:
    name: Deploy to Firebase
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Download frontend artifacts
        uses: actions/download-artifact@v4
        with:
          name: frontend-dist
          path: frontend/dist

      - name: Download backend artifacts
        uses: actions/download-artifact@v4
        with:
          name: backend-functions
          path: backend/functions
        continue-on-error: true

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Setup Firebase Service Account
        id: setup-service-account
        run: |
          set -e
          
          # Write service account JSON
          echo '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}' > /tmp/firebase-service-account.json
          chmod 600 /tmp/firebase-service-account.json
          
          # Validate JSON format
          if ! python3 -m json.tool /tmp/firebase-service-account.json > /dev/null 2>&1; then
            echo "❌ Error: Invalid JSON in FIREBASE_SERVICE_ACCOUNT secret"
            exit 1
          fi
          
          # Extract project_id from JSON
          JSON_PROJECT_ID=$(python3 -c "import json; print(json.load(open('/tmp/firebase-service-account.json'))['project_id'])")
          SECRET_PROJECT_ID="${{ secrets.FIREBASE_PROJECT_ID }}"
          
          # Validate project ID is set
          if [ -z "$SECRET_PROJECT_ID" ]; then
            echo "❌ Error: FIREBASE_PROJECT_ID secret is not set"
            exit 1
          fi
          
          # Verify project ID match
          if [ "$JSON_PROJECT_ID" != "$SECRET_PROJECT_ID" ]; then
            echo "❌ Error: Project ID mismatch!"
            echo "JSON project_id: $JSON_PROJECT_ID"
            echo "Secret project_id: $SECRET_PROJECT_ID"
            echo "These must match exactly!"
            exit 1
          fi
          
          echo "✅ Service account JSON is valid"
          echo "✅ Project ID verified: $JSON_PROJECT_ID"
          echo "project_id=$JSON_PROJECT_ID" >> $GITHUB_OUTPUT

      - name: Authenticate with Firebase
        env:
          GOOGLE_APPLICATION_CREDENTIALS: /tmp/firebase-service-account.json
        run: |
          set -e
          
          PROJECT_ID="${{ secrets.FIREBASE_PROJECT_ID }}"
          
          # Verify project access
          echo "🔍 Verifying Firebase project access..."
          if ! firebase projects:list --project "$PROJECT_ID" > /dev/null 2>&1; then
            echo "❌ Error: Cannot access Firebase project: $PROJECT_ID"
            echo ""
            echo "Troubleshooting steps:"
            echo "1. Verify project ID is correct: $PROJECT_ID"
            echo "2. Check service account has Firebase Admin permissions"
            echo "3. Ensure Firebase API is enabled for the project"
            echo "4. Verify service account JSON is valid"
            exit 1
          fi
          
          # Create .firebaserc
          echo "{\"projects\":{\"default\":\"$PROJECT_ID\"}}" > .firebaserc
          
          # Verify firebase.json exists
          if [ ! -f firebase.json ]; then
            echo "❌ Error: firebase.json not found!"
            exit 1
          fi
          
          echo "✅ Firebase authentication successful"
          echo "✅ Project access verified: $PROJECT_ID"

      - name: Install backend functions dependencies
        run: |
          if [ -d "backend/functions" ]; then
            echo "📦 Installing backend functions dependencies..."
            cd backend/functions
            npm ci || {
              echo "⚠️ Warning: npm ci failed, trying npm install"
              npm install
            }
            # Generate Prisma client if needed
            if [ -d "prisma" ]; then
              npx prisma generate || echo "⚠️ Warning: Prisma generate failed"
            fi
          else
            echo "ℹ️ backend/functions directory not found - skipping"
          fi

      - name: Deploy to Firebase
        env:
          GOOGLE_APPLICATION_CREDENTIALS: /tmp/firebase-service-account.json
        run: |
          set -e
          
          PROJECT_ID="${{ secrets.FIREBASE_PROJECT_ID }}"
          DEPLOY_SUCCESS=false
          
          # Determine what to deploy
          if [ -d "backend/functions" ] && [ -f "backend/functions/index.js" ]; then
            echo "🚀 Deploying hosting and functions..."
            if firebase deploy \
              --project "$PROJECT_ID" \
              --non-interactive \
              --only hosting,functions; then
              DEPLOY_SUCCESS=true
            else
              echo "❌ Deployment failed for hosting and functions"
              exit 1
            fi
          else
            echo "🚀 Deploying hosting only (functions not found or not configured)..."
            if firebase deploy \
              --project "$PROJECT_ID" \
              --non-interactive \
              --only hosting; then
              DEPLOY_SUCCESS=true
            else
              echo "❌ Deployment failed for hosting"
              exit 1
            fi
          fi
          
          if [ "$DEPLOY_SUCCESS" = true ]; then
            echo "✅ Deployment successful!"
            echo "Frontend: https://$PROJECT_ID.web.app"
            echo "API: https://us-central1-$PROJECT_ID.cloudfunctions.net/api"
          fi

      - name: Cleanup
        if: always()
        run: |
          rm -f /tmp/firebase-service-account.json
          echo "✅ Cleanup complete"
```

### Standalone Bash Script

Save as `deploy-firebase-ci.sh`:

```bash
#!/bin/bash
set -e

# Configuration
FIREBASE_PROJECT_ID="${FIREBASE_PROJECT_ID:-hope-physicians}"
SERVICE_ACCOUNT_JSON="${FIREBASE_SERVICE_ACCOUNT_JSON:-/tmp/firebase-service-account.json}"
DEPLOY_SUCCESS=false

echo "🚀 Firebase CI Deployment Script"
echo "Project ID: $FIREBASE_PROJECT_ID"
echo "=================================="

# Step 1: Validate service account JSON exists
if [ ! -f "$SERVICE_ACCOUNT_JSON" ]; then
    echo "❌ Error: Service account JSON not found at: $SERVICE_ACCOUNT_JSON"
    echo "Set FIREBASE_SERVICE_ACCOUNT_JSON environment variable"
    exit 1
fi

# Step 2: Validate JSON format
if ! python3 -m json.tool "$SERVICE_ACCOUNT_JSON" > /dev/null 2>&1; then
    echo "❌ Error: Invalid JSON in service account file"
    exit 1
fi

# Step 3: Extract project_id from JSON and verify match
JSON_PROJECT_ID=$(python3 -c "import json; print(json.load(open('$SERVICE_ACCOUNT_JSON'))['project_id'])")
if [ "$JSON_PROJECT_ID" != "$FIREBASE_PROJECT_ID" ]; then
    echo "❌ Error: Project ID mismatch!"
    echo "JSON project_id: $JSON_PROJECT_ID"
    echo "Expected project_id: $FIREBASE_PROJECT_ID"
    exit 1
fi

echo "✅ Service account JSON is valid"
echo "✅ Project ID matches: $JSON_PROJECT_ID"

# Step 4: Set authentication
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_JSON"
chmod 600 "$SERVICE_ACCOUNT_JSON"

# Step 5: Verify Firebase access
echo "🔍 Verifying Firebase project access..."
if ! firebase projects:list --project "$FIREBASE_PROJECT_ID" > /dev/null 2>&1; then
    echo "❌ Error: Cannot access Firebase project: $FIREBASE_PROJECT_ID"
    echo ""
    echo "Troubleshooting:"
    echo "1. Verify project ID: $FIREBASE_PROJECT_ID"
    echo "2. Check service account has Firebase Admin permissions"
    echo "3. Ensure Firebase API is enabled"
    exit 1
fi

# Step 6: Create .firebaserc
echo "{\"projects\":{\"default\":\"$FIREBASE_PROJECT_ID\"}}" > .firebaserc
echo "✅ Created .firebaserc"

# Step 7: Verify firebase.json exists
if [ ! -f firebase.json ]; then
    echo "❌ Error: firebase.json not found!"
    exit 1
fi
echo "✅ firebase.json found"

# Step 8: Deploy with proper error handling
echo "🚀 Starting deployment..."

if [ -d "backend/functions" ] && [ -f "backend/functions/index.js" ]; then
    echo "📦 Deploying hosting and functions..."
    if firebase deploy \
        --project "$FIREBASE_PROJECT_ID" \
        --non-interactive \
        --only hosting,functions; then
        DEPLOY_SUCCESS=true
    else
        echo "❌ Deployment failed for hosting and functions"
        exit 1
    fi
else
    echo "📦 Deploying hosting only..."
    if firebase deploy \
        --project "$FIREBASE_PROJECT_ID" \
        --non-interactive \
        --only hosting; then
        DEPLOY_SUCCESS=true
    else
        echo "❌ Deployment failed for hosting"
        exit 1
    fi
fi

# Step 9: Success message
if [ "$DEPLOY_SUCCESS" = true ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "Frontend: https://$FIREBASE_PROJECT_ID.web.app"
    echo "API: https://us-central1-$FIREBASE_PROJECT_ID.cloudfunctions.net/api"
fi
```

---

## ✔ IAM Roles Required

### Required Firebase Roles (Choose One):

**Option 1: Firebase Admin (Recommended - Simplest)**
- Role: `roles/firebase.admin`
- Includes: All Firebase permissions (Hosting, Functions, Firestore, etc.)

**Option 2: Individual Roles (More Granular)**
- `roles/firebase.adminsdk.adminServiceAgent` - Firebase Admin SDK access
- `roles/firebasehosting.admin` - Firebase Hosting admin
- `roles/cloudfunctions.admin` - Cloud Functions admin
- `roles/firestore.admin` - Firestore admin (if using)
- `roles/iam.serviceAccountUser` - Service account user

### How to Assign Roles:

1. **Via Google Cloud Console:**
   ```
   https://console.cloud.google.com/iam-admin/iam?project=hope-physicians
   ```
   - Find your service account
   - Click ✏️ Edit
   - Click "+ ADD ANOTHER ROLE"
   - Add `Firebase Admin` role
   - Click SAVE

2. **Via Firebase Console:**
   ```
   https://console.firebase.google.com/project/hope-physicians/settings/serviceaccounts/adminsdk
   ```
   - Service accounts here automatically have Firebase Admin permissions

3. **Via gcloud CLI:**
   ```bash
   gcloud projects add-iam-policy-binding hope-physicians \
       --member="serviceAccount:YOUR_SERVICE_ACCOUNT@hope-physicians.iam.gserviceaccount.com" \
       --role="roles/firebase.admin"
   ```

---

## ✔ Quick Debug Checklist

### Pre-Deployment Checklist:

- [ ] **Project ID Verification**
  - [ ] `FIREBASE_PROJECT_ID` secret = exact project ID (e.g., `hope-physicians`)
  - [ ] Project ID in service account JSON matches secret
  - [ ] Project exists in Firebase Console

- [ ] **Service Account JSON**
  - [ ] Valid JSON format (starts with `{`, ends with `}`)
  - [ ] Contains `project_id` field matching `FIREBASE_PROJECT_ID`
  - [ ] Contains `private_key` field (complete key)
  - [ ] Contains `client_email` field
  - [ ] Key is not expired or revoked

- [ ] **IAM Permissions**
  - [ ] Service account has `Firebase Admin` role OR
  - [ ] Service account has `Firebase Admin SDK Administrator Service Agent` role
  - [ ] Service account has `Cloud Functions Admin` (if deploying functions)
  - [ ] Service account has `Firebase Hosting Admin` (if deploying hosting)

- [ ] **Firebase API**
  - [ ] Firebase API enabled for the project
  - [ ] Billing enabled (if required)

- [ ] **Configuration Files**
  - [ ] `firebase.json` exists in repository root
  - [ ] `.firebaserc` will be created or exists
  - [ ] `frontend/dist` directory exists (for hosting)
  - [ ] `backend/functions/index.js` exists (if deploying functions)

### Test Commands:

```bash
# 1. Validate JSON
python3 -m json.tool service-account.json

# 2. Extract project_id
python3 -c "import json; print(json.load(open('service-account.json'))['project_id'])"

# 3. Test authentication
export GOOGLE_APPLICATION_CREDENTIALS="service-account.json"
firebase projects:list --project "hope-physicians"

# 4. Test project access
firebase use hope-physicians --non-interactive

# 5. Test deployment (dry run)
firebase deploy --project "hope-physicians" --only hosting --dry-run

# 6. Full deployment test
firebase deploy --project "hope-physicians" --non-interactive --only hosting
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "Failed to get Firebase project"
**Solution:**
- Verify project ID is correct (not project name)
- Check service account has Firebase Admin role
- Ensure Firebase API is enabled

### Issue 2: "Permission denied"
**Solution:**
- Add `Firebase Admin` role to service account
- Verify service account email matches JSON
- Check project-level permissions

### Issue 3: "Project not found"
**Solution:**
- Verify project ID spelling (case-sensitive)
- Check project exists in Firebase Console
- Ensure you're using project ID, not display name

### Issue 4: "Invalid service account"
**Solution:**
- Regenerate service account key
- Verify JSON is complete (not truncated)
- Check JSON format is valid

---

**Last Updated:** December 2024

