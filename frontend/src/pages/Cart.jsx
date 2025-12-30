import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

export default function Cart() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/cart/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const cartData = await response.json();
                setCart(cartData);
                // Fetch product details for each cart item
                await fetchProductDetails(cartData.items || []);
            } else {
                setError('Failed to fetch cart');
            }
        } catch (err) {
            setError('Error fetching cart: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductDetails = async (items) => {
        const token = localStorage.getItem('token');
        const productMap = {};

        for (const item of items) {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${item.productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const product = await response.json();
                    productMap[item.productId] = product;
                }
            } catch (err) {
                console.error(`Error fetching product ${item.productId}:`, err);
            }
        }

        setProducts(productMap);
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const token = localStorage.getItem('token');
            const updatedItems = cart.items.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );

            const response = await fetch(`http://localhost:8080/api/cart/${user.id}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedItems.find(item => item.id === itemId))
            });

            if (response.ok) {
                fetchCart();
            }
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            const updatedItems = cart.items.filter(item => item.id !== itemId);

            // Clear cart and re-add remaining items
            await fetch(`http://localhost:8080/api/cart/${user.id}/clear`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Re-add remaining items
            for (const item of updatedItems) {
                await fetch(`http://localhost:8080/api/cart/${user.id}/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(item)
                });
            }

            fetchCart();
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const clearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your cart?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:8080/api/cart/${user.id}/clear`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            fetchCart();
        } catch (err) {
            console.error('Error clearing cart:', err);
        }
    };

    const calculateItemTotal = (item) => {
        const product = products[item.productId];
        if (!product) return 0;

        let price = product.price;
        if (product.offerPercentage) {
            price = price - (price * product.offerPercentage / 100);
        }

        return price * item.quantity;
    };

    const calculateSubtotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1; // 10% tax
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleCheckout = async () => {
        if (!cart || !cart.items || cart.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const orderData = {
                userId: user.id,
                totalAmount: calculateTotal(),
                items: cart.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: calculateItemTotal(item) / item.quantity
                }))
            };

            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                await clearCart();
                alert('Order placed successfully!');
                navigate('/orders');
            } else {
                alert('Failed to place order');
            }
        } catch (err) {
            alert('Error placing order: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="cart-page">
                <div className="loading">Loading cart...</div>
            </div>
        );
    }

    const cartItems = cart?.items || [];
    const isEmpty = cartItems.length === 0;

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>🛒 Shopping Cart</h1>
                    {!isEmpty && (
                        <button onClick={clearCart} className="btn-clear-cart">
                            Clear Cart
                        </button>
                    )}
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">✗</span>
                        <span>{error}</span>
                    </div>
                )}

                {isEmpty ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started!</p>
                        <button onClick={() => navigate('/products')} className="btn-shop-now">
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cartItems.map((item) => {
                                const product = products[item.productId];
                                if (!product) return null;

                                const itemTotal = calculateItemTotal(item);
                                const hasOffer = product.offerPercentage && product.offerPercentage > 0;

                                return (
                                    <div key={item.id} className="cart-item">
                                        {product.imageUrl && (
                                            <div className="item-image">
                                                <img src={product.imageUrl} alt={product.name} />
                                                {hasOffer && (
                                                    <div className="item-offer-badge">{product.offerPercentage}% OFF</div>
                                                )}
                                            </div>
                                        )}

                                        <div className="item-details">
                                            <h3 className="item-name">{product.name}</h3>
                                            <p className="item-category">{product.category}</p>
                                            <div className="item-price">
                                                {hasOffer ? (
                                                    <>
                                                        <span className="original-price">${product.price.toFixed(2)}</span>
                                                        <span className="discounted-price">
                                                            ${(product.price - (product.price * product.offerPercentage / 100)).toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="price">${product.price.toFixed(2)}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="item-quantity">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="qty-btn"
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="qty-btn"
                                                disabled={item.quantity >= product.stock}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="item-total">
                                            <span className="total-label">Total</span>
                                            <span className="total-price">${itemTotal.toFixed(2)}</span>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="btn-remove"
                                            title="Remove item"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="order-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Tax (10%)</span>
                                <span>${calculateTax().toFixed(2)}</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>

                            <button onClick={handleCheckout} className="btn-checkout">
                                Proceed to Checkout
                            </button>

                            <button onClick={() => navigate('/products')} className="btn-continue">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
