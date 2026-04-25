import { useEffect, useState } from "react";
import API from "../utils/api";

function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {
        try {
            const res = await API.get("/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }

    async function markAsRead(id) {
        try {
            await API.put(`/notifications/${id}/read`);
            fetchNotifications();
            window.dispatchEvent(new Event("notificationsUpdated"));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    }

    async function markAllAsRead() {
        try {
            await API.put("/notifications/mark-all-read");
            fetchNotifications();
            window.dispatchEvent(new Event("notificationsUpdated"));
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-gray-600 mt-2">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                            : "You are all caught up."}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-800"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white border rounded-2xl p-8 text-center">
                    <div className="mx-auto h-14 w-14 rounded-full bg-red-50 text-red-700 flex items-center justify-center text-2xl">
                        🔔
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">No notifications yet</h2>
                    <p className="text-gray-600 mt-2">
                        Likes and comments on your posts will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`border rounded-2xl p-5 shadow-sm transition ${
                                notification.read
                                    ? "bg-white border-gray-200"
                                    : "bg-red-50 border-red-200"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {notification.message}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {!notification.read && (
                                    <span className="h-3 w-3 rounded-full bg-red-700 mt-1"></span>
                                )}
                            </div>

                            {!notification.read && (
                                <button
                                    onClick={() => markAsRead(notification._id)}
                                    className="mt-4 text-sm text-red-700 font-medium hover:underline"
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notifications;