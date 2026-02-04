import React, { useEffect, useState } from "react";
import { usePayment } from "../contexts/PaymentContext";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("upi");
  const [walletBalance, setWalletBalance] = useState(0);

  const { handleWallet, payUsingWallet, order } = usePayment();

  // ---------- FORM STATES ----------
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [emiBank, setEmiBank] = useState("");
  const [netBank, setNetBank] = useState("");

  const banks = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank"];

  // ---------- FETCH WALLET BALANCE ----------
  const refreshWalletBalance = async () => {
    try {
      const balance = await handleWallet();
      setWalletBalance(balance || 0);
    } catch (err) {
      console.error("Wallet balance error", err);
    }
  };

  useEffect(() => {
    if (method === "wallet") {
      refreshWalletBalance();
    }
  }, [method]);

  // Fetch balance once on page load
  useEffect(() => {
    refreshWalletBalance();
  }, []);

  // Refresh wallet when user comes back from /add-money
  useEffect(() => {
    const handleFocus = () => {
      if (method === "wallet") {
        refreshWalletBalance();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [method]);

  // ---------- PAYMENT HANDLER ----------
  const handlePayment = async () => {
    try {
      if (method === "wallet" && walletBalance < totalPrice) {
        alert("Insufficient wallet balance. Please add money.");
        return;
      }

      await payUsingWallet();
      alert("Order Placed Successfully!");
      navigate("/orders");
    } catch (err) {
      alert("Payment failed: " + err.message);
    }
  };

  const handleOtherPayment = () => {
    alert("Payment processing... This is a demo.");
    navigate("/orders");
  };

  // ---------- PRICE DETAILS (SAFE VERSION) ----------
  const subTotal = order?.subTotal ?? order?.totalPrice ?? 0;
  const discountAmount = order?.discountAmount ?? 0;
  const deliveryFee = order?.deliveryFee ?? 0;
  const totalPrice = order?.totalPrice ?? 0;

  const paymentMethods = [
    { id: "upi", label: "UPI" },
    { id: "card", label: "Credit / Debit Card" },
    { id: "emi", label: "EMI" },
    { id: "netbanking", label: "Net Banking" },
    { id: "wallet", label: "Pay with Wallet" },
  ];

  // ---------- LOADING STATE (IMPORTANT FIX) ----------
  if (order === null) {
    return (
      <div className="payment-page">
        <h2>Loading payment details...</h2>
      </div>
    );
  }

  // ---------- EDGE CASE (ONLY IF ORDER TRULY MISSING) ----------
  if (!order) {
    return (
      <div className="payment-page">
        <h2>No active order found.</h2>
        <button onClick={() => navigate("/cart")}>Go Back to Cart</button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h1 className="payment-title">Choose Payment Method</h1>

      <div className="payment-layout">
        {/* LEFT SIDEBAR */}
        <div className="payment-methods-sidebar">
          {paymentMethods.map((item) => (
            <button
              key={item.id}
              className={`payment-method-tab ${
                method === item.id ? "active" : ""
              }`}
              onClick={() => setMethod(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CENTER - PAYMENT FORMS */}
        <div className="payment-form-section">
          {/* UPI */}
          {method === "upi" && (
            <div className="payment-form-card">
              <h2>UPI</h2>
              <input
                type="text"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="payment-input"
              />
              <button
                className="payment-btn-primary full-width"
                onClick={handleOtherPayment}
              >
                Pay Now
              </button>
            </div>
          )}

          {/* CARD */}
          {method === "card" && (
            <div className="payment-form-card">
              <h2>Credit / Debit Card</h2>
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="payment-input"
              />
              <button
                className="payment-btn-primary full-width"
                onClick={handleOtherPayment}
              >
                Pay Now
              </button>
            </div>
          )}

          {/* EMI */}
          {method === "emi" && (
            <div className="payment-form-card">
              <h2>EMI</h2>
              <select
                value={emiBank}
                onChange={(e) => setEmiBank(e.target.value)}
                className="payment-select"
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <button
                className="payment-btn-primary full-width"
                onClick={handleOtherPayment}
              >
                Pay Now
              </button>
            </div>
          )}

          {/* NET BANKING */}
          {method === "netbanking" && (
            <div className="payment-form-card">
              <h2>Net Banking</h2>
              <select
                value={netBank}
                onChange={(e) => setNetBank(e.target.value)}
                className="payment-select"
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <button
                className="payment-btn-primary full-width"
                onClick={handleOtherPayment}
              >
                Pay Now
              </button>
            </div>
          )}

          {/* WALLET */}
          {method === "wallet" && (
            <div className="payment-form-card">
              <h2>Pay with Wallet</h2>

              <div className="wallet-balance-card">
                <span className="wallet-balance-label">
                  Available Balance:
                </span>
                <span className="wallet-balance-value">
                  ₹{Math.round(walletBalance).toLocaleString()}
                </span>
              </div>

              <button
                className="payment-btn-outline full-width"
                onClick={() => navigate("/add-money")}
              >
                Add Money
              </button>

              <button
                className="payment-btn-primary full-width"
                onClick={handlePayment}
              >
                Pay Now
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR - PRICE DETAILS */}
        <div className="payment-summary-sidebar">
          <div className="payment-summary-card">
            <h3>Price Details</h3>

            <div className="payment-summary-row">
              <span>MRP</span>
              <span>₹{Math.round(subTotal).toLocaleString()}</span>
            </div>

            {discountAmount > 0 && (
              <div className="payment-summary-row discount">
                <span>Discount</span>
                <span>
                  -₹{Math.round(discountAmount).toLocaleString()}
                </span>
              </div>
            )}

            <div className="payment-summary-row">
              <span>Delivery Fee</span>
              <span>
                ₹{Math.round(deliveryFee).toLocaleString()}
              </span>
            </div>

            <hr />

            <div className="payment-summary-row total">
              <span>Total</span>
              <span>
                ₹{Math.round(totalPrice).toLocaleString()}
              </span>
            </div>

            <button
              className="payment-summary-btn"
              onClick={handlePayment}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
