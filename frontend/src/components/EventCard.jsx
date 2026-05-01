import API from "../utils/api";

function EventCard({ event, refreshEvents }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || user?._id;

    const rsvps = event.rsvps || [];

    const isRsvped = rsvps.some(
        (id) => id.toString() === userId?.toString()
    );

    async function handleRsvp() {
        try {
            await API.post(`/events/${event._id || event.id}/rsvp`);
            refreshEvents();
        } catch (error) {
            console.error("RSVP failed:", error);
        }
    }

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm font-semibold text-red-700">{event.date}</p>

            <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>

            <p className="text-sm text-gray-500 mt-1">
                {event.location} • {event.time}
            </p>

            <p className="text-gray-600 mt-3">{event.description}</p>

            <p className="text-sm text-gray-500 mt-3">
                {rsvps.length} student{rsvps.length !== 1 ? "s" : ""} RSVP’d
            </p>

            <button
                onClick={handleRsvp}
                className={`mt-4 w-full py-2 rounded-lg font-medium ${
                    isRsvped
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "border border-red-700 text-red-700 hover:bg-red-50"
                }`}
            >
                {isRsvped ? "RSVP’d" : "RSVP"}
            </button>
        </div>
    );
}

export default EventCard;