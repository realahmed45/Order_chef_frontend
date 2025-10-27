import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Pricing from "./components/Pricing";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={logout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route
            path="/login"
            element={
              !user ? <Login onLogin={login} /> : <Navigate to="/onboarding" />
            }
          />
          <Route
            path="/register"
            element={
              !user ? (
                <Register onLogin={login} />
              ) : (
                <Navigate to="/onboarding" />
              )
            }
          />
          <Route
            path="/onboarding"
            element={
              user ? (
                <Onboarding user={user} onUpdateUser={updateUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
