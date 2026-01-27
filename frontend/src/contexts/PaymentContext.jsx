import { createContext, useContext, useState,useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";


const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {

 
  const [loading, setLoading] = useState(false);
  const API_URL = "https://ecommercejava-2.onrender.com/api";

  // ---------------------------
  // SET ORDER AFTER CHECKOUT
  // ---------------------------
  const setOrderDetails = (orderData) => {
    setOrder(orderData);
  };
//   useEffect(() => {
//   const savedOrder = localStorage.getItem("currentOrder");
//   if (savedOrder) {
//     setOrder(JSON.parse(savedOrder));
//   }
// }, []);
const order = JSON.parse(localStorage.getItem("currentOrder"));



  // ---------------------------
  // WALLET PAYMENT
  // ---------------------------
  const payUsingWallet = async () => {
    if (!order) {
      throw new Error("Order not found");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/payment/transfer`,
        {
          amount: order.totalPrice
        },
        {
          headers: {
            "Idempotency-Key": uuidv4(),
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      // if(!response.ok)
      // {
      //   return response.data;
      // }

      // ✅ UPDATE ORDER STATUS
      await axios.put(
        `${API_URL}/payment/update/${order.id}?status=PAID`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      localStorage.removeItem("currentOrder");


      return response.data;

    } catch (error) {
      console.error("Payment failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // GET WALLET BALANCE
  // ---------------------------
  const handleWallet = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/wallet/balance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      return response.data;

    } catch (error) {
      console.error("Wallet fetch failed:", error);
      throw error;
    }
  };

  // ---------------------------
  // ADD MONEY TO WALLET
  // ---------------------------
  const addMoneyToWallet = async (amount) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/wallet/add-money`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      return response.data;

    } catch (error) {
      console.error("Add money failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        order,
        setOrderDetails,
        payUsingWallet,
        handleWallet,
        addMoneyToWallet,
        loading
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
