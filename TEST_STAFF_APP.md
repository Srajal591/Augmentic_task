# 🧪 Test Staff App - Error Detection

## Quick Test Procedure

### Test 1: Check if Backend is Running
```bash
curl http://192.168.31.48:5000/health
```

**Expected Result:**
```json
{"status":"OK","message":"Server is running"}
```

**If this fails:** Backend is not running or IP is wrong.

---

### Test 2: Check if Database is Seeded
```bash
curl http://192.168.31.48:5000/api/products
```

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {"name": "Laptop", "availableStock": 10},
    ...
  ]
}
```

**If this fails:** Database not seeded. Run `npm run seed` in Backend folder.

---

### Test 3: Check if Login Works
```bash
curl -X POST http://192.168.31.48:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@augmentic.com","password":"admin123"}'
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJ..."
  }
}
```

**If this fails:** Admin user not created. Run `npm run seed`.

---

### Test 4: Start Staff App
```bash
cd staff-frontend
npm start
```

**Expected Result:**
```
Metro waiting on exp://192.168.31.48:8081
```

**Common Errors:**

1. **"Cannot find module"**
   - Solution: `rm -rf node_modules && npm install`

2. **"Port 8081 already in use"**
   - Solution: Kill the process or use different port

3. **"Unable to resolve @/..."**
   - Solution: `npm start -- --clear`

---

## 🔍 Identify Your Error

### Error Type 1: Network/Connection Errors
**Symptoms:**
- "Network Error"
- "ECONNREFUSED"
- "Cannot connect"

**Check:**
- Is backend running? → `curl http://192.168.31.48:5000/health`
- Is IP correct? → Check `staff-frontend/services/api.ts`
- Same network? → Phone and computer on same WiFi

---

### Error Type 2: Authentication Errors
**Symptoms:**
- "Invalid credentials"
- "Not authorized"
- "Token expired"

**Check:**
- User exists? → Login to admin panel, check Users
- User active? → Check Status column in Users page
- Token valid? → Logout and login again

---

### Error Type 3: Build/Metro Errors
**Symptoms:**
- "Unable to resolve module"
- "Invariant Violation"
- Metro bundler crashes

**Check:**
- Clear cache: `npm start -- --clear`
- Reinstall: `rm -rf node_modules && npm install`
- Check tsconfig.json paths

---

### Error Type 4: UI/Display Errors
**Symptoms:**
- Blank screen
- Tabs not showing
- Crashes on specific screen

**Check:**
- Console logs in Expo DevTools
- React Native debugger
- Check component imports

---

## 📱 Test on Device

### Step 1: Open Expo Go
- Install Expo Go from App Store/Play Store
- Open the app

### Step 2: Scan QR Code
- Run `npm start` in staff-frontend
- Scan QR code with Expo Go

### Step 3: Check Console
- Shake device
- Click "Debug Remote JS"
- Open Chrome DevTools
- Look for errors in Console

---

## 🐛 Common Error Messages & Solutions

### "Network request failed"
```
Solution:
1. Check backend is running
2. Update API_URL in services/api.ts
3. Check firewall settings
```

### "Cannot read property 'name' of null"
```
Solution:
1. User data not loaded
2. Logout and login again
3. Check AuthContext
```

### "Invariant Violation: Element type is invalid"
```
Solution:
1. Import error in component
2. Check all imports
3. Clear cache: npm start -- --clear
```

### "Unable to resolve module @/..."
```
Solution:
1. Check tsconfig.json
2. Restart Metro: npm start -- --clear
3. Reinstall: rm -rf node_modules && npm install
```

### "EADDRINUSE: address already in use"
```
Solution:
1. Kill existing Metro process
2. Or use different port: npm start -- --port 8082
```

---

## 🔧 Quick Fix Commands

### Complete Reset
```bash
# Backend
cd Backend
npm run seed
npm run dev

# Frontend (new terminal)
cd staff-frontend
rm -rf node_modules
npm install
npm start -- --clear
```

### Just Clear Cache
```bash
cd staff-frontend
npm start -- --clear
```

### Update Dependencies
```bash
cd staff-frontend
npm install
```

---

## 📊 Error Checklist

Check each item:

**Backend:**
- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Database seeded
- [ ] Health endpoint responds
- [ ] Products endpoint responds
- [ ] Login endpoint responds

**Frontend:**
- [ ] Metro bundler running
- [ ] No module resolution errors
- [ ] API_URL is correct
- [ ] Expo Go app installed
- [ ] Phone on same network
- [ ] QR code scans successfully

**App:**
- [ ] Login screen loads
- [ ] Can register new user
- [ ] Can login
- [ ] Home screen shows
- [ ] 3 tabs visible
- [ ] Products load
- [ ] Profile shows

---

## 🎯 Next Steps

**If everything works:**
✅ You're all set! Start using the app.

**If you see an error:**
1. Note the exact error message
2. Check which screen/action causes it
3. Look for the error in this guide
4. Apply the solution
5. If still not working, check STAFF_APP_TROUBLESHOOTING.md

**If you need help:**
Provide:
- Exact error message
- Screenshot if possible
- Backend console output
- Frontend console output
- Which step failed

---

## 🚀 Success Indicators

You'll know it's working when:

1. **Backend Console Shows:**
   ```
   MongoDB Connected: localhost
   Server running on port 5000
   Real-time updates enabled via Socket.IO
   ```

2. **Frontend Console Shows:**
   ```
   Metro waiting on exp://...
   ```

3. **App Shows:**
   - Login screen with gradient background
   - Can register/login successfully
   - Home screen with welcome message
   - 3 tabs at bottom (Home, Products, Profile)
   - Products load with stock levels
   - Profile shows user info

---

**Everything should work smoothly! If you encounter any specific error, refer to the troubleshooting guide or let me know the exact error message.** 🎉
