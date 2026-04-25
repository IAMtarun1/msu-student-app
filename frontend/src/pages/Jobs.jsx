import { useEffect, useState } from "react";
import API from "../utils/api";
import JobCard from "../components/JobCard";
import SkeletonCard from "../components/SkeletonCard";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await API.get("/jobs");
                setJobs(res.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter((job) => {
        const matchesFilter =
            filter === "all" ? true : filter === "cpt" ? job.cpt : job.type === filter;

        const searchText = `${job.title} ${job.org} ${job.type} ${job.tags?.join(" ")}`
            .toLowerCase();

        const matchesSearch = searchText.includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Jobs & Opportunities</h1>
            <p className="text-gray-600 mb-6">
                Search on-campus jobs, internships, and CPT-friendly opportunities.
            </p>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, skill, department..."
                className="w-full bg-white border rounded-xl px-4 py-3 mb-5"
            />

            <div className="flex gap-3 mb-6 flex-wrap">
                {["all", "oncampus", "internship", "cpt"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm capitalize ${
                            filter === f ? "bg-red-700 text-white" : "bg-white border"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {!loading && filteredJobs.length === 0 && (
                <div className="bg-white border rounded-xl p-6 text-gray-600">
                    No jobs found. Try a different search or filter.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading
                    ? Array(6)
                        .fill(0)
                        .map((_, i) => <SkeletonCard key={i} />)
                    : filteredJobs.map((job) => (
                        <JobCard key={job._id || job.id} job={job} />
                    ))}
            </div>
        </div>
    );
}

export default Jobs;