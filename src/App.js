import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./Components/Register";
import Home from "./Pages/Home";
import Login from "./Components/Login";
import ThankYouPage from "./Components/ThankYouPage";
import ForgotPassword from "./Components/ForgotPassword";
import Account from "./Components/Account";
import HomePage from "./Components/HomePage";
import Player from "./Components/Player";
import { Text } from "./Components/Text";
import { Text2 } from "./Components/Text2";
import { UpdatePassword } from "./Components/UpdatePassword";
import { PodCast } from "./Components/PodCast";
import './App.css';
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("is_logged_in");
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router basename={process.env.REACT_APP_BASENAME}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<UpdatePassword />} />
        <Route path="/account" element={<Account />} />


        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/read-advanced"
          element={
            <ProtectedRoute>
              <Text />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/read"
          element={
            <ProtectedRoute>
              <Text2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/listen"
          element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/podcasts"
          element={
            <ProtectedRoute>
              <PodCast />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
