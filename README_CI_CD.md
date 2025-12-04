# CI/CD Documentation - Hope Physicians

## 📚 Documentation Files

### Quick Start
- **`CI_CD_QUICK_START.md`** - 5-minute setup guide

### Detailed Guides
- **`CI_CD_SETUP_GUIDE.md`** - Complete CI/CD setup instructions
- **`FIREBASE_DEPLOYMENT_GUIDE.md`** - Full Firebase deployment guide (includes CI/CD section)

### Workflow Files
- **`.github/workflows/firebase-deploy.yml`** - Main deployment workflow
- **`.github/workflows/firebase-preview.yml`** - Preview deployment for PRs

---

## 🚀 Quick Reference

### Repository
- **GitHub:** [https://github.com/Nitinkumargits/Hope_Physicians.git](https://github.com/Nitinkumargits/Hope_Physicians.git)

### Required GitHub Secrets
1. `FIREBASE_PROJECT_ID`
2. `FIREBASE_SERVICE_ACCOUNT`
3. `FIREBASE_TOKEN`
4. `VITE_API_URL`

### Deployment Triggers
- ✅ Push to `master` or `main` → Full deployment
- ✅ Pull Request → Preview deployment
- ✅ Manual trigger → Via GitHub Actions UI

### Deployment URLs
- **Frontend:** `https://PROJECT_ID.web.app`
- **API:** `https://us-central1-PROJECT_ID.cloudfunctions.net/api`

---

## 📖 Getting Started

1. Read **`CI_CD_QUICK_START.md`** for fast setup
2. Follow **`CI_CD_SETUP_GUIDE.md`** for detailed instructions
3. Check **`FIREBASE_DEPLOYMENT_GUIDE.md`** for complete deployment guide

---

**Last Updated:** December 2024

