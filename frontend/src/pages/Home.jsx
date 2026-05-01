import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [events, setEvents] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    async function fetchDashboardData() {
        try {
            const [jobsRes, eventsRes, postsRes] = await Promise.all([
                API.get("/jobs"),
                API.get("/events"),
                API.get("/community/posts"),
            ]);

            setJobs(jobsRes.data.slice(0, 3));
            setEvents(eventsRes.data.slice(0, 3));
            setPosts(postsRes.data.slice(0, 2));
        } catch (error) {
            console.error("Dashboard load failed:", error);
        }
    }

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
                    Find jobs, events, visa guidance, community support, and AI-powered
                    help in one platform built for international students.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    {user ? (
                        <>
                            <Link
                                to="/jobs"
                                className="bg-red-700 text-white px-5 py-3 rounded-xl text-center font-medium hover:bg-red-800"
                            >
                                Explore Jobs
                            </Link>
                            <Link
                                to="/hawk-ai"
                                className="border border-gray-300 px-5 py-3 rounded-xl text-center font-medium hover:bg-gray-50"
                            >
                                Ask Hawk AI
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="bg-red-700 text-white px-5 py-3 rounded-xl text-center font-medium hover:bg-red-800"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="border border-gray-300 px-5 py-3 rounded-xl text-center font-medium hover:bg-gray-50"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {user && (
                <>
                    <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <StatCard label="Latest Jobs" value={jobs.length} />
                        <StatCard label="Upcoming Events" value={events.length} />
                        <StatCard label="Community Posts" value={posts.length} />
                        <StatCard label="Account" value="Active" success />
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DashboardPanel title="Latest Jobs" link="/jobs" linkText="View all jobs">
                            {jobs.length === 0 ? (
                                <EmptyText text="No jobs added yet." />
                            ) : (
                                jobs.map((job) => (
                                    <MiniItem
                                        key={job._id}
                                        title={job.title}
                                        subtitle={`${job.org} • ${job.pay || "Pay not listed"}`}
                                        badge={job.cpt ? "CPT OK" : job.type}
                                    />
                                ))
                            )}
                        </DashboardPanel>

                        <DashboardPanel
                            title="Upcoming Events"
                            link="/events"
                            linkText="View all events"
                        >
                            {events.length === 0 ? (
                                <EmptyText text="No events added yet." />
                            ) : (
                                events.map((event) => (
                                    <MiniItem
                                        key={event._id}
                                        title={event.title}
                                        subtitle={`${event.location} • ${event.date}`}
                                        badge={event.type}
                                    />
                                ))
                            )}
                        </DashboardPanel>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Community Highlights</h2>
                                <Link to="/community" className="text-sm text-red-700 font-medium">
                                    Open community
                                </Link>
                            </div>

                            {posts.length === 0 ? (
                                <EmptyText text="No community posts yet." />
                            ) : (
                                <div className="space-y-3">
                                    {posts.map((post) => (
                                        <div key={post.id} className="border rounded-xl p-4">
                                            <p className="font-semibold">{post.name}</p>
                                            <p className="text-sm text-gray-600 mt-1">{post.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-gradient-to-br from-red-700 via-red-800 to-red-950 text-white p-6 rounded-2xl shadow-lg border border-red-800">
                            <h2 className="text-xl font-bold">Need help?</h2>
                            <p className="mt-3 text-white/90 leading-relaxed">
                                Ask Hawk AI about CPT, OPT, jobs, events, or campus support.
                            </p>

                            <Link
                                to="/hawk-ai"
                                className="mt-5 inline-block bg-white text-red-700 px-5 py-3 rounded-xl font-semibold shadow hover:bg-red-50 transition"
                            >
                                Chat with Hawk AI
                            </Link>
                        </div>
                    </section>
                </>
            )}

            {!user && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FeatureCard
                        title="Personalized Jobs"
                        text="Find on-campus roles, CPT-friendly internships, and recommended opportunities."
                    />
                    <FeatureCard
                        title="Visa Guidance"
                        text="Get simple CPT, OPT, F-1, and campus support guidance through Hawk AI."
                    />
                    <FeatureCard
                        title="Student Community"
                        text="Connect with other international students, share advice, and ask questions."
                    />
                </section>
            )}
        </div>
    );
}

function StatCard({ label, value, success }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <p className="text-sm text-gray-500">{label}</p>
            <h2
                className={`text-3xl font-bold mt-2 ${
                    success ? "text-green-700" : "text-gray-900"
                }`}
            >
                {value}
            </h2>
        </div>
    );
}

function DashboardPanel({ title, link, linkText, children }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <Link to={link} className="text-sm text-red-700 font-medium">
                    {linkText}
                </Link>
            </div>

            <div className="space-y-3">{children}</div>
        </div>
    );
}

function MiniItem({ title, subtitle, badge }) {
    return (
        <div className="border rounded-xl p-4 flex justify-between gap-3">
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            </div>

            <span className="h-fit text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full capitalize">
        {badge}
      </span>
        </div>
    );
}

function FeatureCard({ title, text }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-gray-600">{text}</p>
        </div>
    );
}

function EmptyText({ text }) {
    return <p className="text-gray-500">{text}</p>;
}

export default Home;