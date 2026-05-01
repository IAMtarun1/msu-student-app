import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ConfirmModal from "./components/ConfirmModal";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Events from "./pages/Events";
import Community from "./pages/Community";
import HawkAI from "./pages/HawkAI";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";

function App() {
    const [showConfirm, setShowConfirm] = useState(false);

    function confirmLogout() {
        setShowConfirm(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-100">
                    <Navbar onLogoutClick={() => setShowConfirm(true)} />

                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                borderRadius: "12px",
                                padding: "12px 16px",
                                fontSize: "14px",
                            },
                        }}
                    />

                    <ConfirmModal
                        open={showConfirm}
                        onCancel={() => setShowConfirm(false)}
                        onConfirm={confirmLogout}
                    />

                    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route
                                path="/admin"
                                element={
                                    <AdminRoute>
                                        <Admin />
                                    </AdminRoute>
                                }
                            />                            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                            <Route path="/hawk-ai" element={<ProtectedRoute><HawkAI /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;