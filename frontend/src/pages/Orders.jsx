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
    console.log(orders);

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
    <>
    <Navbar1/>
    <div className="orders-page">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="empty-text">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="order-card">
            {/* Order Header */}
            <div className="order-header">
              <div>
                <p className="order-id">
                  Order ID: <span>#{order.order_id}</span>
                </p>
                <p className="order-address">{order.address}</p>
              </div>

              <span
                className={`order-status ${order.status}`}
              >
                {order.status}
              </span>
            </div>

            {/* Product Section */}
            <div className="order-product">
              <img
                src={order.imageUrl? `/assets/${order.imageUrl}` : '/assets/product.jpg'}
                alt={order.name}
                className="product-image"
              />

              <div className="product-info">
                <h4 className="product-name">{order.name}</h4>
                <p className="product-price">₹{order.price}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="order-footer">
              <span className="order-total">
                Total: ₹{order.price}
              </span>
              <button className="view-btn">View Details</button>
            </div>
          </div>
        ))
      )}
    </div>
    </>
    );
}
