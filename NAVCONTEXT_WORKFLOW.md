# NavContext (CartProvider) Workflow Flowchart

## Overview
The `NavContext.jsx` file implements a **CartProvider** that manages the global shopping cart state across the application. It provides methods to add items to the cart and retrieve the cart count, making it accessible to all components through React Context.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Root                        │
│                        (App.jsx)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    AuthProvider                             │
│              (Manages User Authentication)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    CartProvider                             │
│              (NavContexts.jsx - This File)                  │
│                                                             │
│  State:                                                     │
│  - cartCount: number                                        │
│  - loading: boolean                                         │
│                                                             │
│  Methods:                                                   │
│  - addToCart(productId, quantity)                          │
│  - getCartCount()                                           │
│  - refreshCartCount()                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              All Child Components                           │
│  (Products, Navbar, Cart, etc.)                            │
│  Access via: useCart() hook                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Structure

### File: `NavContexts.jsx`

```
NavContexts.jsx
├── Imports
│   ├── React (createContext, useContext, useState, useEffect)
│   └── useAuth (from AuthContext)
│
├── CartContext (Context Object)
│
├── CartProvider (Component)
│   ├── State Variables
│   │   ├── cartCount (number)
│   │   └── loading (boolean)
│   │
│   ├── Methods
│   │   ├── getCartCount()
│   │   ├── addToCart(productId, quantity)
│   │   └── refreshCartCount()
│   │
│   ├── useEffect Hook
│   │   └── Loads cart count on user change
│   │
│   └── Context Provider
│       └── Provides value to children
│
└── useCart (Custom Hook)
    └── Returns context value
```

---

## Method 1: `getCartCount()` - Workflow

```
┌─────────────────────────┐
│  Component calls        │
│  getCartCount()         │
└───────────┬─────────────┘
            │
            ▼
    ┌───────────────┐
    │ Check userId  │
    └───────┬───────┘
            │
       ┌────▼────┐
       │ userId? │
       └─┬──┬────┘
         │  │
      No │  │ Yes
         │  │
         ▼  │
    ┌──────────┐
    │Set count │
    │to 0      │
    │Return    │
    └──────────┘
            │
            ▼
    ┌─────────────────────────────┐
    │ setLoading(true)            │
    └───────────┬─────────────────┘
                │
                ▼
    ┌─────────────────────────────┐
    │ Get JWT token from          │
    │ localStorage                │
    └───────────┬─────────────────┘
                │
                ▼
    ┌─────────────────────────────┐
    │ API Call:                   │
    │ GET /api/cart/{userId}      │
    │                             │
    │ Headers:                    │
    │ - Content-Type: JSON        │
    │ - Authorization: Bearer     │
    └───────────┬─────────────────┘
                │
           ┌────▼────┐
           │Response │
           │  OK?    │
           └─┬──┬────┘
             │  │
          No │  │ Yes
             │  │
             ▼  ▼
    ┌──────────────┐  ┌─────────────────────────┐
    │ Throw Error  │  │ Parse response JSON     │
    │              │  │ data = { items: [...] } │
    └──────┬───────┘  └───────────┬─────────────┘
           │                      │
           │                      ▼
           │          ┌─────────────────────────┐
           │          │ Calculate total count:  │
           │          │ items.reduce(           │
           │          │   (sum, item) =>        │
           │          │   sum + item.quantity   │
           │          │ )                       │
           │          └───────────┬─────────────┘
           │                      │
           │                      ▼
           │          ┌─────────────────────────┐
           │          │ setCartCount(totalCount)│
           │          └───────────┬─────────────┘
           │                      │
           │                      ▼
           │          ┌─────────────────────────┐
           │          │ return totalCount       │
           │          └───────────┬─────────────┘
           │                      │
           ▼                      ▼
    ┌──────────────────────────────────┐
    │ catch (error)                    │
    │ - console.error()                │
    │ - setCartCount(0)                │
    │ - return 0                       │
    └───────────┬──────────────────────┘
                │
                ▼
    ┌─────────────────────────────┐
    │ finally                     │
    │ setLoading(false)           │
    └─────────────────────────────┘
```

### API Response Structure:
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "productId": 5,
      "quantity": 2,
      "product": {
        "id": 5,
        "name": "Product Name",
        "price": 99.99
      }
    },
    {
      "id": 2,
      "productId": 8,
      "quantity": 1,
      "product": { ... }
    }
  ]
}
```

### Count Calculation:
```javascript
// If items = [{quantity: 2}, {quantity: 1}, {quantity: 3}]
// totalCount = 2 + 1 + 3 = 6
const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
```

---

## Method 2: `addToCart(productId, quantity)` - Workflow

```
┌─────────────────────────────────┐
│  Component calls                │
│  addToCart(productId, quantity) │
│  (quantity defaults to 1)       │
└───────────┬─────────────────────┘
            │
            ▼
    ┌───────────────┐
    │ Check userId  │
    └───────┬───────┘
            │
       ┌────▼────┐
       │ userId? │
       └─┬──┬────┘
         │  │
      No │  │ Yes
         │  │
         ▼  │
    ┌──────────────┐
    │console.error │
    │return false  │
    └──────────────┘
            │
            ▼
    ┌─────────────────────────────┐
    │ setLoading(true)            │
    └───────────┬─────────────────┘
                │
                ▼
    ┌─────────────────────────────┐
    │ Get JWT token from          │
    │ localStorage                │
    └───────────┬─────────────────┘
                │
                ▼
    ┌─────────────────────────────┐
    │ API Call:                   │
    │ POST /api/cart/{userId}/add │
    │                             │
    │ Headers:                    │
    │ - Content-Type: JSON        │
    │ - Authorization: Bearer     │
    │                             │
    │ Body:                       │
    │ {                           │
    │   "productId": productId,   │
    │   "quantity": quantity      │
    │ }                           │
    └───────────┬─────────────────┘
                │
           ┌────▼────┐
           │Response │
           │  OK?    │
           └─┬──┬────┘
             │  │
          No │  │ Yes
             │  │
             ▼  ▼
    ┌──────────────┐  ┌─────────────────────────┐
    │ Throw Error  │  │ Parse response JSON     │
    │              │  │ data = updated cart     │
    └──────┬───────┘  └───────────┬─────────────┘
           │                      │
           │                      ▼
           │          ┌─────────────────────────┐
           │          │ Call getCartCount()     │
           │          │ to refresh count        │
           │          └───────────┬─────────────┘
           │                      │
           │                      ▼
           │          ┌─────────────────────────┐
           │          │ return true             │
           │          │ (Success)               │
           │          └───────────┬─────────────┘
           │                      │
           ▼                      ▼
    ┌──────────────────────────────────┐
    │ catch (error)                    │
    │ - console.error()                │
    │ - return false                   │
    └───────────┬──────────────────────┘
                │
                ▼
    ┌─────────────────────────────┐
    │ finally                     │
    │ setLoading(false)           │
    └─────────────────────────────┘
```

### Backend Processing (CartController.java):

```
┌─────────────────────────────┐
│ Receive POST request        │
│ /api/cart/{userId}/add      │
└───────────┬─────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Validate request body:      │
│ - productId exists?         │
│ - quantity > 0?             │
└───────────┬─────────────────┘
            │
       ┌────▼────┐
       │ Valid?  │
       └─┬──┬────┘
         │  │
      No │  │ Yes
         │  │
         ▼  │
    ┌──────────────┐
    │ Return 400   │
    │ Bad Request  │
    └──────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Find cart by userId         │
│ If not exists, create new   │
└───────────┬─────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Check if product already    │
│ exists in cart items        │
└───────────┬─────────────────┘
            │
       ┌────▼────────┐
       │ Exists?     │
       └─┬──┬────────┘
         │  │
      No │  │ Yes
         │  │
         │  ▼
         │  ┌─────────────────────┐
         │  │ Update quantity:    │
         │  │ existing.quantity   │
         │  │ += new.quantity     │
         │  └─────────────────────┘
         │
         ▼
    ┌─────────────────────┐
    │ Create new CartItem │
    │ - productId         │
    │ - quantity          │
    │ - cart reference    │
    │ Add to cart.items   │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │ Save cart to DB     │
    │ (JPA Repository)    │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │ Return updated cart │
    │ with all items      │
    └─────────────────────┘
```

---

## Method 3: `refreshCartCount()` - Workflow

```
┌─────────────────────────┐
│  Component calls        │
│  refreshCartCount()     │
└───────────┬─────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Call getCartCount() │
    │ (Reuses Method 1)   │
    └─────────────────────┘
```

**Use Case:** When cart is updated from another component (e.g., Cart page removes item), other components can call `refreshCartCount()` to update the displayed count.

---

## useEffect Hook - Auto-load Cart Count

```
┌─────────────────────────┐
│  CartProvider mounts    │
│  OR userId changes      │
└───────────┬─────────────┘
            │
            ▼
    ┌───────────────┐
    │ useEffect     │
    │ triggered     │
    └───────┬───────┘
            │
       ┌────▼────┐
       │ userId? │
       └─┬──┬────┘
         │  │
      No │  │ Yes
         │  │
         ▼  ▼
    ┌──────────┐  ┌─────────────────┐
    │Set count │  │ Call            │
    │to 0      │  │ getCartCount()  │
    └──────────┘  └─────────────────┘
```

**Dependency Array:** `[userId]`
- Runs when component mounts
- Runs when userId changes (login/logout)

---

## Context Usage Pattern

### 1. Wrap App with CartProvider

```jsx
// App.jsx
import { CartProvider } from './contexts/NavContexts';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Routes */}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
```

### 2. Use in Components

```jsx
// Products.jsx
import { useCart } from '../contexts/NavContexts';

function Products() {
  const { cartCount, addToCart, loading } = useCart();

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Added to cart!');
    }
  };

  return (
    <div>
      <Navbar cartCount={cartCount} />
      {/* Product cards */}
      <button onClick={() => handleAddToCart(5)}>
        Add to Cart
      </button>
    </div>
  );
}
```

### 3. Display Cart Count

```jsx
// Navbar.jsx
import { useCart } from '../contexts/NavContexts';

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav>
      <Link to="/cart">
        🛒 Cart ({cartCount})
      </Link>
    </nav>
  );
}
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    User Action                               │
│              (Click "Add to Cart" button)                    │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                Products Component                            │
│  const { addToCart } = useCart();                           │
│  await addToCart(productId, 1);                             │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                CartProvider (NavContexts.jsx)                │
│  addToCart(productId, quantity) {                           │
│    1. Validate userId                                        │
│    2. Make API call                                          │
│    3. Update cart count                                      │
│  }                                                           │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                Backend API                                   │
│  POST /api/cart/{userId}/add                                │
│  CartController.addItem()                                   │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                Database (MySQL)                              │
│  - Find or create Cart for userId                           │
│  - Add/Update CartItem                                       │
│  - Save changes                                              │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                Response to Frontend                          │
│  { id, userId, items: [...] }                               │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                CartProvider                                  │
│  - Calls getCartCount()                                      │
│  - Updates cartCount state                                   │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                All Subscribed Components                     │
│  - Navbar: Shows updated count                              │
│  - Products: Shows success                                   │
│  - Cart: Can refresh if needed                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Scenario 1: User Not Logged In

```
addToCart(5, 1)
    │
    ├─ userId = undefined
    │
    └─► console.error('User not logged in')
        return false
```

### Scenario 2: Network Error

```
addToCart(5, 1)
    │
    ├─ API call fails
    │
    └─► catch (error)
        │
        ├─ console.error('Error adding to cart:', error)
        ├─ setLoading(false)
        └─ return false
```

### Scenario 3: Invalid Product

```
addToCart(999, 1)  // Product doesn't exist
    │
    ├─ Backend returns 400/404
    │
    └─► response.ok = false
        │
        └─► throw new Error('Failed to add to cart')
            │
            └─► catch block
                return false
```

---

## State Management

### CartProvider State Variables

| Variable   | Type    | Initial Value | Description                          |
|------------|---------|---------------|--------------------------------------|
| cartCount  | number  | 0             | Total items in cart                  |
| loading    | boolean | false         | Loading state for async operations   |

### Context Value Object

```javascript
{
  cartCount: 0,           // Current cart count
  loading: false,         // Loading indicator
  addToCart: Function,    // Add item to cart
  getCartCount: Function, // Fetch cart count
  refreshCartCount: Function // Refresh count
}
```

---

## Integration Points

### 1. AuthContext Integration
```javascript
const { user } = useAuth();
const userId = user?.id;
```
- Depends on AuthContext for user information
- Must be wrapped inside AuthProvider

### 2. API Service Integration
```javascript
// Uses fetch API directly
fetch(`http://localhost:8080/api/cart/${userId}/add`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ productId, quantity })
})
```

### 3. Component Integration
```javascript
// Any component can use:
import { useCart } from './contexts/NavContexts';

const { cartCount, addToCart, loading } = useCart();
```

---

## Best Practices Implemented

1. **Error Handling**: Try-catch blocks with proper error logging
2. **Loading States**: Prevents duplicate requests
3. **User Validation**: Checks userId before API calls
4. **Automatic Updates**: Refreshes count after operations
5. **Custom Hook**: `useCart()` for easy access
6. **Type Safety**: JSDoc comments for method parameters
7. **Dependency Management**: useEffect with proper dependencies
8. **Token Management**: Retrieves JWT from localStorage
9. **Response Validation**: Checks response.ok before processing
10. **Default Parameters**: quantity defaults to 1

---

## Testing Scenarios

### Test 1: Add to Cart
```javascript
// User clicks "Add to Cart" on product ID 5
await addToCart(5, 1);

// Expected:
// 1. API call to POST /api/cart/1/add
// 2. Backend adds item
// 3. getCartCount() called
// 4. cartCount updated
// 5. Returns true
```

### Test 2: Get Cart Count
```javascript
// On component mount
useEffect(() => {
  getCartCount();
}, [userId]);

// Expected:
// 1. API call to GET /api/cart/1
// 2. Response: { items: [{quantity: 2}, {quantity: 3}] }
// 3. Calculate: 2 + 3 = 5
// 4. setCartCount(5)
```

### Test 3: User Logout
```javascript
// User logs out
logout();

// Expected:
// 1. userId becomes null
// 2. useEffect triggers
// 3. setCartCount(0)
```

---

## Summary

The **NavContexts.jsx** file provides a centralized cart management system using React Context API. It offers:

✅ **Global State**: Cart count accessible across all components  
✅ **Add to Cart**: Method to add products with quantity  
✅ **Get Cart Count**: Fetches and calculates total items  
✅ **Auto-refresh**: Updates count on user login/logout  
✅ **Error Handling**: Robust error management  
✅ **Loading States**: Prevents race conditions  
✅ **Easy Integration**: Custom `useCart()` hook  

This implementation follows React best practices and integrates seamlessly with the existing authentication system and backend API.
