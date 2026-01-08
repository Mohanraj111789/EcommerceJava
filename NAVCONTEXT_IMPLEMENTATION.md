# NavContext (CartProvider) Implementation Guide

## 📋 Overview

This guide provides step-by-step instructions to implement the **CartProvider** feature in your e-commerce application. The CartProvider manages the global shopping cart state, including cart count and add-to-cart functionality.

---

## 🎯 What This Feature Does

The NavContext implementation provides:

1. **Global Cart State Management** - Centralized cart count accessible across all components
2. **Add to Cart Functionality** - Method to add products to the user's cart
3. **Cart Count Tracking** - Real-time cart item count display
4. **Automatic Updates** - Cart count updates on login/logout and cart operations
5. **Error Handling** - Robust error management for API failures

---

## 📁 Files Modified/Created

### ✅ Modified Files:
1. `frontend/src/contexts/NavContexts.jsx` - Complete CartProvider implementation
2. `frontend/src/services/api.js` - Added cart service methods

### ✅ Created Files:
1. `NAVCONTEXT_WORKFLOW.md` - Detailed workflow documentation
2. `NAVCONTEXT_IMPLEMENTATION.md` - This implementation guide

---

## 🔧 Implementation Steps

### Step 1: Verify Backend API

Ensure your backend has the following endpoints:

```java
// CartController.java

// Get cart
GET /api/cart/{userId}
Response: { id, userId, items: [...] }

// Add to cart
POST /api/cart/{userId}/add
Body: { productId: number, quantity: number }
Response: { id, userId, items: [...] }
```

**Testing Backend:**
```bash
# Test get cart
curl -X GET http://localhost:8080/api/cart/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test add to cart
curl -X POST http://localhost:8080/api/cart/1/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId": 5, "quantity": 1}'
```

---

### Step 2: Update App.jsx to Include CartProvider

Wrap your application with the CartProvider:

```jsx
// frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/NavContexts'; // ← Add this import

function App() {
  return (
    <AuthProvider>
      <CartProvider>  {/* ← Wrap with CartProvider */}
        <Router>
          <Routes>
            {/* Your routes */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
```

**Important:** CartProvider must be inside AuthProvider because it depends on user authentication.

---

### Step 3: Use CartProvider in Components

#### Example 1: Display Cart Count in Navbar

```jsx
// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/NavContexts';

function Navbar() {
  const { cartCount, loading } = useCart();

  return (
    <nav className="navbar">
      <Link to="/products">Products</Link>
      <Link to="/cart">
        🛒 Cart {loading ? '...' : `(${cartCount})`}
      </Link>
    </nav>
  );
}

export default Navbar;
```

#### Example 2: Add to Cart in Product Card

```jsx
// frontend/src/components/Card.jsx

import React from 'react';
import { useCart } from '../contexts/NavContexts';

function Card({ product }) {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    const success = await addToCart(product.id, 1);
    if (success) {
      alert('Product added to cart!');
    } else {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button 
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default Card;
```

#### Example 3: Refresh Cart Count After Removal

```jsx
// frontend/src/pages/Cart.jsx

import React, { useEffect } from 'react';
import { useCart } from '../contexts/NavContexts';

function Cart() {
  const { cartCount, refreshCartCount } = useCart();

  const handleRemoveItem = async (itemId) => {
    // Remove item via API
    await removeItemFromCart(itemId);
    
    // Refresh cart count
    await refreshCartCount();
  };

  return (
    <div>
      <h2>Your Cart ({cartCount} items)</h2>
      {/* Cart items */}
    </div>
  );
}

export default Cart;
```

---

### Step 4: Update Products Page (If Not Already Done)

Replace local cart state with global CartProvider:

**Before:**
```jsx
const [cartCount, setCartCount] = useState(0);

const addToCart = async (productId) => {
  await axios.post(`http://localhost:8080/api/cart/${userId}/add`, 
    { productId, quantity: 1 }
  );
  loadCartCount();
};
```

**After:**
```jsx
import { useCart } from '../contexts/NavContexts';

function Products() {
  const { cartCount, addToCart } = useCart();

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  return (
    <div>
      <Navbar cartCount={cartCount} />
      {/* Products */}
    </div>
  );
}
```

---

## 🧪 Testing the Implementation

### Test 1: Cart Count on Login

1. Start backend: `cd backend && mvn spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Login to the application
4. **Expected:** Cart count loads automatically
5. **Check:** Browser console should show no errors

### Test 2: Add to Cart

1. Navigate to Products page
2. Click "Add to Cart" on any product
3. **Expected:** 
   - Cart count increases by 1
   - Success message appears
4. **Verify:** Check cart page to see the item

### Test 3: Cart Count Persistence

1. Add items to cart
2. Refresh the page
3. **Expected:** Cart count persists (loaded from backend)

### Test 4: Logout Behavior

1. Add items to cart
2. Logout
3. **Expected:** Cart count resets to 0
4. Login again
5. **Expected:** Cart count loads from backend

### Test 5: Multiple Quantities

```jsx
// Add 3 items at once
await addToCart(productId, 3);
```

**Expected:** Cart count increases by 3

---

## 🐛 Troubleshooting

### Issue 1: Cart Count Not Updating

**Symptoms:** Cart count stays at 0 or doesn't update

**Solutions:**
1. Check if user is logged in: `console.log(user?.id)`
2. Verify JWT token exists: `console.log(localStorage.getItem('token'))`
3. Check browser console for API errors
4. Verify backend is running on port 8080

### Issue 2: "useCart must be used within CartProvider"

**Cause:** Component using `useCart()` is outside CartProvider

**Solution:** Ensure App.jsx wraps components with CartProvider:
```jsx
<AuthProvider>
  <CartProvider>  {/* Must wrap all components using useCart */}
    <YourComponents />
  </CartProvider>
</AuthProvider>
```

### Issue 3: CORS Error

**Symptoms:** API calls fail with CORS error

**Solution:** Update backend SecurityConfig.java:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:5174"
));
```

### Issue 4: Cart Count Shows Wrong Number

**Cause:** Backend returns cart items, but count calculation is wrong

**Solution:** Verify calculation in NavContexts.jsx:
```javascript
const totalCount = data.items.reduce((sum, item) => sum + item.quantity, 0);
```

### Issue 5: Loading State Stuck

**Symptoms:** Loading indicator never disappears

**Solution:** Check for errors in try-catch blocks. The `finally` block should always run:
```javascript
finally {
  setLoading(false);  // This must execute
}
```

---

## 📊 API Service Methods

The `api.js` file now includes these cart methods:

```javascript
import { cartService } from './services/api';

// Get cart
const { success, data } = await cartService.getCart(userId);

// Add to cart
await cartService.addToCart(userId, productId, quantity);

// Update item quantity
await cartService.updateCartItem(userId, itemId, newQuantity);

// Remove item
await cartService.removeCartItem(userId, itemId);

// Clear cart
await cartService.clearCart(userId);

// Get cart count
const { data: count } = await cartService.getCartCount(userId);
```

---

## 🎨 UI Enhancements

### Cart Badge with Animation

```css
/* Navbar.css */
.cart-badge {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  animation: bounce 0.3s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

```jsx
<Link to="/cart" className="cart-badge">
  🛒
  {cartCount > 0 && (
    <span className="cart-count">{cartCount}</span>
  )}
</Link>
```

### Add to Cart Button with Feedback

```jsx
const [addedToCart, setAddedToCart] = useState(false);

const handleAddToCart = async () => {
  const success = await addToCart(product.id, 1);
  if (success) {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }
};

<button 
  onClick={handleAddToCart}
  className={addedToCart ? 'btn-success' : 'btn-primary'}
>
  {addedToCart ? '✓ Added!' : 'Add to Cart'}
</button>
```

---

## 🔐 Security Considerations

1. **JWT Token**: Always include in API requests
   ```javascript
   headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
   }
   ```

2. **User Validation**: Check userId before operations
   ```javascript
   if (!userId) {
     console.error('User not logged in');
     return false;
   }
   ```

3. **Backend Validation**: Backend should verify:
   - User owns the cart
   - Product exists
   - Quantity is valid

---

## 📈 Performance Optimization

### 1. Debounce Cart Count Updates

```javascript
import { debounce } from 'lodash';

const debouncedRefresh = debounce(refreshCartCount, 500);
```

### 2. Cache Cart Data

```javascript
const [cartData, setCartData] = useState(null);

const getCartCount = async () => {
  // Use cached data if available and recent
  if (cartData && Date.now() - cartData.timestamp < 30000) {
    return cartData.count;
  }
  
  // Fetch fresh data
  const data = await fetchCart();
  setCartData({ count: data.count, timestamp: Date.now() });
};
```

### 3. Optimistic Updates

```javascript
const addToCart = async (productId, quantity) => {
  // Optimistically update UI
  setCartCount(prev => prev + quantity);
  
  try {
    await apiCall();
  } catch (error) {
    // Revert on error
    setCartCount(prev => prev - quantity);
  }
};
```

---

## 🚀 Advanced Features

### 1. Add to Cart with Notifications

```jsx
import { toast } from 'react-toastify';

const handleAddToCart = async (product) => {
  const success = await addToCart(product.id, 1);
  if (success) {
    toast.success(`${product.name} added to cart!`);
  } else {
    toast.error('Failed to add to cart');
  }
};
```

### 2. Cart Count Animation

```jsx
const [prevCount, setPrevCount] = useState(0);

useEffect(() => {
  if (cartCount > prevCount) {
    // Trigger animation
    animateCartIcon();
  }
  setPrevCount(cartCount);
}, [cartCount]);
```

### 3. Local Storage Sync

```jsx
useEffect(() => {
  localStorage.setItem('cartCount', cartCount);
}, [cartCount]);
```

---

## 📝 Code Quality Checklist

- [x] Error handling in all async functions
- [x] Loading states for better UX
- [x] User validation before API calls
- [x] Proper TypeScript/JSDoc comments
- [x] Custom hook for easy access
- [x] Dependency array in useEffect
- [x] Token management
- [x] Response validation
- [x] Default parameters
- [x] Cleanup in useEffect (if needed)

---

## 🎓 Learning Resources

### Understanding React Context
- [React Context API Documentation](https://react.dev/reference/react/useContext)
- [Context vs Redux](https://blog.logrocket.com/react-context-api-vs-redux/)

### Cart Management Patterns
- [E-commerce Cart Best Practices](https://www.smashingmagazine.com/2018/01/shopping-cart-best-practices/)
- [State Management in React](https://kentcdodds.com/blog/application-state-management-with-react)

---

## 🤝 Contributing

If you find issues or want to improve this implementation:

1. Check existing issues
2. Create a new branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review the workflow documentation: `NAVCONTEXT_WORKFLOW.md`
3. Check browser console for errors
4. Verify backend logs
5. Create an issue with:
   - Error message
   - Steps to reproduce
   - Expected vs actual behavior

---

## ✅ Implementation Checklist

Use this checklist to track your implementation:

- [ ] Backend CartController has required endpoints
- [ ] NavContexts.jsx is properly implemented
- [ ] api.js has cart service methods
- [ ] App.jsx wraps components with CartProvider
- [ ] Navbar displays cart count
- [ ] Product cards have add to cart functionality
- [ ] Cart page refreshes count after operations
- [ ] Login/logout updates cart count correctly
- [ ] Error handling works properly
- [ ] Loading states display correctly
- [ ] CORS is configured
- [ ] JWT tokens are included in requests
- [ ] All tests pass
- [ ] UI animations work smoothly
- [ ] Documentation is complete

---

## 🎉 Success Criteria

Your implementation is successful when:

✅ Cart count displays correctly in navbar  
✅ Adding items updates count immediately  
✅ Cart count persists across page refreshes  
✅ Logout resets cart count to 0  
✅ Login loads cart count from backend  
✅ Multiple quantities work correctly  
✅ Error messages display for failures  
✅ Loading states prevent duplicate requests  
✅ No console errors appear  
✅ Backend API calls succeed  

---

## 📄 Related Documentation

- `README.md` - Main project documentation
- `WORKFLOW_FLOWCHART.md` - Complete application workflow
- `NAVCONTEXT_WORKFLOW.md` - Detailed NavContext workflow
- Backend API documentation in `CartController.java`

---

**Built with ❤️ for Mohan E-Shop**

Last Updated: January 8, 2026
