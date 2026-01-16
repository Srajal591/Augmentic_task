# Project Structure

## Complete File Organization

```
Augmentic/
│
├── Backend/                          # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection
│   │   │   └── env.js               # Environment variables
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js        # ✅ User schema with auth
│   │   │   ├── product.model.js     # Product schema
│   │   │   └── order.model.js       # Order schema
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # ✅ Auth logic (login, register, create user)
│   │   │   ├── user.controller.js   # ✅ User CRUD operations
│   │   │   ├── product.controller.js
│   │   │   └── order.controller.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # ✅ Auth endpoints
│   │   │   ├── user.routes.js       # ✅ User management endpoints
│   │   │   ├── product.routes.js
│   │   │   └── order.routes.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   # ✅ JWT verification & role checking
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── sockets/
│   │   │   └── inventory.socket.js  # Real-time updates
│   │   │
│   │   └── app.js                   # Express app setup
│   │
│   ├── seed.js                      # ✅ Database seeding with admin user
│   ├── server.js                    # Server entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
├── admin-web-app/                   # React Admin Panel
│   └── admin/
│       ├── src/
│       │   ├── components/
│       │   │   └── Sidebar.jsx      # ✅ Sidebar navigation
│       │   │
│  