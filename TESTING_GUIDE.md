# 🧪 Testing Guide - Authentication & Authorization System

## 🎯 Quick Start Testing

### Step 1: Verify Backend is Running
✅ Backend is already running on: `http://192.168.31.48:5000`

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### Step 2: Test Admin Login (Web App)

1. **Open Admin Panel**
   - URL: `http://localhost:5174`
   - You should see a beautiful login page

2. **Login with Admin Credentials**
   ```
   Email: admin@augmentic.com
   Password: admin123
   ```

3. **Expected Result:**
   - ✅ Successful login
   - ✅ Redirect to Dashboard
   - ✅ See sidebar with 3 sections (Dashboard, Inventory, Users)
   - ✅ See admin name and email in sidebar

4. **Test Non-Admin Login (Should Fail)**
   - Try logging in with a staff/user account
   - Expected: "Access denied. Admin credentials required."

---

### Step 3: Test User Management (Admin Panel)

1. **Navigate to Users Page**
   - Click "Users" in the sidebar
   - You should see a list of all users

2. **Create a New User**
   - Click "+ Create User" button
   - Fill in the form:
     ```
     Name: Test Staff
     Email: staff@test.com
     Password: test123
     Role: Staff
     ```
   - Click "Create User"
   - Expected: User created successfully

3. **Verify User Display**
   - Check the users table
   - You should see:
     - ✅ User name and email
     - ✅ Role badge (color-coded)
     - ✅ Registration type: "Admin Created" (purple badge)
     - ✅ Created by: "Admin User"
     - ✅ Status: "Active" (green badge)

---

### Step 4: Test Staff Mobile App

1. **Start the Mobile App**
   ```bash
   cd staff-frontend
   npm start
   ```

2. **Test Self-Registration**
   - Open the app
   - Click "Sign Up"
   - Fill in the form:
     ```
     Name: Mobile User
     Email: mobile@test.com
     Password: test123
     Confirm Password: test123
     ```
   - Click "Sign Up"
   - Expected: Successful registration and redirect to home

3. **Verify Home Screen**
   - ✅ See welcome message with user name
   - ✅ See role badge (STAFF or USER)
   - ✅ See overview statistics
   - ✅ See quick action buttons
   - ✅ See system status

4. **Test Bottom Navigation**
   - ✅ Should see only 3 tabs: Home, Products, Profile
   - ✅ Tap each tab to verify navigation works

5. **Test Products Screen**
   - Navigate to Products tab
   - ✅ See list of products with stock levels
   - ✅ See color-coded stock badges:
     - Green: Good stock (>5 units)
     - Orange: Low stock (1-5 units)
     - Red: Out of stock (0 units)
   - ✅ See auto-update indicator
   - Pull down to refresh

6. **Test Profile Screen**
   - Navigate to Profile tab
   - ✅ See user avatar with initial
   - ✅ See account information
   - ✅ See registration type: "Self Registered"
   - ✅ See settings menu
   - ✅ Test logout

---

### Step 5: Test Admin-Created User Login (Mobile)

1. **Login with Admin-Created User**
   - Use the credentials you created from admin panel:
     ```
     Email: staff@test.com
     Password: test123
     ```
   - Expected: Successful login

2. **Verify Profile**
   - Go to Profile tab
   - Check "Registration Type"
   - Expected: "Created by Admin"

---

### Step 6: Test Role-Based Access Control

1. **Try to Access Admin Panel with Staff Account**
   - Logout from admin panel
   - Try to login with staff credentials
   - Expected: "Access denied. Admin credentials required."

2. **Verify API Protection**
   - Try to access admin endpoints without token:
     ```bash
     curl http://localhost:5000/api/users
     ```
   - Expected: 401 Unauthorized

3. **Verify Admin-Only Endpoints**
   - Login as staff in mobile app
   - Try to create a user (should not be possible from mobile)
   - Only admin can create users

---

## 🔍 API Testing with cURL

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "role": "staff"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@augmentic.com",
    "password": "admin123"
  }'
```

Save the token from the response!

### 3. Get Current User (Protected)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Get All Users (Admin Only)
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

### 5. Create User (Admin Only)
```bash
curl -X POST http://localhost:5000/api/auth/create-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Created User",
    "email": "created@example.com",
    "password": "test123",
    "role": "staff"
  }'
```

---

## ✅ Checklist - What to Verify

### Backend
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Admin user seeded
- [ ] All routes accessible
- [ ] JWT tokens generated correctly
- [ ] Password hashing works
- [ ] Role-based middleware works

### Admin Web App
- [ ] Login page loads
- [ ] Admin can login
- [ ] Non-admin login rejected
- [ ] Dashboard shows statistics
- [ ] Sidebar navigation works
- [ ] Users page displays all users
- [ ] Can create new users
- [ ] Registration type displayed correctly
- [ ] Created by field shows admin name
- [ ] Logout works

### Staff Mobile App
- [ ] App starts without errors
- [ ] Login screen loads
- [ ] Register screen loads
- [ ] Self-registration works
- [ ] Login works
- [ ] Only 3 tabs visible (Home, Products, Profile)
- [ ] Home screen shows stats
- [ ] Products screen shows products
- [ ] Profile screen shows user info
- [ ] Registration type displayed correctly
- [ ] Logout works
- [ ] Pull-to-refresh works

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Port Already in Use
**Error:** `EADDRINUSE: address already in use 0.0.0.0:5000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Then restart backend
cd Backend
npm run dev
```

### Issue 2: MongoDB Connection Failed
**Error:** `MongoDB connection failed`

**Solution:**
- Make sure MongoDB is running
- Check DATABASE_URL in `.env` file
- Default: `mongodb://localhost:27017/augmentic`

### Issue 3: Admin User Not Found
**Error:** `Invalid credentials` when logging in as admin

**Solution:**
```bash
cd Backend
npm run seed
```

### Issue 4: CORS Errors
**Error:** `CORS policy blocked`

**Solution:**
- Backend already has CORS enabled for all origins
- Check if backend is running
- Verify API_URL in frontend matches backend URL

### Issue 5: Token Expired
**Error:** `Not authorized to access this route`

**Solution:**
- Logout and login again
- Token expires after 7 days
- Check JWT_EXPIRE in `.env`

---

## 📊 Expected User Flow

### Admin Flow
1. Login to admin panel → Dashboard
2. View statistics
3. Navigate to Users
4. Create new users
5. View all users with registration types
6. Manage inventory
7. Logout

### Staff/User Flow (Mobile)
1. Register or Login
2. View Home dashboard
3. Browse Products
4. Place orders
5. View Profile
6. Logout

---

## 🎨 Visual Indicators

### Role Badges
- **Admin**: Red badge
- **Staff**: Blue badge
- **User**: Green badge

### Registration Type Badges
- **Admin Created**: Purple badge
- **Self Registered**: Yellow badge

### Stock Badges
- **Good Stock** (>5): Green
- **Low Stock** (1-5): Orange
- **Out of Stock** (0): Red

### Status Badges
- **Active**: Green
- **Inactive**: Red

---

## 🚀 Performance Testing

### Test Real-Time Updates
1. Open admin panel in one browser
2. Open mobile app
3. Create an order from mobile
4. Watch inventory update in admin panel in real-time

### Test Concurrent Users
1. Login as admin in one browser
2. Login as staff in another browser/device
3. Both should work independently
4. Changes should reflect in real-time

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Backend Tests:
[ ] Server running
[ ] Health check passed
[ ] Admin user exists
[ ] API endpoints working

Admin Web App Tests:
[ ] Login successful
[ ] Dashboard loaded
[ ] Users page working
[ ] Create user working
[ ] Logout working

Mobile App Tests:
[ ] Registration working
[ ] Login working
[ ] 3 tabs visible
[ ] Home screen working
[ ] Products screen working
[ ] Profile screen working
[ ] Logout working

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
```

---

## 🎉 Success Criteria

Your system is working correctly if:

✅ Admin can login to web panel
✅ Admin can create users
✅ Users can self-register on mobile
✅ All users are displayed with correct registration types
✅ Role-based access control works
✅ Non-admins cannot access admin panel
✅ Mobile app shows only 3 tabs
✅ Real-time updates work
✅ Logout works on both platforms
✅ Token authentication works
✅ Password hashing works

---

**Happy Testing! 🚀**

If you encounter any issues, check the console logs and refer to the Common Issues section above.
