# 🚀 Quick Reference Card

## 📋 Essential Information

### 🔑 Default Credentials
```
Admin Login:
Email: admin@augmentic.com
Password: admin123
```

### 🌐 URLs
```
Backend API:    http://192.168.31.48:5000
Admin Panel:    http://localhost:5174
Health Check:   http://localhost:5000/health
```

### 🎯 Quick Commands

#### Start Backend
```bash
cd Backend
npm run seed    # First time only
npm run dev
```

#### Start Admin Web App
```bash
cd admin-web-app/admin
npm run dev
```

#### Start Mobile App
```bash
cd staff-frontend
npm start
```

---

## 📱 User Roles

| Role | Access | Can Create Users | Self-Register |
|------|--------|------------------|---------------|
| Admin | Web Panel | ✅ Yes | ❌ No |
| Staff | Mobile App | ❌ No | ✅ Yes |
| User | Mobile App | ❌ No | ✅ Yes |

---

## 🎨 UI Elements

### Admin Panel Sections
1. 📊 **Dashboard** - Statistics overview
2. 📦 **Inventory** - Product management
3. 👥 **Users** - User management

### Mobile App Tabs
1. 🏠 **Home** - Dashboard with stats
2. 📦 **Products** - Browse and order
3. 👤 **Profile** - User info and settings

---

## 🔐 API Endpoints

### Public
```
POST /api/auth/register    # Self-registration
POST /api/auth/login       # Login
```

### Protected
```
GET  /api/auth/me          # Current user
GET  /api/products         # All products
POST /api/orders           # Create order
```

### Admin Only
```
POST   /api/auth/create-user  # Create user
GET    /api/users             # All users
PUT    /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user
```

---

## 🎨 Color Codes

### Role Badges
- 🔴 **Admin** - Red
- 🔵 **Staff** - Blue
- 🟢 **User** - Green

### Registration Type
- 🟣 **Admin Created** - Purple
- 🟡 **Self Registered** - Yellow

### Stock Levels
- 🟢 **Good** (>5) - Green
- 🟠 **Low** (1-5) - Orange
- 🔴 **Empty** (0) - Red

### Status
- 🟢 **Active** - Green
- 🔴 **Inactive** - Red

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/augmentic
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

### Frontend (api.js / api.ts)
```javascript
const API_URL = 'http://192.168.31.48:5000/api';
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>
```

### MongoDB Not Running
```bash
# Start MongoDB service
net start MongoDB
```

### Clear Database
```bash
cd Backend
npm run seed
```

### Reset Mobile App
```bash
cd staff-frontend
rm -rf node_modules
npm install
npm start -- --clear
```

---

## 📊 Test Users

After seeding, you have:
- 1 Admin user (admin@augmentic.com)
- 5 Products (Laptop, Mouse, Keyboard, Monitor, Headphones)

Create test users:
```bash
# Via Admin Panel
1. Login as admin
2. Go to Users
3. Click "Create User"
4. Fill form and submit

# Via Mobile App
1. Open app
2. Click "Sign Up"
3. Fill form and submit
```

---

## 🔍 Verification Checklist

### Backend
- [ ] Server running on port 5000
- [ ] MongoDB connected
- [ ] Admin user exists
- [ ] Products seeded

### Admin Web App
- [ ] Running on port 5174
- [ ] Can login as admin
- [ ] Dashboard shows stats
- [ ] Can create users

### Mobile App
- [ ] App starts without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Shows 3 tabs only
- [ ] Products load correctly

---

## 📞 Support

### Check Logs
```bash
# Backend logs
cd Backend
npm run dev

# Admin web app logs
cd admin-web-app/admin
npm run dev

# Mobile app logs
cd staff-frontend
npm start
```

### Common Issues
1. **Port in use** → Kill process and restart
2. **MongoDB error** → Start MongoDB service
3. **CORS error** → Check API URL matches
4. **Token expired** → Logout and login again
5. **No products** → Run seed script

---

## 📚 Documentation Files

- `SETUP_COMPLETE.md` - Complete setup guide
- `TESTING_GUIDE.md` - Testing instructions
- `SYSTEM_ARCHITECTURE.md` - Architecture details
- `QUICK_REFERENCE.md` - This file

---

## 🎯 Key Features

✅ JWT Authentication
✅ Role-Based Access Control
✅ Admin Panel (Web)
✅ Staff App (Mobile)
✅ User Management
✅ Inventory Management
✅ Order Management
✅ Real-Time Updates
✅ Registration Tracking
✅ Beautiful UI/UX

---

## 🚀 Next Steps

1. Test admin login
2. Create test users
3. Test mobile app
4. Place test orders
5. Verify real-time updates
6. Customize as needed

---

**Everything is ready to use! 🎉**

For detailed information, see the other documentation files.
