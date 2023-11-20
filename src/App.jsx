import "./App.css";
import LoginPage from "./components/Login";
import AdminDashboard from "./components/Admin";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navigate } from "react-router-dom";
import { useAuthGuard } from "./utils/AuthGuard";
import { useToken } from "./context/TokenContext";
import { useState } from "react";

function ProtectedRoute({ element }) {
  const isAuthenticated = useAuthGuard();

  // Redirect to login if not authenticated
  return isAuthenticated ? element : <Navigate to="/" />;
}

function App() {
  const { _, setGlobalToken } = useToken();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState(-1);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://stg.dhunjam.in/account/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        // Handle error, e.g., show an error message
        console.error("Login failed:", response.statusText);
        return;
      }

      const data = await response.json();
      const newToken = data.data.token;
      setId(data.data.id);

      // Set the token globally
      setGlobalToken(newToken);

      return newToken;
      // You may want to store the token in the state or in a global state management solution
    } catch (error) {
      console.error("An error occurred during login:", error.message);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              handleLogin={handleLogin}
              username={username}
              password={password}
              setPassword={setPassword}
              setUsername={setUsername}
            />
          }
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<AdminDashboard id={id} />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
