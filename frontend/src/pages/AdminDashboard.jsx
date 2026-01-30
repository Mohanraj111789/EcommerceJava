import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { usePayment } from '../contexts/PaymentContext';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { handleWallet } = usePayment();

    const BASEURL = 'https://ecommercejava-2.onrender.com/api';
    const token = localStorage.getItem('token');

    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(true);
    const [revenueLoading, setRevenueLoading] = useState(true);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [totalRevenue, setTotalRevenue] = useState(0);

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        imageUrl: '',
        offerPercentage: ''
    });

    /* ---------------- HELPERS ---------------- */

    const formatIndianPrice = (value) =>
        Number(value || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const calculateDiscountedPrice = (price, offer) => {
        if (!offer) return price;
        return price - (price * offer) / 100;
    };

    /* ---------------- API CALLS ---------------- */

    useEffect(() => {
        fetchProducts();
        fetchTotalRevenue();
    }, []);

    const fetchProducts = async () => {
        try {
            setProductLoading(true);
            const res = await fetch(`${BASEURL}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setProductLoading(false);
        }
    };

    const fetchTotalRevenue = async () => {
        try {
            setRevenueLoading(true);
            const res = await handleWallet();
            setTotalRevenue(Number(res || 0));
        } catch {
            setError('Failed to fetch revenue');
        } finally {
            setRevenueLoading(false);
        }
    };

    /* ---------------- CRUD ---------------- */

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                offerPercentage: newProduct.offerPercentage
                    ? parseInt(newProduct.offerPercentage)
                    : null
            };

            const res = await fetch(`${BASEURL}/admin/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error();

            setSuccess('Product added successfully');
            setShowAddForm(false);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                stock: '',
                category: '',
                imageUrl: '',
                offerPercentage: ''
            });

            fetchProducts();
        } catch {
            setError('Add product failed');
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...editingProduct,
                price: parseFloat(editingProduct.price),
                stock: parseInt(editingProduct.stock),
                offerPercentage: editingProduct.offerPercentage
                    ? parseInt(editingProduct.offerPercentage)
                    : null
            };

            await fetch(`${BASEURL}/admin/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            setSuccess('Product updated');
            setShowEditModal(false);
            fetchProducts();
        } catch {
            setError('Update failed');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;

        try {
            await fetch(`${BASEURL}/admin/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Product deleted');
            setTimeout(() => setSuccess(null), 3000);
            fetchProducts();
        } catch {
            setError('Delete failed');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="admin-dashboard">

            <div className="admin-header">
                <h1>🎯 Admin Dashboard</h1>
                <div>
                    Welcome, {user?.name}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="admin-actions">
                <button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : 'Add Product'}
                </button>

                <button onClick={() => navigate('/admin/users')}>
                    View Users
                </button>

                <h2>
                    Total Revenue: ₹
                    {revenueLoading
                        ? 'Loading...'
                        : formatIndianPrice(totalRevenue)}
                </h2>
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            {/* PRODUCTS */}
            <div className="products-grid">
                {productLoading ? (
                    <p>Loading products...</p>
                ) : (
                    products.map((p) => (
                        <div key={p.id} className="product-card">

                            <h3>{p.name}</h3>
                            <p>{p.category}</p>

                            <p>
                                ₹{formatIndianPrice(
                                    p.offerPercentage
                                        ? calculateDiscountedPrice(p.price, p.offerPercentage)
                                        : p.price
                                )}
                            </p>

                            <p>Stock: {p.stock}</p>

                            <button onClick={() => {
                                setEditingProduct(p);
                                setShowEditModal(true);
                            }}>
                                Edit
                            </button>

                            <button onClick={() => handleDeleteProduct(p.id)}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
