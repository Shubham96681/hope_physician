# How to Get Firebase Token

## 📍 Where to Run `firebase login:ci`

Run this command **locally on your computer** (not in GitHub Actions).

---

## ✅ Step-by-Step Instructions

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter
- OR open PowerShell
- OR use Git Bash

**Mac/Linux:**
- Open Terminal app
- OR press `Cmd + Space` (Mac) and type "Terminal"

### Step 2: Navigate to Your Project (Optional)

```bash
cd D:\19.infofit_Soft\0. info-project\Hope_Physicians
```

**Note:** You don't have to be in the project directory, but it's good practice.

### Step 3: Check if Firebase CLI is Installed

```bash
firebase --version
```

**If you see a version number** (like `13.0.0`), you're good to go! ✅

**If you get an error** like `'firebase' is not recognized`, install it:

```bash
npm install -g firebase-tools
```

Wait for installation to complete.

### Step 4: Run the Login Command

```bash
firebase login:ci
```

### Step 5: Authenticate

1. **A browser window will open automatically**
2. **Select your Google account** (the one you use for Firebase)
3. **Click "Allow"** to grant permissions
4. **The browser will show "Firebase CLI Login Successful"**

### Step 6: Copy the Token

After authentication, **the terminal will display a token** like:

```
✔  Success! Use this token to login on a CI server:

1//0abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz

Example: firebase deploy --token "$FIREBASE_TOKEN"
```

**Copy the ENTIRE token** (the long string starting with `1//`)

---

## 🔐 Step 7: Add Token to GitHub Secrets

1. Go to: **https://github.com/Nitinkumargits/Hope_Physicians/settings/secrets/actions**

2. Click **"New repository secret"**

3. **Name:** `FIREBASE_TOKEN`

4. **Value:** Paste the token you just copied

5. Click **"Add secret"**

---

## 🎯 Complete Example

Here's what the entire process looks like:

```bash
# 1. Open terminal/command prompt
# (Windows: cmd, PowerShell, or Git Bash)
# (Mac/Linux: Terminal)

# 2. Navigate to project (optional)
cd D:\19.infofit_Soft\0. info-project\Hope_Physicians

# 3. Check Firebase CLI
firebase --version
# Output: 13.0.0 (or similar)

# 4. Login
firebase login:ci

# 5. Browser opens → Select account → Allow

# 6. Terminal shows token:
# ✔  Success! Use this token to login on a CI server:
# 1//0abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567...

# 7. Copy the token and add to GitHub Secrets
```

---

## 🛠️ Troubleshooting

### Issue: "firebase: command not found"

**Solution:** Install Firebase CLI
```bash
npm install -g firebase-tools
```

**If npm is not found:**
- Install Node.js first: https://nodejs.org/
- Then install Firebase CLI

### Issue: Browser doesn't open

**Solution:** Use manual authentication
```bash
firebase login:ci --no-localhost
```

This will give you a URL to visit manually.

### Issue: "Permission denied" or "Access denied"

**Solution:**
- Make sure you're using the same Google account as your Firebase project
- Check that you have access to the `hope-physicians` project
- Try logging out and back in: `firebase logout` then `firebase login:ci`

### Issue: Token is too long / hard to copy

**Solution:**
- The token is intentionally long (100+ characters)
- Make sure you copy the ENTIRE token
- You can copy it in parts if needed, but paste it all together in GitHub

---

## ✅ Verification

After adding the token to GitHub Secrets:

1. Go to your repository: https://github.com/Nitinkumargits/Hope_Physicians
2. Click **Settings** → **Secrets and variables** → **Actions**
3. You should see `FIREBASE_TOKEN` in the list

---

## 🔄 Token Expiration

**Firebase tokens don't expire**, but it's good practice to:
- Rotate them periodically (every 90 days)
- Regenerate if you suspect it's compromised
- Use a new token if you get authentication errors

To get a new token, just run `firebase login:ci` again.

---

## 📝 Quick Reference

```bash
# Install Firebase CLI (if needed)
npm install -g firebase-tools

# Get token
firebase login:ci

# Copy the token output
# Add to GitHub Secrets as FIREBASE_TOKEN
```

---

**That's it!** Once you have the token and add it to GitHub Secrets, your CI/CD pipeline will be able to deploy to Firebase automatically.

