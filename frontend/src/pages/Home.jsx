import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <section className="bg-white rounded-2xl shadow-sm p-6 md:p-10 border">
                <p className="text-sm font-semibold text-red-700">
                    Montclair State University
                </p>

                <h1 className="mt-3 text-3xl md:text-5xl font-bold text-gray-900 max-w-3xl">
                    {user
                        ? `Welcome back, ${user.fullName?.split(" ")[0]} 👋`
                        : "Your guide to international student life at MSU."}
                </h1>

                <p className="mt-4 text-gray-600 max-w-2xl">
                    Find jobs, events, visa guidance, and community support in one
                    centralized platform built for international students.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    {user ? (
                        <>
                            <Link
                                to="/jobs"
                                className="bg-red-700 text-white px-5 py-3 rounded-xl text-center font-medium"
                            >
                                Explore Jobs
                            </Link>
                            <Link
                                to="/hawk-ai"
                                className="border border-gray-300 px-5 py-3 rounded-xl text-center font-medium"
                            >
                                Ask Hawk AI
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="bg-red-700 text-white px-5 py-3 rounded-xl text-center font-medium"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="border border-gray-300 px-5 py-3 rounded-xl text-center font-medium"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {user && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <p className="text-sm text-gray-500">Account</p>
                        <h2 className="text-xl font-semibold mt-2">{user.fullName}</h2>
                        <p className="text-gray-600 mt-1">{user.email}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <p className="text-sm text-gray-500">Country</p>
                        <h2 className="text-xl font-semibold mt-2">
                            {user.country || "Not added"}
                        </h2>
                        <p className="text-gray-600 mt-1">International student profile</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <p className="text-sm text-gray-500">Status</p>
                        <h2 className="text-xl font-semibold mt-2 text-green-700">
                            Active
                        </h2>
                        <p className="text-gray-600 mt-1">Logged in securely</p>
                    </div>
                </section>
            )}

            <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h2 className="text-xl font-semibold">Personalized Jobs</h2>
                    <p className="mt-2 text-gray-600">
                        Find on-campus roles, CPT-friendly internships, and recommended
                        opportunities.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h2 className="text-xl font-semibold">Visa Guidance</h2>
                    <p className="mt-2 text-gray-600">
                        Get simple CPT, OPT, F-1, and campus support guidance through Hawk
                        AI.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h2 className="text-xl font-semibold">Student Community</h2>
                    <p className="mt-2 text-gray-600">
                        Connect with other international students, share advice, and ask
                        questions.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Home;