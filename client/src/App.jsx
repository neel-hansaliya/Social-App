import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Messages from "./pages/Message.jsx";
import Profile from "./pages/Profile.jsx"; // personal profile
import UserProfile from "./pages/Uprofile.jsx"; // other users' profile
import ProtectedRoute from "./components/ProctedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

// OPTIONAL: if you use MUI, import CssBaseline for consistent styling reset
import { CssBaseline } from "@mui/material";

export default function App() {
  return (
    <div className="min-h-screen text-black">
      {/* Add CssBaseline if you use MUI */}
      <CssBaseline />
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          {/* Personal Profile */}
          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/* Other User Profile */}
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
