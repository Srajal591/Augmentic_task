# 🚀 Quick Start Guide

## Start All Services

### 1. Start Backend (Required First!)
```bash
cd Backend
npm run seed    # First time only - seeds admin user
npm run dev     # Starts on http://localhost:5000
```

### 2. Start Admin Panel
```bash
cd admin-web-app/admin
npm run dev     # Starts on http://localhost:5173
```

**Login:**
- Email: `admin@augmentic.com`
- Password: `admin123`

### 3. Start Staff Mobile App
```bash
cd staff-frontend
npm start -- --clear
```

Then:
- Scan QR code with Expo Go app
- Or press `w` for web version
- Or press `a` for Android emulator
- Or press `i` for iOS simulator

---

## What You Can Do

### Admin Panel (Web)
1. **Dashboard** - View system stats
2. **Inventory** - Manage products
3. **Users** - Create/manage staff, activate/deactivate users

### Staff App (Mobile)
1. **Register** - Create new staff account
2. **Login** - Access your dashboard
3. **Home** - View stats and quick actions
4. **Products** - Browse and order products
5. **Profile** - Manage your account

---

## Key Features

✅ **Authentication** - Secure JWT-based login
✅ **Role-Based Access** - Admin & Staff roles
✅ **User Management** - Create, activate, deactivate users
✅ **Real-Time Updates** - Live product stock updates
✅ **Emerald Theme** - Consistent #10b981 branding
✅ **Professional Icons** - Vector icons throughout
✅ **Responsive Design** - Works on all devices

---

## Important URLs

- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:5173
- **API Docs:** http://localhost:5000/api

---

## Default Credentials

**Admin User:**
- Email: admin@augmentic.com
- Password: admin123
- Role: admin

**Test Staff User (after seeding):**
- Email: staff@augmentic.com
- Password: staff123
- Role: staff

---

## Need Help?

📖 **Documentation:**
- `FINAL_STATUS.md` - Complete project status
- `TESTING_GUIDE.md` - Testing instructions
- `CHANGES_SUMMARY.md` - All changes made
- `ICON_UPGRADE_COMPLETE.md` - Icon details

🐛 **Troubleshooting:**
- `ERROR_FIXED.md` - Common errors and fixes

---

## Quick Commands

```bash
# Backend
cd Backend && npm run seed && npm run dev

# Admin Panel
cd admin-web-app/admin && npm run dev

# Staff App
cd staff-frontend && npm start -- --clear
```

---

**Everything is ready to go!** 🎉
