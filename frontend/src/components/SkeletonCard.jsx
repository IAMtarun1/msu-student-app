function SkeletonCard() {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
    );
}

export default SkeletonCard;