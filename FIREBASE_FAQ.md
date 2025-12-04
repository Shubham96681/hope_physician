# Firebase Integration FAQ - Hope Physicians

## ❓ Your Questions Answered

---

## 1. What are the key considerations for setting up Cloud Functions for Firebase to work seamlessly with a Firebase-hosted React frontend?

### ✅ Key Considerations:

#### A. **CORS Configuration**
Your Cloud Functions must allow requests from your Firebase Hosting domain:

```javascript
// backend/functions/index.js
const corsOptions = {
  origin: [
    'https://your-project.web.app',           // Firebase Hosting
    'https://your-project.firebaseapp.com',   // Firebase Hosting alt
    'https://yourdomain.com',                 // Custom domain
    'http://localhost:5173',                  // Local dev
  ],
  credentials: true,
};
```

**Why:** Browsers block cross-origin requests unless explicitly allowed.

#### B. **API URL Configuration**
Your React app needs to know where to send API requests:

**Option 1: Direct Cloud Functions URL (Current Setup)**
```javascript
// frontend/.env.production
VITE_API_URL=https://us-central1-your-project-id.cloudfunctions.net/api
```

**Option 2: Relative URLs via Rewrites (Recommended)**
```javascript
// frontend/.env.production
VITE_API_URL=/api  // Uses Firebase Hosting rewrites
```

**Why:** Rewrites allow `/api/*` on your domain to route to Cloud Functions automatically.

#### C. **Firebase Hosting Rewrites**
Configure `firebase.json` to route API calls:

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"  // Your Cloud Function name
      },
      {
        "source": "**",
        "destination": "/index.html"  // SPA fallback
      }
    ]
  }
}
```

**Why:** This makes API calls appear to come from the same domain, avoiding CORS issues.

#### D. **Environment Variables**
Use Firebase Functions config for production:

```bash
firebase functions:config:set jwt.secret="your-secret"
```

Access in code:
```javascript
const functions = require('firebase-functions');
const jwtSecret = functions.config().jwt.secret;
```

**Why:** Secure way to store secrets without committing to git.

#### E. **Function Timeout & Memory**
Configure based on your needs:

```javascript
exports.api = functions
  .runWith({
    timeoutSeconds: 300,  // 5 minutes max
    memory: '512MB',      // Adjust based on usage
  })
  .https.onRequest(app);
```

**Why:** Default timeout is 60s, which may not be enough for complex operations.

#### F. **Cold Start Mitigation**
Cloud Functions have cold start latency (1-3 seconds):

**Solutions:**
- Use minimum instances (paid tier): `minInstances: 1`
- Keep functions warm with scheduled pings
- Optimize initialization code

#### G. **Error Handling**
Implement proper error handling:

```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});
```

**Why:** Prevents function crashes and provides useful error messages.

---

## 2. How would I handle custom domains and SSL certificates for both Firebase Hosting and a Cloud Functions backend?

### ✅ Custom Domain Setup:

#### A. **Firebase Hosting Custom Domain**

**Step 1: Add Domain in Firebase Console**
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `hopephysicians.com`)
4. Firebase will provide DNS records

**Step 2: Configure DNS Records**

Firebase provides two options:

**Option 1: A Record (Root Domain)**
```
Type: A
Name: @
Value: [Firebase provided IP addresses - usually 2-4 IPs]
TTL: 3600
```

**Option 2: CNAME (Subdomain)**
```
Type: CNAME
Name: www
Value: your-project.web.app
TTL: 3600
```

**Step 3: Verify Domain**
- Firebase automatically verifies DNS
- Usually takes 5-30 minutes
- You'll receive email confirmation

#### B. **SSL Certificate (Automatic)**

✅ **Firebase automatically provisions SSL certificates via Let's Encrypt:**

- **Provisioning Time:** 24-48 hours after DNS verification
- **Renewal:** Automatic (no action needed)
- **Coverage:** Both root domain and www subdomain
- **HTTPS:** Automatically enforced

**No manual configuration needed!** Firebase handles everything.

#### C. **Custom Domain for API (Cloud Functions)**

You have two options:

**Option 1: Firebase Hosting Rewrites (Recommended - Easiest)**

Use the same domain with path-based routing:

```json
// firebase.json
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

**Result:** 
- Frontend: `https://hopephysicians.com`
- API: `https://hopephysicians.com/api/*`

**Benefits:**
- ✅ Same domain = No CORS issues
- ✅ Single SSL certificate
- ✅ Simple configuration
- ✅ Free on Spark plan

**Option 2: API Subdomain (Advanced)**

For dedicated API subdomain (e.g., `api.hopephysicians.com`):

1. **Use Cloud Run** (more complex):
   - Deploy function to Cloud Run
   - Configure custom domain in Cloud Run
   - Requires separate SSL setup

2. **Or use Firebase Hosting rewrites with subdomain:**
   - Create subdomain in Firebase Hosting
   - Use rewrites to route to functions
   - Simpler but still uses same domain

**Recommendation:** Use Option 1 (rewrites) for simplicity.

#### D. **Complete Custom Domain Example**

**Domain Structure:**
```
hopephysicians.com          → Frontend (Firebase Hosting)
www.hopephysicians.com      → Frontend (Firebase Hosting)
hopephysicians.com/api/*    → Backend (Cloud Functions via rewrites)
```

**DNS Configuration:**
```
A     @                    → [Firebase IPs]
CNAME www                  → your-project.web.app
```

**CORS Configuration:**
```javascript
origin: [
  'https://hopephysicians.com',
  'https://www.hopephysicians.com',
]
```

**Result:**
- ✅ Single SSL certificate covers everything
- ✅ No CORS issues
- ✅ Clean URLs
- ✅ Automatic HTTPS

---

## 3. What are the deployment steps for getting my React/Vite frontend onto Firebase Hosting?

### ✅ Step-by-Step Deployment:

#### **Step 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

#### **Step 2: Initialize Firebase Hosting**
```bash
cd frontend
firebase init hosting
```

**Select:**
- ✅ Use an existing project (or create new)
- ✅ Public directory: `dist` (Vite's build output)
- ✅ Single-page app: **Yes** (important for React Router)
- ✅ Set up automatic builds: No (for manual deployment)
- ✅ Overwrite index.html: **No** (keep Vite's index.html)

#### **Step 3: Configure Vite Build**

Your `vite.config.js` is already set up correctly. Just ensure:

```javascript
export default defineConfig({
  build: {
    outDir: 'dist',  // This matches Firebase Hosting public directory
  },
})
```

#### **Step 4: Create Production Environment File**

Create `frontend/.env.production`:

```bash
# Option 1: Direct Cloud Functions URL
VITE_API_URL=https://us-central1-your-project-id.cloudfunctions.net/api

# Option 2: Relative URL (if using rewrites)
VITE_API_URL=/api
```

#### **Step 5: Build Frontend**

```bash
cd frontend
npm run build
```

This creates `frontend/dist/` with production-ready files.

#### **Step 6: Configure firebase.json**

Create or update `firebase.json` in project root:

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
  }
}
```

**Key Points:**
- `public`: Points to Vite's build output
- `rewrites`: Routes API calls to Cloud Functions
- `destination: /index.html`: SPA fallback for React Router
- `headers`: Cache static assets for performance

#### **Step 7: Deploy**

**Option A: Deploy Only Hosting**
```bash
firebase deploy --only hosting
```

**Option B: Deploy Everything**
```bash
firebase deploy
```

#### **Step 8: Verify Deployment**

1. **Visit your site:**
   ```
   https://your-project.web.app
   ```

2. **Test API connection:**
   - Open browser DevTools → Network tab
   - Make an API call from your app
   - Verify request goes to correct endpoint

3. **Test routing:**
   - Navigate to different pages
   - Verify React Router works (no 404s)

#### **Step 9: Set Up Custom Domain (Optional)**

1. Firebase Console → Hosting → Add custom domain
2. Configure DNS records
3. Wait for SSL (24-48 hours)
4. Update CORS in Cloud Functions
5. Redeploy functions: `firebase deploy --only functions`

---

## 🎯 Quick Reference: Deployment Commands

```bash
# Build frontend
cd frontend && npm run build

# Deploy hosting only
firebase deploy --only hosting

# Deploy functions only
firebase deploy --only functions

# Deploy everything
firebase deploy

# View deployment logs
firebase hosting:channel:list
```

---

## 📋 Pre-Deployment Checklist

- [ ] Firebase CLI installed and logged in
- [ ] Firebase project created
- [ ] Frontend built successfully (`npm run build`)
- [ ] `firebase.json` configured correctly
- [ ] Environment variables set (`.env.production`)
- [ ] API URLs configured correctly
- [ ] CORS configured in Cloud Functions
- [ ] Cloud Functions deployed and tested
- [ ] Custom domain DNS configured (if using)
- [ ] SSL certificate provisioned (automatic, wait 24-48h)

---

## 🚨 Common Deployment Issues

### Issue: "Public directory not found"
**Fix:** Ensure `frontend/dist` exists (run `npm run build` first)

### Issue: "404 on page refresh"
**Fix:** Ensure SPA rewrite is configured: `"destination": "/index.html"`

### Issue: "API calls fail"
**Fix:** 
1. Check CORS configuration
2. Verify API URL in `.env.production`
3. Check Firebase Hosting rewrites

### Issue: "Environment variables not working"
**Fix:** Ensure variables start with `VITE_` prefix for Vite

---

## 📚 Additional Resources

- **Detailed Guide:** See `FIREBASE_DEPLOYMENT_GUIDE.md`
- **Quick Start:** See `DEPLOYMENT_QUICK_START.md`
- **Project Details:** See `PROJECT_DETAILS_FOR_FIREBASE.md`

---

**Last Updated:** December 2024

