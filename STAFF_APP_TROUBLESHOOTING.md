# 🔧 Staff App Troubleshooting Guide

## Common Errors & Solutions

### Error 1: "Network Error" or "Cannot connect to server"

**Symptoms:**
- App shows "Network Error"
- Cannot login or register
- Products don't load

**Solutions:**

1. **Check Backend is Running**
   ```bash
   # In Backend folder
   npm run dev
   ```
   Should see: "Server running on port 5000"

2. **Check API URL**
   - Open `staff-frontend/services/api.ts`
   - Verify API_URL matches your backend IP
   - Current: `http://192.168.31.48:5000/api`

3. **Check Network Connection**
   - Make sure your phone/emulator is on the same network
   - Try accessing `http://192.168.31.48:5000/health` in browser

4. **Update API URL if needed**
   ```typescript
   // staff-frontend/services/api.ts
   const API_URL = 'http://YOUR_IP:5000/api';
   ```

---

### Error 2: "Expo Go" or Metro Bundler Issues

**Symptoms:**
- App won't start
- Metro bundler errors
- "Unable to resolve module"

**Solutions:**

1. **Clear Cache and Restart**
   ```bash
   cd staff-frontend
   npm start -- --clear
   ```

2. **Reinstall Dependencies**
   ```bash
   cd staff-frontend
   rm -rf node_modules
   npm install
   npm start
   ```

3. **Check Expo Version**
   ```bash
   npx expo --version
   ```
   Should be compatible with package.json

---

### Error 3: "Invalid Credentials" on Login

**Symptoms:**
- Login fails with "Invalid credentials"
- User exists but can't login

**Solutions:**

1. **Check User Exists in Database**
   - Login to admin panel
   - Go to Users page
   - Verify user is listed

2. **Check User is Active**
   - In Users page, check Status column
   - Should show "Active" (green)

3. **Reset Password (Admin)**
   - Admin can update user password
   - Or delete and recreate user

4. **Try Self-Registration**
   - Click "Sign Up" in app
   - Create new account
   - Should work immediately

---

### Error 4: "Token Expired" or "Not Authorized"

**Symptoms:**
- Logged in but API calls fail
- "Not authorized to access this route"

**Solutions:**

1. **Logout and Login Again**
   - Go to Profile tab
   - Click Logout
   - Login again

2. **Clear App Data**
   ```bash
   # In Expo Go
   - Shake device
   - Click "Clear AsyncStorage"
   - Restart app
   ```

3. **Check Token Expiration**
   - Backend JWT expires after 7 days
   - Check `Backend/.env` → JWT_EXPIRE

---

### Error 5: Products Not Loading

**Symptoms:**
- Products screen shows "No Products Found"
- Empty list

**Solutions:**

1. **Seed Database**
   ```bash
   cd Backend
   npm run seed
   ```

2. **Check Backend Logs**
   - Look for errors in backend console
   - Should see "GET /api/products"

3. **Check Network**
   - Pull down to refresh
   - Check if backend is running

---

### Error 6: "Cannot read property 'name' of null"

**Symptoms:**
- App crashes on Home screen
- User data not loading

**Solutions:**

1. **Check AuthContext**
   - User might not be loaded yet
   - Add loading state check

2. **Logout and Login**
   - Clear cached user data
   - Login again

3. **Check API Response**
   - Verify `/api/auth/me` returns user data
   - Check backend logs

---

### Error 7: Bottom Tabs Not Showing

**Symptoms:**
- Navigation bar missing
- Can't switch between screens

**Solutions:**

1. **Check Tab Layout**
   - File: `staff-frontend/app/(tabs)/_layout.tsx`
   - Should have 3 tabs: index, products, profile

2. **Restart App**
   ```bash
   npm start -- --clear
   ```

3. **Check Expo Router**
   - Make sure expo-router is installed
   - Check package.json

---

### Error 8: "Invariant Violation" or React Navigation Error

**Symptoms:**
- App crashes on navigation
- "Invariant Violation" error

**Solutions:**

1. **Clear Cache**
   ```bash
   npm start -- --clear
   ```

2. **Check Navigation Structure**
   - Verify folder structure matches routes
   - Check `app/(tabs)/` folder

3. **Reinstall Navigation Packages**
   ```bash
   npm install @react-navigation/native @react-navigation/bottom-tabs
   ```

---

### Error 9: "Module not found: @/..."

**Symptoms:**
- Import errors with @ symbol
- "Cannot resolve module"

**Solutions:**

1. **Check tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

2. **Restart Metro Bundler**
   ```bash
   npm start -- --clear
   ```

---

### Error 10: Socket.IO Connection Issues

**Symptoms:**
- Real-time updates not working
- Products don't auto-refresh

**Solutions:**

1. **Check Backend Socket.IO**
   - Backend should show "Real-time updates enabled"

2. **Check Network**
   - Socket.IO requires stable connection
   - Try on WiFi instead of mobile data

3. **Fallback to Polling**
   - App already polls every 2 seconds
   - Should work without Socket.IO

---

## 🔍 Debugging Steps

### Step 1: Check Backend
```bash
cd Backend
npm run dev
```
Expected output:
```
MongoDB Connected: localhost
Server running on port 5000
Real-time updates enabled via Socket.IO
```

### Step 2: Check Database
```bash
cd Backend
npm run seed
```
Expected output:
```
✓ Admin user created
✓ 5 products added successfully
```

### Step 3: Test API Manually
```bash
# Test health endpoint
curl http://192.168.31.48:5000/health

# Test login
curl -X POST http://192.168.31.48:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@augmentic.com","password":"admin123"}'
```

### Step 4: Check Mobile App
```bash
cd staff-frontend
npm start
```
Expected output:
```
Metro waiting on exp://...
```

### Step 5: Check Console Logs
- Open Expo Go app
- Shake device
- Click "Debug Remote JS"
- Open Chrome DevTools
- Check Console tab for errors

---

## 📱 Platform-Specific Issues

### iOS Issues

1. **Simulator Not Working**
   ```bash
   npx expo start --ios
   ```

2. **Network Requests Blocked**
   - Check Info.plist for NSAppTransportSecurity
   - Allow arbitrary loads for development

### Android Issues

1. **Emulator Not Working**
   ```bash
   npx expo start --android
   ```

2. **Network Requests Blocked**
   - Check AndroidManifest.xml
   - Add INTERNET permission

3. **Clear Cache**
   ```bash
   cd android
   ./gradlew clean
   ```

---

## 🛠️ Quick Fixes

### Fix 1: Complete Reset
```bash
# Stop all processes
# Then:
cd Backend
npm run seed
npm run dev

# In new terminal:
cd staff-frontend
rm -rf node_modules
npm install
npm start -- --clear
```

### Fix 2: Update API URL
```typescript
// staff-frontend/services/api.ts
// Change to your computer's IP
const API_URL = 'http://YOUR_IP:5000/api';
```

### Fix 3: Check Firewall
```bash
# Windows: Allow Node.js through firewall
# Mac: System Preferences → Security → Firewall → Allow Node
```

---

## 📊 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request data |
| 401 | Unauthorized | Login again |
| 403 | Forbidden | Check user role |
| 404 | Not Found | Check API endpoint |
| 500 | Server Error | Check backend logs |
| ECONNREFUSED | Connection Refused | Backend not running |
| ETIMEDOUT | Timeout | Check network |

---

## 🔧 Environment Check

Run this checklist:

- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Database seeded (admin user + products)
- [ ] API URL correct in frontend
- [ ] Phone/emulator on same network
- [ ] Expo Go app installed
- [ ] Metro bundler running
- [ ] No firewall blocking

---

## 📞 Still Having Issues?

### Check These Files:

1. **Backend**
   - `Backend/.env` - Environment variables
   - `Backend/server.js` - Server entry point
   - `Backend/src/app.js` - Express app

2. **Frontend**
   - `staff-frontend/services/api.ts` - API client
   - `staff-frontend/context/AuthContext.tsx` - Auth state
   - `staff-frontend/app/_layout.tsx` - Root layout

### Enable Debug Mode:

```typescript
// staff-frontend/services/api.ts
// Add this before apiClient.interceptors
console.log('API URL:', API_URL);

// Add this in interceptor
apiClient.interceptors.request.use(async (config) => {
  console.log('Request:', config.method, config.url);
  // ... rest of code
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Error:', error.message);
    throw error;
  }
);
```

---

## ✅ Verification Steps

After fixing, verify:

1. **Backend Health**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"OK"}`

2. **Login Works**
   - Open app
   - Enter credentials
   - Should redirect to home

3. **Products Load**
   - Go to Products tab
   - Should see 5 products
   - Pull to refresh works

4. **Profile Shows**
   - Go to Profile tab
   - Should see user info
   - Logout works

---

**If you're still experiencing issues, please provide:**
1. The exact error message
2. Which screen/action causes it
3. Backend console output
4. Frontend console output (from Expo DevTools)

This will help me provide a more specific solution! 🚀
