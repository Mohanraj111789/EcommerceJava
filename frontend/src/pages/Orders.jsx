import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar1 from "../components/Navbar1";
import "./Orders.css";
import axios from "axios";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:8080/api/orders/user/${user.id}/orders`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setOrders(res.data);
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar1 />

      <div className="orders-page">
        <h2 className="orders-title">My Orders</h2>

        {orders
          .filter((o) => o.status !== "PENDING_PAYMENT")
          .map((order) => (
            <div className="order-card" key={order.orderId}>

              {/* LEFT */}
              <div className="order-left">
                <div className="order-box">
                    <div className="product-image-container">
                      <img
                        src={
                          order.imageUrl
                            ? `/assets/${order.imageUrl}`
                            : `/assets/product.jpg`
                        }
                        className="product-image"
                        alt={order.name}
                      />
                    </div>

                </div>

                <div>
                  <h4 className="product-name">{order.productName}</h4>
                  <p className="items">Items: 1</p>
                </div>
              </div>

              {/* MIDDLE */}
              <div className="order-middle">
                <p className="store">GreatStack</p>
                <p>{order.address}</p>
                <p>City, State</p>
                <p>0123456789</p>
              </div>

              {/* RIGHT */}
              <div className="order-right">
                <h3 className="price">₹{order.totalPrice}</h3>

                <div className="info-row">
                  <span className="dot green">✔</span>
                  Method: COD
                </div>

                <div className="info-row">
                  <span className="dot blue">📅</span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>

                <div className="info-row">
                  <span className="dot orange">⏳</span>
                  Payment:{order.status}
                </div>
              </div>

            </div>
          ))}
      </div>
    </>
  );
}
