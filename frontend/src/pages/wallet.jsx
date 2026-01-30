import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar1 from "../components/Navbar1";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchBalance = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/wallet/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBalance(res.data);
    } catch (err) {
      alert("Failed to load wallet");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleAddMoney = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/wallet/add-money",
        { amount: amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAmount("");
      fetchBalance();
      alert("Money added successfully");


    } catch (err) {
      alert("Failed to add money");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar1/>
      <p style={{ color: "red" }}>NAVBAR TEST</p>

    <div className="wallet-container">
      <div className="wallet-card">
        <h2>My Wallet</h2>

        <div className="balance-box">
          <p>Available Balance</p>
          <h1>₹ {balance}</h1>
        </div>

        <div className="add-money">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={handleAddMoney} disabled={loading}>
            {loading ? "Processing..." : "Add Money"}
          </button>
        </div>
      </div>
    </div>
    </>

  );
};

export default Wallet;
