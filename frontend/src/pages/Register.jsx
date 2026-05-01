import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errorHandler";

const countries = [
    "India",
    "China",
    "Nepal",
    "Bangladesh",
    "Pakistan",
    "Sri Lanka",
    "Nigeria",
    "Ghana",
    "Brazil",
    "Mexico",
    "Colombia",
    "Egypt",
    "Turkey",
    "Vietnam",
    "South Korea",
    "Japan",
    "Other",
];

function Register() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        country: "",
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

    function isValidMSUEmail(email) {
        return /^[^\s@]+@montclair\.edu$/.test(email);
    }

    function isStrongPassword(password) {
        return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (!isValidMSUEmail(form.email)) {
            toast.error("Please use a valid @montclair.edu email.");
            return;
        }

        if (!isStrongPassword(form.password)) {
            toast.error(
                "Password must be 8+ characters with one uppercase letter and one number."
            );
            return;
        }

        setLoading(true);

        try {
            const res = await API.post("/auth/register", form);

            login(res.data.user, res.data.token);

            toast.success("Account created successfully!");
            navigate("/");
        } catch (error) {
            toast.error(getErrorMessage(error, "Registration failed"));
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

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                        name="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Tarun Thakur"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                        required
                    />
                </div>

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
                    <label className="text-sm text-gray-600">Country</label>
                    <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-xl px-4 py-3 bg-white"
                        required
                    >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 characters"
                        className="mt-1 w-full border rounded-xl px-4 py-3"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters with one uppercase letter and one
                        number.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-700 text-white py-3 rounded-xl font-medium hover:bg-red-800 disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>
        </div>
    );
}

export default Register;