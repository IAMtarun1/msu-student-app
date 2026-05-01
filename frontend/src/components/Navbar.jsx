import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

function Navbar({ onLogoutClick }) {
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        async function fetchUnread() {
            try {
                const res = await API.get("/notifications/unread-count");
                setUnread(res.data.count);
            } catch (error) {
                setUnread(0);
            }
        }

        if (user) {
            fetchUnread();
            window.addEventListener("notificationsUpdated", fetchUnread);
        } else {
            setUnread(0);
        }

        return () => {
            window.removeEventListener("notificationsUpdated", fetchUnread);
        };
    }, [user?._id, user?.id]);

    const navPill = ({ isActive }) =>
        `rounded-xl px-3 py-2 transition ${
            isActive
                ? "bg-red-50 text-red-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;

    const mobilePill = ({ isActive }) =>
        `block rounded-xl px-4 py-3 transition ${
            isActive
                ? "bg-red-50 text-red-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
        }`;

    function closeMenu() {
        setOpen(false);
    }

    function handleLogoutClick() {
        closeMenu();
        onLogoutClick();
    }

    function Avatar({ size = "sm" }) {
        const sizeClass = size === "md" ? "h-10 w-10" : "h-9 w-9";

        return user?.profileImage ? (
            <img
                src={user.profileImage}
                alt={user.fullName}
                className={`${sizeClass} rounded-full object-cover border`}
            />
        ) : (
            <div
                className={`${sizeClass} flex items-center justify-center rounded-full bg-red-100 font-bold text-red-700`}
            >
                {user?.fullName?.charAt(0)}
            </div>
        );
    }

    function NotificationLink({ mobile = false }) {
        if (mobile) {
            return (
                <NavLink onClick={closeMenu} to="/notifications">
                    {({ isActive }) => (
                        <div
                            className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                                isActive
                                    ? "bg-red-50 text-red-700 font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <span>Notifications</span>

                            {unread > 0 && (
                                <span className="rounded-full bg-red-700 px-2 py-0.5 text-xs text-white">
                  {unread}
                </span>
                            )}
                        </div>
                    )}
                </NavLink>
            );
        }

        return (
            <NavLink to="/notifications">
                {({ isActive }) => (
                    <span className={`relative ${navPill({ isActive })}`}>
            Notifications

                        {unread > 0 && (
                            <span className="absolute -top-1 -right-1 rounded-full bg-red-700 px-1.5 py-0.5 text-xs text-white">
                {unread}
              </span>
                        )}
          </span>
                )}
            </NavLink>
        );
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-[72px] items-center justify-between py-3">
                    <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-700 text-white font-bold shadow-sm">
                            MS
                        </div>

                        <div>
                            <p className="text-lg font-bold leading-none text-gray-900">
                                MSU Student App
                            </p>
                            <p className="hidden text-xs text-gray-500 sm:block">
                                International Student Hub
                            </p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-2 md:flex">
                        <NavLink to="/" className={navPill}>
                            Home
                        </NavLink>

                        {user && (
                            <>
                                <NavLink to="/jobs" className={navPill}>
                                    Jobs
                                </NavLink>

                                <NavLink to="/events" className={navPill}>
                                    Events
                                </NavLink>

                                <NavLink to="/community" className={navPill}>
                                    Community
                                </NavLink>

                                <NavLink to="/hawk-ai" className={navPill}>
                                    Hawk AI
                                </NavLink>

                                <NotificationLink />

                                <NavLink to="/profile" className={navPill}>
                                    Profile
                                </NavLink>

                                {user?.role === "admin" && (
                                    <NavLink to="/admin" className={navPill}>
                                        Admin
                                    </NavLink>
                                )}
                            </>
                        )}
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2">
                                    <Avatar />

                                    <div className="leading-tight">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user.fullName?.split(" ")[0]}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.role === "admin" ? "Admin" : "Student"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogoutClick}
                                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    className="rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-800"
                                >
                                    Sign Up
                                </NavLink>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setOpen(!open)}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 md:hidden"
                    >
                        {open ? "Close" : "Menu"}
                    </button>
                </div>
            </div>

            {open && (
                <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
                    <div className="space-y-2">
                        <NavLink onClick={closeMenu} to="/" className={mobilePill}>
                            Home
                        </NavLink>

                        {user && (
                            <>
                                <NavLink onClick={closeMenu} to="/jobs" className={mobilePill}>
                                    Jobs
                                </NavLink>

                                <NavLink onClick={closeMenu} to="/events" className={mobilePill}>
                                    Events
                                </NavLink>

                                <NavLink
                                    onClick={closeMenu}
                                    to="/community"
                                    className={mobilePill}
                                >
                                    Community
                                </NavLink>

                                <NavLink
                                    onClick={closeMenu}
                                    to="/hawk-ai"
                                    className={mobilePill}
                                >
                                    Hawk AI
                                </NavLink>

                                <NotificationLink mobile />

                                <NavLink
                                    onClick={closeMenu}
                                    to="/profile"
                                    className={mobilePill}
                                >
                                    Profile
                                </NavLink>

                                {user?.role === "admin" && (
                                    <NavLink
                                        onClick={closeMenu}
                                        to="/admin"
                                        className={mobilePill}
                                    >
                                        Admin
                                    </NavLink>
                                )}
                            </>
                        )}

                        <div className="border-t pt-3">
                            {user ? (
                                <>
                                    <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
                                        <Avatar size="md" />

                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {user.fullName}
                                            </p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full rounded-xl bg-red-700 px-4 py-3 font-medium text-white transition hover:bg-red-800"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <NavLink
                                        onClick={closeMenu}
                                        to="/login"
                                        className="rounded-xl border px-4 py-3 text-center font-medium text-gray-700"
                                    >
                                        Login
                                    </NavLink>

                                    <NavLink
                                        onClick={closeMenu}
                                        to="/register"
                                        className="rounded-xl bg-red-700 px-4 py-3 text-center font-medium text-white"
                                    >
                                        Sign Up
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;