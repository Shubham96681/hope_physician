# Quick Start: Deploy Hope Physicians to Firebase

## 🚀 Fast Track Deployment (15 minutes)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize Firebase Project
```bash
# In project root
firebase init

# Select:
# - ✅ Functions
# - ✅ Hosting
# - Create new project (or use existing)
# - JavaScript for Functions
# - ESLint: Yes
# - Install dependencies: Yes
# - Public directory: frontend/dist
# - Single-page app: Yes
# - Overwrite index.html: No
```

### Step 3: Set Up Backend (Cloud Functions)

```bash
cd backend

# Create functions directory structure
mkdir -p functions
cp -r routes functions/
cp -r controllers functions/
cp -r middlewares functions/
cp -r prisma functions/
cp -r config functions/

# Install dependencies in functions
cd functions
npm init -y
npm install firebase-functions firebase-admin express cors dotenv
npm install @prisma/client bcryptjs jsonwebtoken nodemailer
npm install --save-dev prisma

# Generate Prisma client
npx prisma generate

# Copy the example index.js
# (See backend/functions/index.js.example)
```

### Step 4: Configure Environment Variables

```bash
# Set Firebase Functions config
firebase functions:config:set \
  jwt.secret="your-secret-here" \
  email.host="smtp.gmail.com" \
  email.port="587" \
  email.user="your-email@gmail.com" \
  email.pass="your-password"
```

### Step 5: Set Up Frontend

```bash
cd frontend

# Create production environment file
echo "VITE_API_URL=https://us-central1-your-project-id.cloudfunctions.net/api" > .env.production

# Build frontend
npm run build
```

### Step 6: Configure firebase.json

Copy `firebase.json.example` to `firebase.json` and update:
- Replace `your-project-id` with your actual Firebase project ID
- Verify paths are correct

### Step 7: Deploy

```bash
# From project root
firebase deploy
```

### Step 8: Test

1. Visit your Firebase Hosting URL: `https://your-project.web.app`
2. Test API: `https://us-central1-your-project-id.cloudfunctions.net/api`

---

## 🔧 Custom Domain Setup (After Initial Deployment)

### 1. Add Domain in Firebase Console
- Go to Firebase Console → Hosting
- Click "Add custom domain"
- Enter your domain

### 2. Configure DNS
Add the DNS records Firebase provides:
- A record for root domain
- CNAME for www subdomain

### 3. Wait for SSL
- SSL certificate auto-provisions (24-48 hours)
- Firebase will notify when ready

### 4. Update CORS
Update `backend/functions/index.js` with your custom domain:
```javascript
origin: [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
]
```

### 5. Redeploy
```bash
firebase deploy --only functions
```

---

## 📝 Common Issues & Fixes

### Issue: "Functions directory not found"
**Fix:** Ensure `backend/functions/index.js` exists

### Issue: CORS errors
**Fix:** Add your domain to CORS origins in `functions/index.js`

### Issue: API returns 404
**Fix:** Check `firebase.json` rewrites configuration

### Issue: Prisma client not found
**Fix:** Run `npx prisma generate` in `backend/functions/`

### Issue: Environment variables undefined
**Fix:** Use `firebase functions:config:get` to verify, or use Secret Manager

---

## 🎯 Next Steps

1. ✅ Test all API endpoints
2. ✅ Test authentication flow
3. ✅ Set up Firebase Authentication (replace JWT)
4. ✅ Migrate to Firestore (replace SQLite)
5. ✅ Set up Firebase Storage for file uploads
6. ✅ Configure monitoring and alerts

---

**Need Help?** Check `FIREBASE_DEPLOYMENT_GUIDE.md` for detailed instructions.

