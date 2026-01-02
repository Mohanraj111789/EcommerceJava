# E-Commerce Application - Post-Login Workflow Flowchart

## Overview
After successful login, the application routes users to different sections based on their role (USER or ADMIN).

---

## 1. LOGIN FLOW

```
┌─────────────────┐
│   User enters   │
│  credentials    │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────┐
│  AuthController.login()      │
│  (Backend Validation)        │
└────────┬─────────────────────┘
         │
    ┌────▼────┐
    │ Valid?  │
    └─┬──┬────┘
      │  │
   No │  │ Yes
      │  └──────────────┐
      │                 ▼
      │         ┌──────────────────────┐
      │         │  Generate JWT Token  │
      │         │  (JwtUtil)           │
      │         └─────────┬────────────┘
      │                   │
      │                   ▼
      │         ┌──────────────────────┐
      │         │  Return user object  │
      │         │  & token to Frontend │
      │         └─────────┬────────────┘
      │                   │
      ▼                   ▼
 ┌─────────┐      ┌──────────────────┐
 │ Error   │      │ AuthContext sets │
 │ Message │      │ user state       │
 └─────────┘      └────────┬─────────┘
                           │
                           ▼
                  ┌─────────────────────┐
                  │  Check user.role    │
                  └────────┬───────┬────┘
                           │       │
                        USER│       │ADMIN
                           │       │
                    ┌──────▼─┐  ┌──▼──────┐
                    │ Products│  │ Admin   │
                    │  Page   │  │Dashboard│
                    └─────────┘  └─────────┘
```

---

## 2. USER ROLE WORKFLOW (Standard Customer)

```
┌─────────────────────────────────┐
│  /products (Main Page)          │
│  - Load all products from DB    │
│  - Display product grid (Card)  │
│  - Show cart icon + count       │
└────────────┬────────────────────┘
             │
       ┌─────┴────────────────┬──────────────┐
       │                      │              │
       ▼                      ▼              ▼
   ┌────────────┐      ┌─────────────┐  ┌──────────┐
   │ Add to     │      │ View Cart   │  │ View     │
   │ Cart       │      │             │  │ Orders   │
   └──────┬─────┘      └────┬────────┘  └────┬─────┘
          │                 │               │
          ▼                 ▼               ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │ Call API:    │  │ /cart/{id}   │  │ /orders/{id} │
   │ POST         │  │ GET cart     │  │ GET orders   │
   │ /cart/add    │  │ items        │  │              │
   └──────┬───────┘  └────┬─────────┘  └──────┬───────┘
          │               │                   │
          ▼               ▼                   ▼
   ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
   │Cart updated │  │Display items │  │Display user  │
   │Cart count   │  │with qty      │  │ previous     │
   │incremented  │  │controls      │  │ orders       │
   └─────────────┘  │              │  └──────────────┘
                    └────┬─────────┘
                         │
                    ┌────┴──────────┬────────────┐
                    │               │            │
                    ▼               ▼            ▼
              ┌──────────────┐ ┌────────┐ ┌──────────┐
              │Update Qty    │ │Remove  │ │Checkout  │
              │(+/- buttons) │ │Item    │ │(Place    │
              └──────────────┘ │(Delete)│ │Order)    │
                              └────────┘ └────┬─────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │ /checkout        │
                                    │ - Enter address  │
                                    │ - Review summary │
                                    │ - Place Order    │
                                    └────────┬─────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │ POST /orders     │
                                    │ Create order     │
                                    │ Clear cart       │
                                    └────────┬─────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │ Success! Order   │
                                    │ confirmation     │
                                    │ Redirect to      │
                                    │ /orders page     │
                                    └──────────────────┘
```

---

## 3. ADMIN ROLE WORKFLOW

```
┌─────────────────────────────────┐
│  /admin/dashboard               │
│  (Admin-only protected route)   │
└────────────┬────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │ Admin Dashboard    │
    │ - Manage Products  │
    │ - View Users       │
    │ - View Stats       │
    └─┬──────────────┬───┘
      │              │
      ▼              ▼
  ┌────────────┐ ┌──────────────┐
  │ Manage     │ │ View All     │
  │ Products   │ │ Users        │
  │ (CRUD)     │ │ /admin/users │
  └─┬──────────┘ └───────┬──────┘
    │                    │
    ├─ Create Product   │
    │  POST /products   │
    │                   │
    ├─ Update Product  │
    │  PUT /products   │
    │                  │
    ├─ Delete Product  │
    │  DELETE /products│
    │                  │
    └─ View Products   │
       GET /products   │
                       │
                       ▼
                  ┌──────────────┐
                  │ Display Users│
                  │ with details │
                  └──────────────┘
```

---

## 4. ROUTING LOGIC (Route Guards)

```
┌─────────────────────────────────────┐
│ ProtectedRoute Component            │
│ (Checks isAuthenticated)            │
└────────────┬────────────────────────┘
             │
        ┌────▼────┐
        │ Logged  │
        │ in?     │
        └─┬──┬────┘
          │  │
       No │  │ Yes
          │  │
          ▼  ▼
    ┌────────────┐   ┌─────────────┐
    │ Redirect   │   │ Allow access│
    │ to /login  │   │ to protected│
    └────────────┘   │ resource    │
                     └─────────────┘

┌─────────────────────────────────────┐
│ AdminRoute Component                │
│ (Checks isAuthenticated + isAdmin)  │
└────────────┬────────────────────────┘
             │
        ┌────▼─────┐
        │ Logged   │
        │ in?      │
        └─┬──┬─────┘
          │  │
       No │  │ Yes
          │  │
          ▼  │
    ┌──────────────┐
    │ Redirect to  │
    │ /login       │
    └──────────────┘   ┌────▼────────┐
                       │ Admin?      │
                       └─┬──┬────────┘
                         │  │
                      No │  │ Yes
                         │  │
                         ▼  ▼
                  ┌─────────────────┐
                  │ Redirect to     │
                  │ /products       │
                  └─────────────────┘
                  
                  ┌──────────────────┐
                  │ Allow access to  │
                  │ /admin routes    │
                  └──────────────────┘
```

---

## 5. API ENDPOINTS FLOW

### Authentication APIs
```
POST /api/auth/login
  ├─ Input: { email, password }
  ├─ Output: { token, user }
  └─ Sets JWT token in localStorage

POST /api/auth/register
  ├─ Input: { name, email, password }
  ├─ Output: { token, user }
  └─ Creates new USER role account

GET /api/auth/current-user
  ├─ Uses JWT token from header
  └─ Output: { user }
```

### Product APIs
```
GET /api/products
  └─ Output: [Product list]

POST /api/products (Admin only)
  ├─ Input: { name, price, description }
  └─ Output: { product }

PUT /api/products/{id} (Admin only)
  ├─ Input: Updated product data
  └─ Output: { updated product }

DELETE /api/products/{id} (Admin only)
  └─ Output: { success message }
```

### Cart APIs
```
GET /api/cart/{userId}
  └─ Output: { items: [CartItem] }

POST /api/cart/add
  ├─ Input: { productId, quantity }
  └─ Output: { updated cart }

PUT /api/cart/{userId}/item/{itemId}
  ├─ Input: { quantity }
  └─ Output: { updated item }

DELETE /api/cart/{userId}/item/{itemId}
  └─ Output: { success message }

DELETE /api/cart/{userId}/clear
  └─ Output: { success message }
```

### Order APIs
```
GET /api/orders/{userId}
  └─ Output: [Order list]

POST /api/orders
  ├─ Input: { userId, address, items }
  └─ Output: { orderId, status }
```

### User APIs (Admin only)
```
GET /api/users
  └─ Output: [User list]

GET /api/users/{id}
  └─ Output: { user details }
```

---

## 6. STATE MANAGEMENT FLOW

```
┌─────────────────────────────────┐
│ AuthContext (Global State)      │
│ - user: Current logged-in user  │
│ - isAuthenticated: boolean      │
│ - isAdmin: boolean              │
│ - loading: boolean              │
└────────┬────────────────────────┘
         │
         ├─ login()      ─────────► Authenticate user
         ├─ register()   ─────────► Create new account
         └─ logout()     ─────────► Clear user session
         │
         ▼
    ┌──────────────────┐
    │ Local State in   │
    │ Components:      │
    │ - Products: []   │
    │ - CartItems: []  │
    │ - Orders: []     │
    │ - CartCount: 0   │
    └──────────────────┘
```

---

## 7. Component Hierarchy (After Login)

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── ProtectedRoute
│       │   ├── Products (Main page)
│       │   │   ├── Navbar
│       │   │   ├── CartIcon
│       │   │   └── Card[] (Product grid)
│       │   ├── Cart
│       │   │   ├── Navbar
│       │   │   └── CartCard[] (Items)
│       │   ├── Orders
│       │   └── Checkout
│       │
│       └── AdminRoute
│           ├── AdminDashboard
│           │   ├── Product Management
│           │   └── Stats
│           └── ViewUser
│               └── User List
```

---

## 8. Key Data Structures

### User Object
```javascript
{
  id: number,
  name: string,
  email: string,
  role: "USER" | "ADMIN",
  createdAt: timestamp
}
```

### CartItem Object
```javascript
{
  id: number,
  userId: number,
  productId: number,
  quantity: number,
  product: {
    id: number,
    name: string,
    price: number,
    description: string
  }
}
```

### Product Object
```javascript
{
  id: number,
  name: string,
  price: number,
  description: string,
  createdAt: timestamp
}
```

### Order Object
```javascript
{
  id: number,
  userId: number,
  items: CartItem[],
  totalAmount: number,
  address: string,
  status: "PENDING" | "COMPLETED" | "CANCELLED",
  createdAt: timestamp
}
```

---

## 9. Security Flow

```
┌───────────────────┐
│ User Login        │
└────────┬──────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Backend Password Validation     │
│ (PasswordEncoder.encode())      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Generate JWT Token              │
│ (JwtUtil.generateToken())       │
│ Header.Payload.Signature        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Store token in localStorage     │
│ (Frontend)                      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Include token in request header │
│ Authorization: Bearer {token}   │
│ (JwtAuthenticationFilter)       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Verify token on protected APIs  │
│ (Backend validation)            │
└────────┬────────────────────────┘
         │
    ┌────▼────┐
    │ Valid?  │
    └─┬──┬────┘
      │  │
   No │  │ Yes
      │  │
      ▼  ▼
  ┌────────┐  ┌─────────────┐
  │ 401    │  │ Allow access│
  │Unauthorized
  └────────┘  └─────────────┘
```

---

## Summary

**Post-Login Flow:**
1. User authenticates via `/login` endpoint
2. Backend validates credentials & returns JWT token + user object
3. Frontend stores token and sets AuthContext
4. Based on user role:
   - **USER**: Redirected to `/products` → Browse → Add to Cart → Checkout → Order
   - **ADMIN**: Redirected to `/admin/dashboard` → Manage Products/Users
5. All subsequent API calls include JWT token in headers
6. Protected routes verify authentication before rendering
7. Admin routes additionally verify admin role
8. Logout clears token and user state
