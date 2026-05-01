function JobCard({ job }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.org}</p>
                </div>

                <span className={`text-xs px-3 py-1 rounded-full ${
                    job.cpt ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
          {job.cpt ? "CPT OK" : "No CPT"}
        </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                {job.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
            {tag}
          </span>
                ))}
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {job.pay}
        </span>
            </div>

            <button
                onClick={() => window.open(job.applicationLink, "_blank")}
                disabled={!job.applicationLink}
                className="mt-4 w-full bg-red-700 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-red-800"
            >
                Apply
            </button>
        </div>
    );
}

export default JobCard;
