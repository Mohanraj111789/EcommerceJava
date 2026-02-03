import React, { useEffect, useState } from "react";
import { usePayment } from "../contexts/PaymentContext";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("upi");
  const [walletBalance, setWalletBalance] = useState(null);
  const { handleWallet, payUsingWallet, order } = usePayment();

  // Form states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [emiBank, setEmiBank] = useState("");
  const [emiTenure, setEmiTenure] = useState("");
  const [emiCardNumber, setEmiCardNumber] = useState("");
  const [emiCvv, setEmiCvv] = useState("");
  const [netBank, setNetBank] = useState("");
  const [walletBank, setWalletBank] = useState("");

  const banks = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank"];
  const emiTenures = ["3 Months", "6 Months", "9 Months", "12 Months", "18 Months", "24 Months"];

  useEffect(() => {
    if (method === "wallet") {
      handleWallet()
        .then((balance) => {
          setWalletBalance(balance);
        })
        .catch((err) => {
          console.error("Wallet balance error", err);
        });
    }
  }, [method]);

  const handlePayment = async () => {
    payUsingWallet()
      .then(() => {
        alert("Order Placed Successfully!");
        handleWallet().then((balance) => {
          setWalletBalance(balance);
          navigate("/orders");
        });
      })
      .catch((err) => {
        alert("Payment failed: " + err.message);
      });
  };

  const handleOtherPayment = () => {
    alert("Payment processing... This is a demo.");
    navigate("/orders");
  };

  // Get order details - use stored price breakdown for consistency
  const subTotal = order?.subTotal || order?.totalPrice || 0;
  const discountAmount = order?.discountAmount || 0;
  const deliveryFee = order?.deliveryFee || 0;
  const totalPrice = order?.totalPrice || 0;

  const paymentMethods = [
    { id: "upi", label: "UPI" },
    { id: "card", label: "Credit / Debit Card" },
    { id: "emi", label: "EMI" },
    { id: "netbanking", label: "Net Banking" },
    { id: "wallet", label: "Pay with Wallet" },
  ];

  return (
    <div className="payment-page">
      <h1 className="payment-title">Choose Payment Method</h1>

      <div className="payment-layout">
        {/* Left Sidebar - Payment Method Tabs */}
        <div className="payment-methods-sidebar">
          {paymentMethods.map((item) => (
            <button
              key={item.id}
              className={`payment-method-tab ${method === item.id ? "active" : ""}`}
              onClick={() => setMethod(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Center - Payment Form */}
        <div className="payment-form-section">
          {/* UPI Payment */}
          {method === "upi" && (
            <div className="payment-form-card">
              <div className="payment-form-icon">U</div>
              <h2 className="payment-form-title">UPI</h2>
              <p className="payment-form-subtitle">Pay instantly using your UPI ID</p>

              <div className="payment-form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  placeholder="UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="payment-input"
                />
              </div>

              <div className="payment-btn-group">
                <button className="payment-btn-outline" onClick={handleOtherPayment}>
                  Verify & Pay
                </button>
                <button className="payment-btn-primary" onClick={handleOtherPayment}>
                  Pay Now
                </button>
              </div>
            </div>
          )}

          {/* Card Payment */}
          {method === "card" && (
            <div className="payment-form-card">
              <h2 className="payment-form-title">Credit / Debit Card</h2>
              <p className="payment-form-subtitle">Pay instantly using Brow ID</p>

              <div className="payment-form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="XXXXXXXXXXXX XXXX"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="payment-input"
                  maxLength="19"
                />
              </div>

              <div className="payment-form-row">
                <div className="payment-form-group">
                  <label>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="payment-input"
                    maxLength="5"
                  />
                </div>
                <div className="payment-form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="payment-input"
                    maxLength="3"
                  />
                </div>
              </div>

              <button className="payment-btn-outline full-width" onClick={handleOtherPayment}>
                Proceed to EMI
              </button>
              <button className="payment-btn-primary full-width" onClick={handleOtherPayment}>
                Pay Now
              </button>
            </div>
          )}

          {/* EMI Payment */}
          {method === "emi" && (
            <div className="payment-form-card">
              <h2 className="payment-form-title">EMI</h2>
              <p className="payment-form-subtitle">Pay in easy installments</p>

              <div className="payment-form-group">
                <label>Select a Bank</label>
                <select
                  value={emiBank}
                  onChange={(e) => setEmiBank(e.target.value)}
                  className="payment-select"
                >
                  <option value="">Select a Bank</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div className="payment-form-group">
                <select
                  value={emiTenure}
                  onChange={(e) => setEmiTenure(e.target.value)}
                  className="payment-select"
                >
                  <option value="">Select EMI Tenure</option>
                  {emiTenures.map((tenure) => (
                    <option key={tenure} value={tenure}>{tenure}</option>
                  ))}
                </select>
              </div>

              <div className="payment-form-row">
                <div className="payment-form-group">
                  <input
                    type="text"
                    placeholder="XXXXXXX"
                    value={emiCardNumber}
                    onChange={(e) => setEmiCardNumber(e.target.value)}
                    className="payment-input with-icon"
                  />
                </div>
                <div className="payment-form-group">
                  <input
                    type="password"
                    placeholder="••• CVV"
                    value={emiCvv}
                    onChange={(e) => setEmiCvv(e.target.value)}
                    className="payment-input"
                    maxLength="3"
                  />
                </div>
              </div>

              <button className="payment-btn-outline full-width" onClick={handleOtherPayment}>
                Proceed to EMI
              </button>
              <button className="payment-btn-primary full-width" onClick={handleOtherPayment}>
                Pay Now
              </button>
            </div>
          )}

          {/* Net Banking */}
          {method === "netbanking" && (
            <div className="payment-form-card">
              <h2 className="payment-form-title">Net Banking</h2>
              <p className="payment-form-subtitle">Login your bank</p>

              <div className="payment-form-group">
                <select
                  value={netBank}
                  onChange={(e) => setNetBank(e.target.value)}
                  className="payment-select"
                >
                  <option value="">Select Bank</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <button className="payment-btn-primary full-width" onClick={handleOtherPayment}>
                Pay Now
              </button>
            </div>
          )}

          {/* Wallet Payment */}
          {method === "wallet" && (
            <div className="payment-form-card">
              <h2 className="payment-form-title">Pay with Wallet</h2>
              <p className="payment-form-subtitle">Pay using IBank</p>

              <div className="payment-form-group">
                <select
                  value={walletBank}
                  onChange={(e) => setWalletBank(e.target.value)}
                  className="payment-select"
                >
                  <option value="">Select your Bank</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              {/* Wallet Balance Display */}
              <div className="wallet-balance-card">
                <div className="wallet-balance-info">
                  <span className="wallet-label">Available Balance</span>
                  <span className="wallet-amount">₹{Math.round(walletBalance) || 0}</span>
                </div>
                <button
                  className="add-money-btn"
                  onClick={() => navigate("/add-money")}
                >
                  Add Money
                </button>
              </div>

              <button className="payment-btn-primary full-width" onClick={handlePayment}>
                Pay Now
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar - Price Details */}
        <div className="payment-summary-sidebar">
          <div className="payment-summary-card">
            <h3 className="payment-summary-title">Price Details</h3>

            <div className="payment-summary-row">
              <span>MRP</span>
              <span>₹{Math.round(mrp).toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="payment-summary-row discount">
                <span>Discount</span>
                <span>+₹{Math.round(discount).toLocaleString()}</span>
              </div>
            )}

            <hr className="payment-summary-divider" />

            <div className="payment-summary-row total">
              <span>Total</span>
              <span>₹{Math.round(total).toLocaleString()}</span>
            </div>

            <button className="payment-summary-btn" onClick={handlePayment}>
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
