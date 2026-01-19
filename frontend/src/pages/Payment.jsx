// Payment.jsx
import React, { useState } from "react";
import "./payment.css";

export default function Payment() {
  const [method, setMethod] = useState("upi");

  return (
    <div className="payment-container">
      {/* LEFT SECTION */}
      <div className="payment-left">
        <h2 className="title">Complete Payment</h2>

        <div className="methods">
          <div
            className={method === "upi" ? "method active" : "method"}
            onClick={() => setMethod("upi")}
          >
            UPI
          </div>

          <div
            className={method === "card" ? "method active" : "method"}
            onClick={() => setMethod("card")}
          >
            Credit / Debit Card
          </div>

          <div
            className={method === "emi" ? "method active" : "method"}
            onClick={() => setMethod("emi")}
          >
            EMI
          </div>

          <div
            className={method === "netbanking" ? "method active" : "method"}
            onClick={() => setMethod("netbanking")}
          >
            Net Banking
          </div>

          {/* NEW WALLET OPTION */}
          <div
            className={method === "wallet" ? "method active" : "method"}
            onClick={() => setMethod("wallet")}
          >
            Pay with Wallet
          </div>
        </div>

        <div className="payment-box">
          {method === "upi" && (
            <>
              <h3>Add new UPI ID</h3>
              <input placeholder="Enter your UPI ID" />
              <button className="btn">Verify & Pay</button>
            </>
          )}

          {method === "card" && (
            <>
              <h3>Card Payment</h3>
              <input placeholder="Card Number" />
              <input placeholder="Expiry MM/YY" />
              <input placeholder="CVV" />
              <button className="btn">Pay Now</button>
            </>
          )}

          {method === "wallet" && (
            <>
              <h3>Wallet Balance</h3>
              <div className="wallet-box">
                <p>Available Balance</p>
                <h2>₹3,500</h2>
              </div>
              <button className="btn">Pay using Wallet</button>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="payment-right">
        <h3>Price Details</h3>
        <div className="row">
          <span>MRP</span>
          <span>₹44,990</span>
        </div>
        <div className="row discount">
          <span>Discount</span>
          <span>-₹16,000</span>
        </div>
        <hr />
        <div className="row total">
          <span>Total Amount</span>
          <span>₹29,126</span>
        </div>
      </div>
    </div>
  );
}

