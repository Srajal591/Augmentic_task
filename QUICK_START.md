# Quick Start Guide

## 🚀 Getting Started

### 1. Start the Backend Server

```bash
cd Backend
npm run seed    # Create admin user and sample data
npm run dev     # Start the server
```

The server will run on `http://192.168.31.48:5000`

**Default Admin Credentials:**
- Email: `admin@augmentic.com`
- Password: `admin123`

---

### 2. Start the Admin Web App

```bash
cd admin-web-app/admin
npm run dev
```

The admin panel will open in your browser.

**Login with admin credentials:**
- Email: `admin@augmentic.com`
- Password: `admin123`

**Admin Panel Features:**
- 📊 Dashboard - View statistics and system status
- 📦 Inventory - Manage products with real-time updates
- 👥 Users - View and create users

---

### 3. Start the Staff Mobile App

```bash
cd staff-frontend
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on your phone

**Staff App Features:**
- 🏠 Home - Dashboard with statistics
- 📦 Products - View products and place orders
- 👤 Profile - View account info and logout

**To test:**
1. Register a new staff account
2. Or login with a user created by admin

---

## 📱 Testing the Complete Flow

### Test 1: Admin Login
1. Open admin web app
2. Login with `admin@augmentic.com` / `admin123`
3. You should see the dashboard

### Test 2: Create User via Admin
1. In admin panel, go to Users
2. Click "Create User"
3. Fill in the form:
   - Name: Test Staff
   - Email: staff@test.com
   - Password: test123
   - Role: staff
4. User created with "Admin Created" badge

### Test 3: Staff Registration
1. Open staff mobile app
2. Click "Sign Up"
3. Fill registration form
4. Account created with "Self Registered" type

### Test 4: View All Users
1. In admin panel, go to Users
2. You'll see all users with:
   - Role badges (admin, staff, user)
   - Registration type (Admin Created / Self Registered)
   - Created by info (for admin-created users)
   - Status (Active/Inactive)

### Test 5: Real-time Inventory
1. Open admin panel (Inventory page)
2. Open staff app (Products page)
3. Place an order in staff app
4. Watch stock update in real-time on admin panel

---

## 🔐 Security Features

✅ **Admin Panel Protection**
- Only admin role can access
- Non-admin users are blocked at login

✅ **JWT Authentication**
- Secure token-based auth
- 30-day token expiration

✅ **Password Security**
- Bcrypt hashing
- Minimum 6 characters

✅ **Role-Based Access**
- Admin-only routes protected
- User status checking

---

## 📊 User Roles

### Admin
- Full access to admin panel
- Can create users
- Can view all users
- Can manage inventory

### Staff
- Access to mobile app
- Can view products
- Can place orders
- Can view profile

### User
- Access to mobile app
- Basic permissions

---

## 🎨 UI Features

### Admin Web App
- Modern sidebar navigation
- Real-time dashboard statistics
- Color-coded stock indicators
- User management table
- Create user modal

### Staff Mobile App
- Clean, modern design
- Pull-to-refresh
- Real-time updates
- Attractive cards and badges
- Smooth navigation

---

## 🐛 Troubleshooting

### Backend not connecting?
```bash
# Check if MongoDB is running
# Check .env file has correct DATABASE_URL
cd Backend
npm run seed
npm run dev
```

### Admin can't login?
- Make sure you ran `npm run seed` in Backend
- Check credentials: `admin@augmentic.com` / `admin123`
- Check browser console for errors

### Mobile app not connecting?
- Update API URL in `staff-frontend/services/api.ts`
- Make sure backend is running
- Check network connection

### Real-time updates not working?
- Check Socket.IO connection
- Make sure backend is running
- Check browser/app console for errors

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/create-user` - Admin creates user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/cancel` - Cancel order

---

## ✨ What's New

✅ Complete authentication system
✅ Role-based access control
✅ Admin panel with sidebar navigation
✅ User management with creation
✅ Registration type tracking
✅ Beautiful mobile app UI
✅ Simplified navigation (3 tabs)
✅ Profile screen with user info
✅ Attractive home dashboard
✅ Real-time updates everywhere

---

## 🎯 Next Features to Add

- [ ] Password reset
- [ ] Email verification
- [ ] User profile editing
- [ ] Activity logs
- [ ] Advanced permissions
- [ ] 2FA authentication
- [ ] Session management
- [ ] Export user data

---

## 📞 Support

If you encounter any issues:
1. Check the console for errors
2. Verify backend is running
3. Check database connection
4. Review the AUTHENTICATION_SETUP.md file

Happy coding! 🚀
