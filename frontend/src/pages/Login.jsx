import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errorHandler";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/login", form);

            login(res.data.user, res.data.token);

            toast.success(`Welcome back, ${res.data.user.fullName.split(" ")[0]}!`);
            navigate("/");
        } catch (error) {
            toast.error(getErrorMessage(error, "Login failed"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-600 mb-6">Login with your MSU account.</p>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600">MSU Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="yourname@montclair.edu"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-700 text-white py-3 rounded-xl font-medium hover:bg-red-800 disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;