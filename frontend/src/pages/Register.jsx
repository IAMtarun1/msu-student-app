import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        country: "",
    });

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await API.post("/auth/register", form);

            login(res.data.user, res.data.token);

            setMessage({
                type: "success",
                text: "Account created successfully! Redirecting...",
            });

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Registration failed.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border">
            <h1 className="text-3xl font-bold mb-2">Create account</h1>
            <p className="text-gray-600 mb-6">
                Use your Montclair State email to join.
            </p>

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

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        type="text"
                        placeholder="Tarun Thakur"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">MSU Email</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="yourname@montclair.edu"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Country</label>
                    <input
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        type="text"
                        placeholder="India"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Minimum 8 characters"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                        required
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-red-700 text-white py-3 rounded-xl font-medium disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>
        </div>
    );
}

export default Register;