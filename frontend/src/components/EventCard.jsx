function EventCard({ event }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm font-semibold text-red-700">{event.date}</p>

            <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>

            <p className="text-sm text-gray-500 mt-1">
                {event.location} • {event.time}
            </p>

            <p className="text-gray-600 mt-3">{event.description}</p>

            <button className="mt-4 w-full border border-red-700 text-red-700 py-2 rounded-lg hover:bg-red-50">
                RSVP
            </button>
        </div>
    );
}

export default EventCard;