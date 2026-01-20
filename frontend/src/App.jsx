import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/NavContexts';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ViewUser from './pages/ViewUser';
import Checkout from './pages/Checkout';
import { NotFound } from './components/NotFound';
import ProductDetails from './pages/ProductDetails';
import Wallet from './pages/wallet';
import Payment from './pages/Payment';
import { PaymentProvider } from './contexts/PaymentContext';
import AddMoney from './pages/AddMoney';


// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Admin-only Route component
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return children;
}

function App() {
  return (
    <PaymentProvider>
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/products" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <ViewUser />
                </AdminRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/not-found"
              element={<NotFound />}
            />
            <>
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/payment" element={<Payment/>}/>
              <Route path="/add-money" element={<AddMoney/>}/>
            </>
          </Routes>

        </Router>
      </CartProvider>
    </AuthProvider>
    </PaymentProvider>
  );
}

export default App;