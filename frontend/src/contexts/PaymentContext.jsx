import { createContext, useContext, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // SET ORDER AFTER CHECKOUT
  // ---------------------------
  const setOrderDetails = (orderData) => {
    setOrder(orderData);
  };

  // ---------------------------
  // WALLET PAYMENT (FIXED)
  // ---------------------------
  const payUsingWallet = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/payment/transfer",

        // ✅ BODY
        {
          amount: order.totalAmount
        },

        // ✅ CONFIG
        {
          headers: {
            "Idempotency-Key": uuidv4(),
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      console.log("Payment success:", response.data);

      return response.data;

    } catch (error) {
      console.error("Payment failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleWallet = async() =>
  {
    try{
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/wallet/balance",
        {
          headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      console.log("Wallet balance:", response.data);
      return response.data;
    }catch(error){
      console.error("Wallet payment failed:", error);
      throw error;
    }
  };
  const AddMoneytoWallet = async(Amount)=>
  {
    try{
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/wallet/add-money",
        {
          amount:Amount
        },
        {
          headers:
          {
            "Content-Type":"application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,

          }
        }
      )
    }catch(error){
          console.error("Add money failed:", error);
          throw error;
        }
        finally{
          setLoading(false);
        }
  }

  return (
    <PaymentContext.Provider
      value={{
        order,
        setOrderDetails,
        payUsingWallet,
        handleWallet,
        loading,
        AddMoneytoWallet
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
