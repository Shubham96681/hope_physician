# Firebase Deployment Guide for Hope Physicians

## 🎯 Overview

This guide covers deploying Hope Physicians to Firebase:

- **Frontend (React/Vite)** → Firebase Hosting
- **Backend (Express.js)** → Cloud Functions for Firebase
- **Custom Domains & SSL** → Automatic via Firebase

---

## 📋 Prerequisites

1. **Firebase CLI installed:**

   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase account** (Spark plan is free and sufficient for development)

3. **Node.js** (v18 or higher for Cloud Functions)

---

## 🔧 Part 1: Setting Up Cloud Functions for Firebase

### Step 1: Initialize Firebase in Backend

```bash
cd backend
firebase init functions
```

**Select:**

- ✅ Use an existing project (or create new)
- ✅ JavaScript (or TypeScript if preferred)
- ✅ ESLint: Yes
- ✅ Install dependencies: Yes

### Step 2: Configure Cloud Functions Structure

Your backend structure should look like:

```
backend/
├── functions/
│   ├── index.js          # Main Cloud Functions entry
│   ├── package.json
│   ├── .env              # Environment variables
│   └── node_modules/
├── controllers/          # Keep existing controllers
├── routes/               # Keep existing routes
├── middlewares/          # Keep existing middlewares
└── prisma/              # Keep existing Prisma setup
```

### Step 3: Create Cloud Functions Wrapper

Create `backend/functions/index.js`:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin (for Firestore, Auth, etc.)
admin.initializeApp();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173", // Local dev
    "https://your-project.web.app", // Firebase Hosting
    "https://your-project.firebaseapp.com", // Firebase Hosting alt
    "https://yourdomain.com", // Custom domain
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Import your existing routes
const appointmentRoutes = require("../routes/appointmentRoutes");
const adminRoutes = require("../routes/adminRoutes");
const doctorRoutes = require("../routes/doctorRoutes");
const authRoutes = require("../routes/authRoutes");
const patientRoutes = require("../routes/patientRoutes");
const patientFormRoutes = require("../routes/patientFormRoutes");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/patient-forms", patientFormRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "HOPE PHYSICIAN API is running...",
    timestamp: new Date().toISOString(),
  });
});

// Export as Cloud Function
exports.api = functions.https.onRequest(app);
```

### Step 4: Update functions/package.json

```json
{
  "name": "functions",
  "description": "Hope Physicians Cloud Functions",
  "scripts": {
    "lint": "eslint .",
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "index.js",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^4.5.0",
    "express": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "@prisma/client": "^5.20.0",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^7.0.11"
  },
  "devDependencies": {
    "eslint": "^8.15.0",
    "eslint-config-google": "^0.14.0"
  },
  "private": true
}
```

### Step 5: Handle Environment Variables

**Option A: Firebase Functions Config (Recommended)**

```bash
# Set environment variables
firebase functions:config:set \
  jwt.secret="your-jwt-secret" \
  email.host="smtp.gmail.com" \
  email.port="587" \
  email.user="your-email@gmail.com" \
  email.pass="your-email-password"
```

Access in code:

```javascript
const functions = require("firebase-functions");
const jwtSecret = functions.config().jwt.secret;
```

**Option B: .env file (for local development)**

Create `backend/functions/.env`:

```
JWT_SECRET=your-jwt-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### Step 6: Update Prisma for Cloud Functions

Since Cloud Functions run in a serverless environment, you need to:

1. **Bundle Prisma Client:**

   ```bash
   cd functions
   npm install @prisma/client
   npx prisma generate
   ```

2. **Copy Prisma schema:**

   ```bash
   cp -r ../prisma ./prisma
   ```

3. **Update Prisma client initialization** in your controllers:
   ```javascript
   const { PrismaClient } = require("@prisma/client");
   const prisma = new PrismaClient({
     // For Cloud Functions, use the bundled client
   });
   ```

### Step 7: Deploy Cloud Functions

```bash
cd backend
firebase deploy --only functions
```

**Your API will be available at:**

```
https://us-central1-your-project-id.cloudfunctions.net/api
```

---

## 🌐 Part 2: Custom Domains & SSL Certificates

### Step 1: Add Custom Domain to Firebase Hosting

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `hopephysicians.com`)
4. Follow DNS configuration instructions

### Step 2: Configure DNS Records

Firebase will provide DNS records to add:

**For root domain:**

```
Type: A
Name: @
Value: [Firebase provided IP]
```

**For www subdomain:**

```
Type: CNAME
Name: www
Value: your-project.web.app
```

### Step 3: SSL Certificate (Automatic)

Firebase automatically provisions SSL certificates via Let's Encrypt:

- ✅ Automatic renewal
- ✅ HTTPS enforced
- ✅ Certificate ready in ~24 hours after DNS verification

### Step 4: Custom Domain for Cloud Functions

**Option A: Firebase Hosting Rewrites (Recommended)**

Add to `firebase.json`:

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ]
  }
}
```

This allows API calls to `/api/*` on your custom domain to route to Cloud Functions.

**Option B: Cloud Functions Custom Domain (Advanced)**

For dedicated API subdomain (e.g., `api.hopephysicians.com`):

1. Use Cloud Run (more complex setup)
2. Or use Firebase Hosting rewrites (simpler)

---

## 🚀 Part 3: Deploying React/Vite Frontend to Firebase Hosting

### Step 1: Initialize Firebase Hosting

```bash
cd frontend
firebase init hosting
```

**Select:**

- ✅ Use an existing project
- ✅ Public directory: `dist` (Vite's build output)
- ✅ Single-page app: Yes (configure as a single-page app)
- ✅ Set up automatic builds: No (for now)
- ✅ Overwrite index.html: No

### Step 2: Configure Vite Build

Update `frontend/vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable sourcemaps for production
  },
  // Base path if deploying to subdirectory
  // base: '/',
});
```

### Step 3: Create Environment Files

**Create `frontend/.env.production`:**

```
VITE_API_URL=https://us-central1-your-project-id.cloudfunctions.net/api
```

**Create `frontend/.env.local` (for local dev):**

```
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Update API Configuration

Your services already use `import.meta.env.VITE_API_URL`, so they'll automatically use the production URL when built.

**Optional: Create API config file** `frontend/src/config/api.js`:

```javascript
const getApiUrl = () => {
  // In production, use relative URLs if using Firebase Hosting rewrites
  if (import.meta.env.PROD) {
    // If using rewrites, use relative path
    return "/api";
    // OR use full Cloud Functions URL
    // return import.meta.env.VITE_API_URL;
  }
  // In development, use local backend
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
};

export const API_BASE = getApiUrl();
```

### Step 5: Create firebase.json

Create `firebase.json` in project root:

```json
{
  "hosting": {
    "public": "frontend/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
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
        "source": "**/*.@(js|css|jpg|jpeg|gif|png|svg|webp|woff|woff2|ttf|eot)",
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

### Step 6: Build and Deploy

```bash
# Build the frontend
cd frontend
npm run build

# Deploy everything
cd ..
firebase deploy
```

**Or deploy separately:**

```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy both
firebase deploy
```

---

## 🔑 Key Considerations for Cloud Functions + Firebase Hosting

### 1. CORS Configuration

Ensure your Cloud Functions allow requests from your Firebase Hosting domain:

```javascript
const corsOptions = {
  origin: [
    "https://your-project.web.app",
    "https://your-project.firebaseapp.com",
    "https://yourdomain.com",
    "http://localhost:5173", // Local dev
  ],
  credentials: true,
};
```

### 2. Environment Variables

- **Development:** Use `.env` files
- **Production:** Use `firebase functions:config:set`
- **Secrets:** Use Firebase Secret Manager for sensitive data

### 3. Cold Starts

Cloud Functions have cold start latency. Mitigate by:

- Using minimum instances (paid tier)
- Keeping functions warm with scheduled pings
- Optimizing function initialization

### 4. Function Timeout

Default timeout is 60 seconds. Increase if needed:

```javascript
exports.api = functions
  .runWith({ timeoutSeconds: 300, memory: "512MB" })
  .https.onRequest(app);
```

### 5. API Routing Strategy

**Option A: Single Function (Current Setup)**

- All routes in one function
- Simpler deployment
- Shared cold start

**Option B: Multiple Functions**

- Separate function per route group
- Better isolation
- More complex deployment

---

## 📝 Complete Deployment Checklist

### Pre-Deployment

- [ ] Firebase CLI installed
- [ ] Firebase project created
- [ ] Environment variables configured
- [ ] Prisma client bundled for Cloud Functions
- [ ] CORS configured correctly
- [ ] API URLs updated in frontend

### Backend Deployment

- [ ] Cloud Functions initialized
- [ ] Express app wrapped in Cloud Function
- [ ] Routes imported correctly
- [ ] Environment variables set
- [ ] Functions deployed successfully
- [ ] API endpoint tested

### Frontend Deployment

- [ ] Firebase Hosting initialized
- [ ] Vite build configured
- [ ] Production environment variables set
- [ ] Frontend built (`npm run build`)
- [ ] firebase.json configured
- [ ] Hosting deployed successfully
- [ ] Frontend accessible

### Domain & SSL

- [ ] Custom domain added to Firebase
- [ ] DNS records configured
- [ ] SSL certificate provisioned (automatic)
- [ ] Domain verified
- [ ] HTTPS working

### Post-Deployment

- [ ] API endpoints tested from production frontend
- [ ] Authentication working
- [ ] File uploads working (if using Storage)
- [ ] Real-time features working (if using Firestore)
- [ ] Error handling tested
- [ ] Performance monitored

---

## 🛠️ Troubleshooting

### Issue: CORS Errors

**Solution:** Update CORS origin in Cloud Functions to include your Firebase Hosting URL.

### Issue: API 404 Errors

**Solution:** Ensure Firebase Hosting rewrites are configured in `firebase.json`.

### Issue: Environment Variables Not Working

**Solution:** Use `firebase functions:config:get` to verify, or migrate to Secret Manager.

### Issue: Prisma Client Not Found

**Solution:** Ensure Prisma is bundled in `functions/` directory and `prisma generate` is run.

### Issue: Cold Start Latency

**Solution:** Consider using minimum instances or Cloud Run for better performance.

---

## 📊 Cost Considerations (Spark Plan)

**Free Tier Limits:**

- Hosting: 10 GB storage, 360 MB/day transfer
- Functions: 2 million invocations/month, 400,000 GB-seconds
- Storage: 5 GB storage, 1 GB/day download

**For Production:**

- Monitor usage in Firebase Console
- Upgrade to Blaze plan (pay-as-you-go) if needed
- Set up billing alerts

---

## 🤖 Part 4: CI/CD with GitHub Actions

### Overview

Automate your deployments using GitHub Actions. Every push to `master` or `main` will automatically deploy to Firebase.

### Step 1: Get Firebase Credentials

**Get Firebase Token:**

```bash
firebase login:ci
# Copy the output token
```

**Get Service Account:**

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file

### Step 2: Configure GitHub Secrets

Go to: `https://github.com/Nitinkumargits/Hope_Physicians/settings/secrets/actions`

Add these secrets:

| Secret                     | Value                                                   |
| -------------------------- | ------------------------------------------------------- |
| `FIREBASE_PROJECT_ID`      | Your Firebase project ID                                |
| `FIREBASE_SERVICE_ACCOUNT` | Entire content of service account JSON                  |
| `FIREBASE_TOKEN`           | Output from `firebase login:ci`                         |
| `VITE_API_URL`             | `https://us-central1-PROJECT_ID.cloudfunctions.net/api` |

### Step 3: Workflow Files

The CI/CD workflows are already set up in `.github/workflows/`:

- **`firebase-deploy.yml`** - Deploys on push to master/main
- **`firebase-preview.yml`** - Creates preview for pull requests

### Step 4: How It Works

**On Push to Master/Main:**

1. ✅ Builds frontend (`npm run build`)
2. ✅ Prepares backend functions
3. ✅ Deploys to Firebase Hosting
4. ✅ Deploys Cloud Functions

**On Pull Request:**

1. ✅ Builds frontend
2. ✅ Creates preview channel
3. ✅ Comments PR with preview URL

### Step 5: Test Deployment

```bash
git add .
git commit -m "Setup CI/CD"
git push origin master
```

Check deployment status:

- GitHub → Actions tab
- Firebase Console → Hosting

### Detailed Setup

See **`CI_CD_SETUP_GUIDE.md`** for complete CI/CD setup instructions.

---

## 🎯 Next Steps

1. **Set up CI/CD** (see `CI_CD_SETUP_GUIDE.md`)
2. **Set up Firebase Authentication** (replace JWT)
3. **Migrate to Firestore** (replace SQLite)
4. **Set up Firebase Storage** (for file uploads)
5. **Implement Cloud Messaging** (push notifications)
6. **Set up monitoring** (Firebase Performance, Crashlytics)

---

**Last Updated:** December 2024  
**Version:** 1.1.0 (Added CI/CD)
