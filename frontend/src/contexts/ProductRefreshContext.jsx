import React, { createContext, useContext, useState } from "react";

const ProductRefreshContext = createContext();

export const ProductRefreshProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    console.log("🔄 Triggering product refresh across all components");
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ProductRefreshContext.Provider
      value={{
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </ProductRefreshContext.Provider>
  );
};

export const useProductRefresh = () => {
  const context = useContext(ProductRefreshContext);
  if (!context) {
    throw new Error("useProductRefresh must be used within ProductRefreshProvider");
  }
  return context;
};
