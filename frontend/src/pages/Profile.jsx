import { useState } from "react";
import toast from "react-hot-toast";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

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

function Profile() {
    const { user, login } = useAuth();
    const [editing, setEditing] = useState(false);

    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        country: user?.country || "",
        profileImage: user?.profileImage || "",
    });

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleUpdate(e) {
        e.preventDefault();

        try {
            const res = await API.put("/auth/profile", form);
            const token = localStorage.getItem("token");

            login(res.data, token);
            setEditing(false);

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Profile update failed");
        }
    }

    function handleCancel() {
        setEditing(false);
        setForm({
            fullName: user?.fullName || "",
            country: user?.country || "",
            profileImage: user?.profileImage || "",
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-gray-600 mt-2">
                            View and manage your MSU international student profile.
                        </p>
                    </div>

                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="bg-red-700 text-white px-5 py-3 rounded-xl font-medium hover:bg-red-800"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4 mb-8">
                    {(editing ? form.profileImage : user?.profileImage) ? (
                        <img
                            src={editing ? form.profileImage : user.profileImage}
                            alt={user?.fullName}
                            className="h-20 w-20 rounded-full object-cover border"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-3xl font-bold">
                            {user?.fullName?.charAt(0)}
                        </div>
                    )}

                    <div>
                        <h2 className="text-2xl font-bold">
                            {editing ? form.fullName : user?.fullName}
                        </h2>
                        <p className="text-gray-500">{user?.email}</p>
                        {editing && (
                            <p className="text-sm text-gray-400 mt-1">
                                Profile photo updates live from the URL below.
                            </p>
                        )}
                    </div>
                </div>

                {!editing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ProfileItem label="Full Name" value={user?.fullName} />
                        <ProfileItem label="MSU Email" value={user?.email} />
                        <ProfileItem label="Country" value={user?.country || "Not added"} />
                        <ProfileItem label="Account Status" value="Active" success />
                        <ProfileItem label="Student Type" value="International Student" />
                        <ProfileItem label="Program" value="Computer Science MS" />
                        <ProfileItem
                            label="Profile Picture"
                            value={user?.profileImage ? "Added" : "Not added"}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div>
                            <label className="text-sm text-gray-600">
                                Profile Picture URL
                            </label>
                            <input
                                name="profileImage"
                                value={form.profileImage}
                                onChange={handleChange}
                                placeholder="Paste image URL"
                                className="mt-1 w-full border rounded-xl px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Full Name</label>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-xl px-4 py-3"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">MSU Email</label>
                            <input
                                value={user?.email || ""}
                                disabled
                                className="mt-1 w-full border rounded-xl px-4 py-3 bg-gray-100 text-gray-500"
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

                        <div className="flex gap-3">
                            <button className="bg-red-700 text-white px-5 py-3 rounded-xl font-medium hover:bg-red-800">
                                Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="border px-5 py-3 rounded-xl font-medium hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function ProfileItem({ label, value, success }) {
    return (
        <div className="bg-gray-50 border rounded-xl p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p
                className={`text-lg font-semibold mt-1 ${
                    success ? "text-green-700" : "text-gray-900"
                }`}
            >
                {value}
            </p>
        </div>
    );
}

export default Profile;