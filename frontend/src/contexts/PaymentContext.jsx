import { createContext, useContext, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const API_URL = "https://ecommercejava-2.onrender.com/api";

  // Get order from localStorage
  const order = JSON.parse(localStorage.getItem("currentOrder"));

  // ---------------------------
  // SET ORDER AFTER CHECKOUT
  // ---------------------------
  const setOrderDetails = (orderData) => {
    localStorage.setItem("currentOrder", JSON.stringify(orderData));
  };

  // ---------------------------
  // CLEAR CART AFTER PURCHASE
  // ---------------------------
  const clearCartAfterPurchase = async (userId) => {
    try {
      await axios.delete(`${API_URL}/cart/${userId}/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // ---------------------------
  // REDUCE PRODUCT STOCK
  // ---------------------------
  const reduceProductStock = async (productId, quantity) => {
    try {
      await axios.put(
        `${API_URL}/products/${productId}/reduce-stock`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to reduce stock:", error);
    }
  };

  // ---------------------------
  // WALLET PAYMENT
  // ---------------------------
  const payUsingWallet = async () => {
    if (!order) {
      throw new Error("Order not found");
    }

    try {
      setLoading(true);

      // Process payment transfer
      const response = await axios.post(
        `${API_URL}/payment/transfer`,
        {
          amount: parseFloat(order.totalPrice),
        },
        {
          headers: {
            "Idempotency-Key": uuidv4(),
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update order status to PAID
      await axios.put(
        `${API_URL}/payment/update/${order.id}?status=PAID`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Handle post-payment actions based on purchase type
      if (order.isBuyNow) {
        // Single product purchase - reduce stock
        await reduceProductStock(order.productId, order.quantity || 1);
      } else if (order.items && order.items.length > 0) {
        // Full cart purchase - reduce stock for all items and clear cart
        for (const item of order.items) {
          await reduceProductStock(item.productId, item.quantity);
        }
        await clearCartAfterPurchase(order.userId);
      }

      // Clear the current order from localStorage
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
      const response = await axios.get(`${API_URL}/wallet/balance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
        clearCartAfterPurchase,
        reduceProductStock,
        loading,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
