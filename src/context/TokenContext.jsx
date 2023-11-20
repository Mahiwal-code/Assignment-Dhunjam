// TokenContext.js
import { createContext, useContext, useState } from "react";

const TokenContext = createContext();
const TOKEN_KEY = "authToken";
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const setGlobalToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  return (
    <TokenContext.Provider value={{ token, setGlobalToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
