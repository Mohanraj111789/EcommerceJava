import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const BASEURL = 'http://localhost:8080/api';
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        imageUrl: '',
        offerPercentage: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASEURL}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                setError('Failed to fetch products');
            }
        } catch (err) {
            setError('Error fetching products: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            const productData = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                offerPercentage: newProduct.offerPercentage ? parseInt(newProduct.offerPercentage) : null
            };

            const response = await fetch(`${BASEURL}/admin/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                setSuccess('Product added successfully!');
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
            } else {
                const errorData = await response.text();
                setError('Failed to add product: ' + errorData);
            }
        } catch (err) {
            setError('Error adding product: ' + err.message);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            const productData = {
                ...editingProduct,
                price: parseFloat(editingProduct.price),
                stock: parseInt(editingProduct.stock),
                offerPercentage: editingProduct.offerPercentage ? parseInt(editingProduct.offerPercentage) : null,
                imageUrl: editingProduct.imageUrl || ''
                
            };

            const response = await fetch(`${BASEURL}/admin/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            console.log(productData);

            if (response.ok) {
                setSuccess('Product updated successfully!');
                setShowEditModal(false);
                setEditingProduct(null);
                fetchProducts();
            } else {
                const errorData = await response.text();
                setError('Failed to update product: ' + errorData);
            }
        } catch (err) {
            setError('Error updating product: ' + err.message);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASEURL}/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                //show 3000ms success message
                setSuccess('Product deleted successfully!');
                setTimeout(() => { setSuccess(null); }, 3000);
                fetchProducts();
            } else {
                const errorData = await response.text();
                setError('Failed to delete product: ' + errorData);
            }
        } catch (err) {
            setError('Error deleting product: ' + err.message);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleInputChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleEditInputChange = (e) => {
        setEditingProduct({
            ...editingProduct,
            [e.target.name]: e.target.value
        });
    };

    const openEditModal = (product) => {
        setEditingProduct({ ...product });
        setShowEditModal(true);
    };

    const calculateDiscountedPrice = (price, offerPercentage) => {
        if (!offerPercentage) return price;
        return price - (price * offerPercentage / 100);
    };


    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="admin-header-content">
                    <h1>🎯 Admin Dashboard</h1>
                    <div className="admin-user-info">
                        <span className="admin-welcome">Welcome, {user?.name}</span>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </div>
                </div>
            </div>

            <div className="admin-container">
                
                <div className="admin-actions">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-add-product"
                    >
                        {showAddForm ? '✕ Cancel' : '+ Add New Product'}
                    </button>
                    {/* navigate after click user button*/}
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="btn-add-product"
                    >
                        👥 View Users
                        
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">✗</span>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <span className="alert-icon">✓</span>
                        <span>{success}</span>
                    </div>
                )}

                {showAddForm && (
                    <div className="add-product-form">
                        <h2>Add New Product</h2>
        
                        <form onSubmit={handleAddProduct}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newProduct.name}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={newProduct.category}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter category"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    className="form-textarea"
                                    placeholder="Enter product description"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Price (&#8377;)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newProduct.price}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={newProduct.stock}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Offer % (Optional)</label>
                                    <input
                                        type="number"
                                        name="offerPercentage"
                                        value={newProduct.offerPercentage}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={newProduct.imageUrl}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <button type="submit" className="btn-submit">
                                Add Product
                            </button>
                        </form>
                    </div>
                )}

                {/* Edit Product Modal */}
                {showEditModal && editingProduct && (
                    <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Edit Product</h2>
                                <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
                            </div>
                            <form onSubmit={handleUpdateProduct}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editingProduct.name}
                                            onChange={handleEditInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={editingProduct.category}
                                            onChange={handleEditInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        value={editingProduct.description}
                                        onChange={handleEditInputChange}
                                        className="form-textarea"
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Price (&#8377;)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={editingProduct.price}
                                            onChange={handleEditInputChange}
                                            className="form-input"
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Stock Quantity</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={editingProduct.stock}
                                            onChange={handleEditInputChange}
                                            className="form-input"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Offer % (0-100)</label>
                                        <input
                                            type="number"
                                            name="offerPercentage"
                                            value={editingProduct.offerPercentage || ''}
                                            onChange={handleEditInputChange}
                                            className="form-input"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={editingProduct.imageUrl || ''}
                                        onChange={handleEditInputChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-submit">
                                        Update Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="products-section">
                    <h2>Product List ({products.length})</h2>

                    {loading ? (
                        <div className="loading">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="no-products">No products found. Add your first product!</div>
                    ) : (
                        <div className="products-grid">
                            {products.map((product) => (
                                <div key={product.id} className="product-card">
                                    {product.offerPercentage && product.offerPercentage > 0 && (
                                        <div className="offer-badge">{product.offerPercentage}% OFF</div>
                                    )}
                                    {product.imageUrl && (
                                        <div className="product-image-container">
                                            <img src={`../assets/${product.imageUrl}`} alt={product.name} className="product-image" />
                                        </div>
                                    )}
                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-category">{product.category}</p>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-details">
                                            <div className="price-section">
                                                {product.offerPercentage && product.offerPercentage > 0 ? (
                                                    <>
                                                        <span className="product-price original-price">${product.price?.toFixed(2)}</span>
                                                        <span className="product-price discounted-price">
                                                        ${calculateDiscountedPrice(product.price, product.offerPercentage).toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="product-price">&#8377;{product.price?.toFixed(2)}</span>
                                                )}
                                            </div>
                                            <span className="product-stock">Stock: {product.stock}</span>
                                        </div>
                                        <div className="product-actions">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="btn-edit"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="btn-delete"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
