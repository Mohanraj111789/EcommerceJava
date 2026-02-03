import React, { useEffect, useState } from "react";
import { usePayment } from "../contexts/PaymentContext";
import { useNavigate } from "react-router-dom";
import "./AddMoney.css";

export default function AddMoney() {
  const [amount, setAmount] = useState(1000);
  const presetAmounts = [500, 1000, 2000, 5000];
  const { addMoneyToWallet, handleWallet } = usePayment();
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddMoney = async () => {
    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setLoading(true);
    addMoneyToWallet(amount)
      .then(() => {
        alert("Money added successfully!");
        handleWallet().then((balance) => {
          setWalletBalance(balance);
        });
      })
      .catch((err) => {
        alert("Failed to add money: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleWallet().then((balance) => {
      setWalletBalance(balance);
    });
  }, []);

  const handleContinue = () => {
    navigate("/payment");
  };

  return (
    <div className="add-money-page">
      <div className="add-money-container">
        {/* Header */}
        <div className="add-money-header">
          <div className="wallet-icon">💳</div>
          <h1>ECOM Wallet</h1>
          <p>Add money to your wallet for faster checkout</p>
        </div>

        {/* Balance Card */}
        <div className="balance-card">
          <div className="balance-info">
            <span className="balance-label">Current Balance</span>
            <span className="balance-amount">₹{walletBalance.toLocaleString()}</span>
          </div>
          <div className="balance-icon">💰</div>
        </div>

        {/* Add Money Form */}
        <div className="add-money-form">
          <h3>Add Money</h3>

          {/* Amount Input */}
          <div className="amount-input-box">
            <label>Enter Amount</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0"
                min="1"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="quick-amount-buttons">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                className={`quick-btn ${amount === amt ? "active" : ""}`}
                onClick={() => setAmount(amt)}
              >
                ₹{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <p className="info-text">
            💡 Add money now for quick 1-click payments on your next purchase
          </p>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="add-btn"
              onClick={handleAddMoney}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Money"}
            </button>
            <button className="continue-btn" onClick={handleContinue}>
              ← Back to Payment
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="wallet-info">
          <div className="info-item">
            <span className="info-icon">🔒</span>
            <span>100% Secure Payments</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⚡</span>
            <span>Instant Credit</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🎁</span>
            <span>Cashback Offers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
