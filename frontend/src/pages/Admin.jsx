import { useEffect, useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/errorHandler";

function Admin() {
    const [jobs, setJobs] = useState([]);
    const [events, setEvents] = useState([]);

    const [stats, setStats] = useState({
        users: 0,
        jobs: 0,
        events: 0,
        posts: 0,
    });

    const [jobSearch, setJobSearch] = useState("");
    const [eventSearch, setEventSearch] = useState("");

    const [editingJobId, setEditingJobId] = useState(null);
    const [editingEventId, setEditingEventId] = useState(null);

    const [deleteConfirm, setDeleteConfirm] = useState({
        open: false,
        type: "",
        id: null,
    });

    const initialJobForm = {
        title: "",
        org: "",
        type: "oncampus",
        cpt: true,
        tags: "",
        pay: "",
        description: "",
        applicationLink: "",
    };

    const initialEventForm = {
        title: "",
        date: "",
        time: "",
        location: "",
        type: "career",
        description: "",
    };

    const [jobForm, setJobForm] = useState(initialJobForm);
    const [eventForm, setEventForm] = useState(initialEventForm);

    useEffect(() => {
        fetchAdminData();
    }, []);

    async function fetchAdminData() {
        try {
            const [jobsRes, eventsRes, statsRes] = await Promise.all([
                API.get("/jobs"),
                API.get("/events"),
                API.get("/admin/stats"),
            ]);

            setJobs(jobsRes.data);
            setEvents(eventsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to load admin data"));
        }
    }

    function handleJobChange(e) {
        const { name, value, type, checked } = e.target;

        setJobForm({
            ...jobForm,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    function handleEventChange(e) {
        setEventForm({
            ...eventForm,
            [e.target.name]: e.target.value,
        });
    }

    function resetJobForm() {
        setJobForm(initialJobForm);
        setEditingJobId(null);
    }

    function resetEventForm() {
        setEventForm(initialEventForm);
        setEditingEventId(null);
    }

    function startEditJob(job) {
        setEditingJobId(job._id);

        setJobForm({
            title: job.title || "",
            org: job.org || "",
            type: job.type || "oncampus",
            cpt: job.cpt || false,
            tags: job.tags?.join(", ") || "",
            pay: job.pay || "",
            description: job.description || "",
            applicationLink: job.applicationLink || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function startEditEvent(event) {
        setEditingEventId(event._id);

        setEventForm({
            title: event.title || "",
            date: event.date || "",
            time: event.time || "",
            location: event.location || "",
            type: event.type || "career",
            description: event.description || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function submitJob(e) {
        e.preventDefault();

        const payload = {
            ...jobForm,
            tags: jobForm.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        };

        try {
            if (editingJobId) {
                await API.put(`/jobs/${editingJobId}`, payload);
                toast.success("Job updated successfully");
            } else {
                await API.post("/jobs", payload);
                toast.success("Job added successfully");
            }

            resetJobForm();
            fetchAdminData();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to save job"));
        }
    }

    async function submitEvent(e) {
        e.preventDefault();

        try {
            if (editingEventId) {
                await API.put(`/events/${editingEventId}`, eventForm);
                toast.success("Event updated successfully");
            } else {
                await API.post("/events", eventForm);
                toast.success("Event added successfully");
            }

            resetEventForm();
            fetchAdminData();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to save event"));
        }
    }

    function askDeleteJob(id) {
        setDeleteConfirm({
            open: true,
            type: "job",
            id,
        });
    }

    function askDeleteEvent(id) {
        setDeleteConfirm({
            open: true,
            type: "event",
            id,
        });
    }

    async function confirmDelete() {
        try {
            if (deleteConfirm.type === "job") {
                await API.delete(`/jobs/${deleteConfirm.id}`);
                toast.success("Job deleted");
            }

            if (deleteConfirm.type === "event") {
                await API.delete(`/events/${deleteConfirm.id}`);
                toast.success("Event deleted");
            }

            setDeleteConfirm({
                open: false,
                type: "",
                id: null,
            });

            fetchAdminData();
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to delete"));
        }
    }

    const filteredJobs = jobs.filter((job) =>
        `${job.title} ${job.org} ${job.type}`
            .toLowerCase()
            .includes(jobSearch.toLowerCase())
    );

    const filteredEvents = events.filter((event) =>
        `${event.title} ${event.location} ${event.type}`
            .toLowerCase()
            .includes(eventSearch.toLowerCase())
    );


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Panel</h1>
                <p className="text-gray-600 mt-2">
                    Add, edit, and manage jobs/events for MSU international students.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <AdminStatCard label="Total Users" value={stats.users} />
                <AdminStatCard label="Total Jobs" value={stats.jobs} />
                <AdminStatCard label="Total Events" value={stats.events} />
                <AdminStatCard label="Community Posts" value={stats.posts} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form
                    onSubmit={submitJob}
                    className="bg-white border rounded-2xl p-6 shadow-sm space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">
                            {editingJobId ? "Edit Job" : "Add Job"}
                        </h2>

                        {editingJobId && (
                            <button
                                type="button"
                                onClick={resetJobForm}
                                className="text-sm text-gray-500 hover:text-red-700"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <input
                        name="title"
                        value={jobForm.title}
                        onChange={handleJobChange}
                        placeholder="Job title"
                        className="w-full border rounded-xl px-4 py-3"
                        required
                    />

                    <input
                        name="org"
                        value={jobForm.org}
                        onChange={handleJobChange}
                        placeholder="Organization"
                        className="w-full border rounded-xl px-4 py-3"
                        required
                    />

                    <select
                        name="type"
                        value={jobForm.type}
                        onChange={handleJobChange}
                        className="w-full border rounded-xl px-4 py-3 bg-white"
                    >
                        <option value="oncampus">On-campus</option>
                        <option value="internship">Internship</option>
                        <option value="research">Research</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            name="cpt"
                            checked={jobForm.cpt}
                            onChange={handleJobChange}
                        />
                        CPT eligible
                    </label>

                    <input
                        name="tags"
                        value={jobForm.tags}
                        onChange={handleJobChange}
                        placeholder="Tags comma separated: Java, Research, SQL"
                        className="w-full border rounded-xl px-4 py-3"
                    />

                    <input
                        name="pay"
                        value={jobForm.pay}
                        onChange={handleJobChange}
                        placeholder="$18/hr"
                        className="w-full border rounded-xl px-4 py-3"
                    />

                    <input
                        name="applicationLink"
                        value={jobForm.applicationLink}
                        onChange={handleJobChange}
                        placeholder="Application link"
                        className="w-full border rounded-xl px-4 py-3"
                        required
                    />

                    <textarea
                        name="description"
                        value={jobForm.description}
                        onChange={handleJobChange}
                        placeholder="Job description"
                        className="w-full border rounded-xl px-4 py-3 min-h-28"
                    />

                    <button className="w-full bg-red-700 text-white py-3 rounded-xl font-medium hover:bg-red-800">
                        {editingJobId ? "Update Job" : "Add Job"}
                    </button>
                </form>

                <form
                    onSubmit={submitEvent}
                    className="bg-white border rounded-2xl p-6 shadow-sm space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">
                            {editingEventId ? "Edit Event" : "Add Event"}
                        </h2>

                        {editingEventId && (
                            <button
                                type="button"
                                onClick={resetEventForm}
                                className="text-sm text-gray-500 hover:text-red-700"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <input
                        name="title"
                        value={eventForm.title}
                        onChange={handleEventChange}
                        placeholder="Event title"
                        className="w-full border rounded-xl px-4 py-3"
                        required
                    />

                    <input
                        name="date"
                        value={eventForm.date}
                        onChange={handleEventChange}
                        placeholder="Feb 18"
                        className="w-full border rounded-xl px-4 py-3"
                        required
                    />

                    <input
                        name="time"
                        value={eventForm.time}
                        onChange={handleEventChange}
                        placeholder="2 PM - 3:30 PM"
                        className="w-full border rounded-xl px-4 py-3"
                        required
                    />

                    <input
                        name="location"
                        value={eventForm.location}
                        onChange={handleEventChange}
                        placeholder="CGCE Office"
                        className="w-full border rounded-xl px-4 py-3"
                        required
                    />

                    <select
                        name="type"
                        value={eventForm.type}
                        onChange={handleEventChange}
                        className="w-full border rounded-xl px-4 py-3 bg-white"
                    >
                        <option value="career">Career</option>
                        <option value="visa">Visa</option>
                        <option value="social">Social</option>
                        <option value="workshop">Workshop</option>
                    </select>

                    <textarea
                        name="description"
                        value={eventForm.description}
                        onChange={handleEventChange}
                        placeholder="Event description"
                        className="w-full border rounded-xl px-4 py-3 min-h-28"
                    />

                    <button className="w-full bg-red-700 text-white py-3 rounded-xl font-medium hover:bg-red-800">
                        {editingEventId ? "Update Event" : "Add Event"}
                    </button>
                </form>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Manage Jobs</h2>

                    <input
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        placeholder="Search jobs..."
                        className="w-full border rounded-xl px-4 py-3 mb-4"
                    />

                    <div className="space-y-3">
                        {filteredJobs.length === 0 ? (
                            <p className="text-gray-500">No jobs found.</p>
                        ) : (
                            filteredJobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="border rounded-xl p-4 flex justify-between gap-4"
                                >
                                    <div>
                                        <h3 className="font-semibold">{job.title}</h3>
                                        <p className="text-sm text-gray-500">{job.org}</p>
                                        <p className="text-xs text-gray-400 mt-1">{job.type}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => startEditJob(job)}
                                            className="text-blue-700 text-sm font-medium hover:underline"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => askDeleteJob(job._id)}
                                            className="text-red-700 text-sm font-medium hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Manage Events</h2>

                    <input
                        value={eventSearch}
                        onChange={(e) => setEventSearch(e.target.value)}
                        placeholder="Search events..."
                        className="w-full border rounded-xl px-4 py-3 mb-4"
                    />

                    <div className="space-y-3">
                        {filteredEvents.length === 0 ? (
                            <p className="text-gray-500">No events found.</p>
                        ) : (
                            filteredEvents.map((event) => (
                                <div
                                    key={event._id}
                                    className="border rounded-xl p-4 flex justify-between gap-4"
                                >
                                    <div>
                                        <h3 className="font-semibold">{event.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {event.location} • {event.date}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{event.type}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => startEditEvent(event)}
                                            className="text-blue-700 text-sm font-medium hover:underline"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => askDeleteEvent(event._id)}
                                            className="text-red-700 text-sm font-medium hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
            {deleteConfirm.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Delete {deleteConfirm.type}
                        </h2>

                        <p className="text-sm text-gray-600 mt-2">
                            Are you sure you want to delete this {deleteConfirm.type}? This action
                            cannot be undone.
                        </p>

                        <div className="mt-5 flex gap-3 justify-end">
                            <button
                                onClick={() =>
                                    setDeleteConfirm({
                                        open: false,
                                        type: "",
                                        id: null,
                                    })
                                }
                                className="px-4 py-2 rounded-xl border text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-xl bg-red-700 text-white hover:bg-red-800"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AdminStatCard({ label, value }) {
    return (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-900">{value}</h2>
        </div>
    );
}

export default Admin;