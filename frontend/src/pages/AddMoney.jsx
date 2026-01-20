import React, { useEffect, useState } from "react";
import { usePayment } from "../contexts/PaymentContext";
import "./AddMoney.css";

export default function AddMoney() {
  const [amount, setAmount] = useState(3290);
  const presetAmounts = [3282, 3290, 10, 50];
  const {AddMoneytoWallet,handleWallet} = usePayment();
  const [walletbalance,setWalletbalance] = useState(0);

  const handleAddMoney = async()=>{
    AddMoneytoWallet(amount).then(()=>{
      alert("Money added successfully");
    }).catch((err)=>{
      alert("Failed to add money");
    });
  };
  useEffect(()=>{
    handleWallet().then((balance)=>{
      setWalletbalance(balance);
    })
  },[handleWallet]);


  return (
    <div className="wallet-container">
      {/* HEADER */}
      <div className="wallet-header">
        <h2>ECOMP Wallet</h2>
      </div>

      {/* CONTENT */}
      <div className="wallet-body">
        <h3>Add Money</h3>

        <div className="balance">
          <span>Amazon Pay Balance</span>
          <strong>₹{walletbalance}</strong>
        </div>

        {/* AMOUNT INPUT */}
        <div className="amount-box">
          <label>Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* QUICK BUTTONS */}
        <div className="quick-amounts">
          {presetAmounts.map((amt, index) => (
            <button
              key={index}
              className={amount === amt ? "active" : ""}
              onClick={() => setAmount(amt)}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <p className="info">
          Recommended amount to make your next transaction in 1-click
        </p>

        <button className="continue-btn" onClick={handleAddMoney}>Add Money</button>
      </div>
    </div>
  );
}
