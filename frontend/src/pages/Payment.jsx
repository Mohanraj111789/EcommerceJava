import React, { useState } from "react";
import "./Payment.css";

export default function Payment() {
  const [method, setMethod] = useState("upi");

  return (
    <div className="payment-container1">
      <div className="payment-left">
        <div className="title1">
          <h1>Choose Payment Method</h1>
        </div>
        <div className="method-container">

        <div className="methods1">
          {["upi", "card", "emi", "netbanking", "wallet"].map((item) => (
            <div
              key={item}
              className={`method ${method === item ? "active" : ""}`}
              onClick={() => setMethod(item)}
            >
              {item === "upi" && "UPI"}<br></br>
              {item === "card" && "Credit / Debit Card"}
              {item === "emi" && "EMI"}
              {item === "netbanking" && "Net Banking"}
              {item === "wallet" && "Pay with Wallet"}
            </div>
          ))}
        </div>

        <div className="payment-box1">
          {method === "upi" && (
            <>
              <h3>Add new UPI ID</h3>
              <input placeholder="Enter your UPI ID" />
              <button className="btn1">Verify & Pay</button>
            </>
          )}

          {method === "card" && (
            <>
              <h3>Card Payment</h3>
              <input placeholder="Card Number" />
              <input placeholder="Expiry MM/YY" />
              <input placeholder="CVV" />
              <button className="btn1">Pay Now</button>
            </>
          )}

          {method === "wallet" && (
            <>
              <h3 className="h3">Wallet Balance</h3>
              <div className="wallet-box">
                <p>Available Balance</p>
                <h2>₹3,500</h2>
              </div>
              <button className="btn1">Pay using Wallet</button>
            </>
          )}
          </div>
        </div>
      </div>

      <div className="payment-right">
        <h3>Price Details</h3>

        <div className="row1">
          <span>MRP</span>
          <span>₹44,990</span>
        </div>

        <div className="row1 discount1">
          <span>Discount</span>
          <span>-₹16,000</span>
        </div>

        <hr />

        <div className="row1 total1">
          <span>Total Amount</span>
          <span>₹29,126</span>
        </div>
      </div>
    </div>
  );
}
