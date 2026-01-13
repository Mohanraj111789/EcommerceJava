import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar1 from '../components/Navbar1';
import './Orders.css';
import axios from 'axios';

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/orders/user/${user.id}/products`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const data = await response.data;
                setOrders(data);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (err) {
            console.log(err);
            setError('Error fetching orders: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': '#f59e0b',
            'CONFIRMED': '#3b82f6',
            'SHIPPED': '#8b5cf6',
            'DELIVERED': '#10b981',
            'CANCELLED': '#ef4444'
        };
        return colors[status] || '#64748b';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="orders-page">
                <div className="loading">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <Navbar1/>
            <div className="orders-container">
                <div className="orders-header">
                    <h1>📦 My Orders</h1>
                    <p>Track and manage your orders</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">✗</span>
                        <span>{error}</span>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <div className="no-orders-icon">📦</div>
                        <h2>No orders yet</h2>
                        <p>Start shopping to see your orders here!</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>Order #{order.id}</h3>
                                        <p className="order-date">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div
                                        className="order-status"
                                        style={{ backgroundColor: getStatusColor(order.name) }}
                                    >
                                        {order.name}
                                    </div>
                                </div>

                                <div className="order-details">
                                    <div className="order-items">
                                        <h4>Items</h4>
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            <ul>
                                                {order.orderItems.map((item, index) => (
                                                    <li key={index}>
                                                        Product ID: {item.productId} - Quantity: {item.quantity} - ${item.price.toFixed(2)}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No items</p>
                                        )}
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
