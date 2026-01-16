# 🏗️ System Architecture - Augmentic Platform

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUGMENTIC PLATFORM                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   Admin Web App  │         │  Staff Mobile    │
│   (React/Vite)   │         │  (React Native)  │
│                  │         │                  │
│  - Dashboard     │         │  - Home          │
│  - Inventory     │         │  - Products      │
│  - Users         │         │  - Profile       │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │ HTTP/REST + Socket.IO      │
         │                            │
         └────────────┬───────────────┘
                      │
         ┌────────────▼────────────┐
         │   Backend Server        │
         │   (Node.js/Express)     │
         │                         │
         │  - Authentication       │
         │  - Authorization        │
         │  - API Routes           │
         │  - Socket.IO            │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   MongoDB Database      │
         │                         │
         │  - Users Collection     │
         │  - Products Collection  │
         │  - Orders Collection    │
         └─────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

User Registration (Self):
┌──────────┐    POST /auth/register    ┌──────────┐
│  Client  │ ───────────────────────> │  Server  │
│          │                           │          │
│          │ <─────────────────────── │          │
└──────────┘    JWT Token + User Data  └──────────┘
                                              │
                                              ▼
                                       ┌──────────┐
                                       │ MongoDB  │
                                       │ (User)   │
                                       └──────────┘

User Creation (Admin):
┌──────────┐  POST /auth/create-user   ┌──────────┐
│  Admin   │ ───────────────────────> │  Server  │
│  Client  │  + Admin JWT Token        │          │
│          │                           │          │
│          │ <─────────────────────── │          │
└──────────┘    Success + User Data    └──────────┘
                                              │
                                              ▼
                                       ┌──────────┐
                                       │ MongoDB  │
                                       │ (User +  │
                                       │ createdBy)│
                                       └──────────┘

Login Flow:
┌──────────┐    POST /auth/login       ┌──────────┐
│  Client  │ ───────────────────────> │  Server  │
│          │  email + password         │          │
│          │                           │  1. Find user
│          │                           │  2. Compare password
│          │                           │  3. Check isActive
│          │                           │  4. Generate JWT
│          │ <─────────────────────── │          │
└──────────┘    JWT Token + User Data  └──────────┘
```

---

## 🛡️ Authorization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Protected Route Access:
┌──────────┐    GET /api/users         ┌──────────┐
│  Client  │ ───────────────────────> │  Server  │
│          │  Authorization: Bearer    │          │
│          │  <JWT Token>              │          │
│          │                           │  Middleware:
│          │                           │  1. protect()
│          │                           │     - Verify JWT
│          │                           │     - Get user
│          │                           │     - Check isActive
│          │                           │  2. adminOnly()
│          │                           │     - Check role === 'admin'
│          │                           │          │
│          │                           │          ▼
│          │                           │     ┌─────────┐
│          │                           │     │ Allowed │
│          │ <─────────────────────── │ <── │   or    │
└──────────┘    Response Data          └──── │ Denied  │
                                             └─────────┘
```

---

## 📊 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required, 3-50 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 6 chars),
  role: String (enum: ['admin', 'staff', 'user'], default: 'user'),
  isActive: Boolean (default: true),
  lastLogin: Date (default: null),
  createdBy: ObjectId (ref: 'User', default: null),
  registrationType: String (enum: ['self-registered', 'admin-created']),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  availableStock: Number (required, min: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  productId: ObjectId (ref: 'Product', required),
  quantity: Number (required, min: 1),
  staffName: String (required),
  status: String (enum: ['pending', 'completed', 'cancelled']),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🔄 Real-Time Communication

```
┌─────────────────────────────────────────────────────────────────┐
│                  SOCKET.IO REAL-TIME FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Order Placement:
┌──────────┐                           ┌──────────┐
│  Mobile  │  POST /api/orders         │  Server  │
│  Client  │ ───────────────────────> │          │
│          │                           │  1. Create order
│          │                           │  2. Update stock
│          │                           │  3. Emit socket event
│          │                           │          │
│          │                           │          ▼
│          │                           │  io.emit('inventory-update')
│          │                           │          │
│          │ <─────────────────────── │          │
└──────────┘    Order Response         └──────────┘
                                              │
                                              │ Socket Event
                                              ▼
                                       ┌──────────┐
                                       │  Admin   │
                                       │  Web App │
                                       │          │
                                       │  Updates │
                                       │  UI      │
                                       └──────────┘
```

---

## 🎯 User Roles & Permissions

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROLE-BASED PERMISSIONS                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ADMIN                                                        │
├──────────────────────────────────────────────────────────────┤
│ ✅ Access admin web panel                                    │
│ ✅ View dashboard with all statistics                        │
│ ✅ Manage inventory (CRUD products)                          │
│ ✅ View all users                                            │
│ ✅ Create new users (any role)                               │
│ ✅ Update user information                                   │
│ ✅ Deactivate/Activate users                                 │
│ ✅ Delete users (except other admins)                        │
│ ✅ View all orders                                           │
│ ✅ Cancel orders                                             │
│ ✅ Real-time inventory updates                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STAFF                                                        │
├──────────────────────────────────────────────────────────────┤
│ ✅ Access mobile app                                         │
│ ✅ Self-register                                             │
│ ✅ View products                                             │
│ ✅ Place orders                                              │
│ ✅ View own profile                                          │
│ ✅ Real-time product updates                                 │
│ ❌ Access admin panel                                        │
│ ❌ Create users                                              │
│ ❌ Manage inventory                                          │
│ ❌ View other users                                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ USER                                                         │
├──────────────────────────────────────────────────────────────┤
│ ✅ Access mobile app                                         │
│ ✅ Self-register                                             │
│ ✅ View products                                             │
│ ✅ Place orders                                              │
│ ✅ View own profile                                          │
│ ❌ Access admin panel                                        │
│ ❌ Create users                                              │
│ ❌ Manage inventory                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                            │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Password Security
├─ Bcrypt hashing (10 salt rounds)
├─ Minimum 6 characters
├─ Never exposed in responses
└─ Secure comparison method

Layer 2: JWT Authentication
├─ Token generation with secret key
├─ 7-day expiration
├─ Bearer token in Authorization header
└─ Token verification on protected routes

Layer 3: Role-Based Access Control
├─ Middleware validation
├─ Role checking (admin, staff, user)
├─ Route protection
└─ Frontend route guards

Layer 4: Account Management
├─ Active/Inactive status
├─ Deactivated users blocked
├─ Admin users protected from deletion
└─ Last login tracking

Layer 5: API Security
├─ CORS enabled
├─ Request validation
├─ Error handling
└─ Rate limiting (can be added)
```

---

## 📱 Frontend Architecture

### Admin Web App (React)
```
admin-web-app/admin/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx          # Navigation sidebar
│   ├── pages/
│   │   ├── Login.jsx            # Admin login
│   │   ├── Dashboard.jsx        # Statistics dashboard
│   │   ├── Products.jsx         # Inventory management
│   │   └── Users.jsx            # User management
│   ├── services/
│   │   ├── api.js               # API client
│   │   └── socket.js            # Socket.IO client
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
└── package.json
```

### Staff Mobile App (React Native)
```
staff-frontend/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx            # Home screen
│   │   ├── products.tsx         # Products screen
│   │   ├── profile.tsx          # Profile screen
│   │   └── _layout.tsx          # Tab navigation
│   ├── auth/
│   │   ├── login.tsx            # Login screen
│   │   ├── register.tsx         # Register screen
│   │   └── _layout.tsx          # Auth layout
│   └── _layout.tsx              # Root layout
├── context/
│   └── AuthContext.tsx          # Auth state management
├── services/
│   └── api.ts                   # API client
└── package.json
```

---

## 🔧 Backend Architecture

```
Backend/
├── src/
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   └── env.js               # Environment variables
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth logic
│   │   ├── user.controller.js   # User CRUD
│   │   ├── product.controller.js# Product CRUD
│   │   └── order.controller.js  # Order CRUD
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT verification
│   │   └── error.middleware.js  # Error handling
│   ├── models/
│   │   ├── user.model.js        # User schema
│   │   ├── product.model.js     # Product schema
│   │   └── order.model.js       # Order schema
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── user.routes.js       # User endpoints
│   │   ├── product.routes.js    # Product endpoints
│   │   └── order.routes.js      # Order endpoints
│   ├── sockets/
│   │   └── inventory.socket.js  # Socket.IO handlers
│   └── app.js                   # Express app setup
├── server.js                    # Server entry point
├── seed.js                      # Database seeding
└── package.json
```

---

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register          # Self-registration (public)
POST   /login             # User login (public)
GET    /me                # Get current user (protected)
POST   /create-user       # Admin creates user (admin only)
```

### User Routes (`/api/users`)
```
GET    /                  # Get all users (admin only)
GET    /:id               # Get single user (admin only)
PUT    /:id               # Update user (admin only)
DELETE /:id               # Delete user (admin only)
```

### Product Routes (`/api/products`)
```
GET    /                  # Get all products (protected)
GET    /:id               # Get single product (protected)
POST   /                  # Create product (admin only)
PUT    /:id               # Update product (admin only)
DELETE /:id               # Delete product (admin only)
```

### Order Routes (`/api/orders`)
```
GET    /                  # Get all orders (protected)
GET    /:id               # Get single order (protected)
POST   /                  # Create order (protected)
PATCH  /:id/cancel        # Cancel order (protected)
```

---

## 🎨 UI/UX Design Principles

### Admin Web App
- **Modern & Professional**: Gradient backgrounds, shadows, rounded corners
- **Color-Coded**: Different colors for roles, statuses, registration types
- **Responsive**: Works on desktop and tablet
- **Real-Time**: Live updates via Socket.IO
- **Intuitive**: Clear navigation with sidebar

### Staff Mobile App
- **Clean & Simple**: Minimalist design, easy to use
- **Touch-Friendly**: Large buttons, adequate spacing
- **Visual Feedback**: Color-coded badges, loading states
- **Smooth**: Animations and transitions
- **Efficient**: Only 3 tabs for quick navigation

---

## 📊 Data Flow Examples

### Example 1: User Registration
```
1. User fills registration form
2. Frontend validates input
3. POST /api/auth/register
4. Backend validates data
5. Backend hashes password
6. Backend creates user in MongoDB
7. Backend generates JWT token
8. Backend returns token + user data
9. Frontend stores token
10. Frontend redirects to home
```

### Example 2: Admin Creates User
```
1. Admin clicks "Create User"
2. Admin fills form
3. POST /api/auth/create-user + JWT
4. Backend verifies admin token
5. Backend validates data
6. Backend creates user with createdBy field
7. Backend returns success
8. Frontend refreshes user list
9. New user appears with "Admin Created" badge
```

### Example 3: Place Order
```
1. Staff selects product
2. Staff enters quantity
3. POST /api/orders + JWT
4. Backend verifies token
5. Backend checks stock
6. Backend creates order
7. Backend updates product stock
8. Backend emits socket event
9. Backend returns success
10. Mobile app updates UI
11. Admin panel receives socket event
12. Admin panel updates inventory
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   Admin Web App  │
│   (Vercel/       │
│    Netlify)      │
└────────┬─────────┘
         │
         │ HTTPS
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│   Backend API    │ ◄────── │  Staff Mobile    │
│   (Heroku/       │         │  (Expo/App Store)│
│    AWS/DigitalOcean)       └──────────────────┘
└────────┬─────────┘
         │
         │
         ▼
┌──────────────────┐
│   MongoDB Atlas  │
│   (Cloud DB)     │
└──────────────────┘
```

---

## 📈 Scalability Considerations

### Current Architecture
- ✅ Stateless backend (JWT tokens)
- ✅ MongoDB for horizontal scaling
- ✅ Socket.IO for real-time updates
- ✅ Separate frontend and backend

### Future Enhancements
- 🔄 Redis for session management
- 🔄 Load balancer for multiple backend instances
- 🔄 CDN for static assets
- 🔄 Microservices architecture
- 🔄 Message queue for async tasks
- 🔄 Caching layer
- 🔄 Rate limiting
- 🔄 API versioning

---

## 🎯 Key Features Summary

### ✅ Implemented
1. Complete authentication system
2. Role-based authorization
3. Admin web panel
4. Staff mobile app
5. User management
6. Inventory management
7. Order management
8. Real-time updates
9. Secure password hashing
10. JWT token authentication
11. Registration type tracking
12. Created by tracking
13. Active/Inactive status
14. Beautiful UI/UX

### 🔄 Can Be Added
1. Password reset
2. Email verification
3. Two-factor authentication
4. User profile editing
5. Order history
6. Analytics dashboard
7. Export reports
8. Notifications
9. Search and filters
10. Pagination

---

**This architecture provides a solid foundation for a scalable, secure, and maintainable application! 🚀**
