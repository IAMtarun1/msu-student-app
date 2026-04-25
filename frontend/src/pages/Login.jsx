import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await API.post("/auth/login", {
                email,
                password,
            });

            login(res.data.user, res.data.token);

            setMessage({
                type: "success",
                text: "Login successful! Redirecting to your dashboard...",
            });

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Login failed. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-600 mb-6">Login with your MSU account.</p>

            {message && (
                <div
                    className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium ${
                        message.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600">MSU Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@montclair.edu"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                        required
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-red-700 text-white py-3 rounded-xl font-medium disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;