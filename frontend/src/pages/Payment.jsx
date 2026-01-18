import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
// import "../styles/payment.css";

const Payment = () => {


  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Checkout</h2>

        <div className="summary">
          <p>Order Total</p>
          <h1>₹ </h1>
        </div>

        <button onClick={handlePayment} disabled={loading} className="pay-btn">
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {<p className="status"></p>}
      </div>
    </div>
  );
};

export default Payment;
