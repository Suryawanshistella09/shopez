import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import AdminRoute from './routes/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import './index.css';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Customer Routes with Navbar */}
              <Route path="/" element={<><Navbar /><Home /></>} />
              <Route path="/products" element={<><Navbar /><Products /></>} />
              <Route path="/products/:id" element={<><Navbar /><ProductDetails /></>} />
              <Route path="/cart" element={<><Navbar /><Cart /></>} />
              <Route path="/checkout" element={<><Navbar /><Checkout /></>} />
              <Route path="/orders" element={<><Navbar /><Orders /></>} />
              <Route path="/orders/:id/tracking" element={<><Navbar /><OrderTracking /></>} />
              <Route path="/profile" element={<><Navbar /><Orders /></>} />

              {/* Admin Routes - Protected with AdminNavbar */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/edit/:id" element={<AdminProductForm />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
