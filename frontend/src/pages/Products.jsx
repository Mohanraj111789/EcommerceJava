import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

export default function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, searchQuery, selectedCategory, minPrice, maxPrice]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
            } else {
                setError('Failed to fetch products');
            }
        } catch (err) {
            setError('Error fetching products: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/products/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Price range filter
        if (minPrice) {
            filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
        }

        setFilteredProducts(filtered);
    };

    const calculateDiscountedPrice = (price, offerPercentage) => {
        if (!offerPercentage) return price;
        return price - (price * offerPercentage / 100);
    };

    const handleAddToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity: 1 })
            });

            if (response.ok) {
                alert('Added to cart!');
            } else {
                const errorData = await response.text();
                alert('Failed to add to cart: ' + errorData);
            }
        } catch (err) {
            alert('Error adding to cart: ' + err.message);
        }
    };

    const handleBuyNow = async (productId) => {
        await handleAddToCart(productId);
        navigate('/cart');
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
    };

    return (
        <div className="products-page">
            <div className="products-container">
                <div className="products-header">
                    <h1>🛍️ Shop Our Products</h1>
                    <p>Discover amazing deals and offers</p>
                </div>

                {/* Filters Section */}
                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="🔍 Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filters-row">
                        <div className="filter-group">
                            <label>Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Min Price</label>
                            <input
                                type="number"
                                placeholder="$0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="filter-input"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="filter-group">
                            <label>Max Price</label>
                            <input
                                type="number"
                                placeholder="$999"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="filter-input"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <button onClick={clearFilters} className="btn-clear-filters">
                            Clear Filters
                        </button>
                    </div>

                    <div className="results-count">
                        Showing {filteredProducts.length} of {products.length} products
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">✗</span>
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="no-products">
                        <p>No products found matching your criteria.</p>
                        <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                {product.offerPercentage && product.offerPercentage > 0 && (
                                    <div className="offer-badge">{product.offerPercentage}% OFF</div>
                                )}

                                {product.imageUrl && (
                                    <div className="product-image">
                                        <img src={product.imageUrl} alt={product.name} />
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
                                                    <span className="original-price">${product.price?.toFixed(2)}</span>
                                                    <span className="discounted-price">
                                                        ${calculateDiscountedPrice(product.price, product.offerPercentage).toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="product-price">${product.price?.toFixed(2)}</span>
                                            )}
                                        </div>
                                        <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>

                                    <div className="product-actions">
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            className="btn-add-cart"
                                            disabled={product.stock === 0}
                                        >
                                            🛒 Add to Cart
                                        </button>
                                        <button
                                            onClick={() => handleBuyNow(product.id)}
                                            className="btn-buy-now"
                                            disabled={product.stock === 0}
                                        >
                                            ⚡ Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
