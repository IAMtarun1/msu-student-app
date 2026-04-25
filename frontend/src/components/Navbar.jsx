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

    const linkClass = ({ isActive }) =>
        isActive
            ? "bg-red-50 text-red-700 font-semibold"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

    const mobileLinkClass = ({ isActive }) =>
        isActive
            ? "block rounded-xl bg-red-50 px-4 py-3 text-red-700 font-semibold"
            : "block rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100";

    function closeMenu() {
        setOpen(false);
    }

    function handleLogoutClick() {
        closeMenu();
        onLogoutClick();
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-18 items-center justify-between py-3">
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
                        <NavLink to="/" className={linkClass}>
                            {({ isActive }) => (
                                <span className={`rounded-xl px-3 py-2 ${linkClass({ isActive })}`}>
                  Home
                </span>
                            )}
                        </NavLink>

                        {user && (
                            <>
                                <NavLink to="/jobs" className={linkClass}>
                                    {({ isActive }) => (
                                        <span className={`rounded-xl px-3 py-2 ${linkClass({ isActive })}`}>
                      Jobs
                    </span>
                                    )}
                                </NavLink>

                                <NavLink to="/events" className={linkClass}>
                                    {({ isActive }) => (
                                        <span className={`rounded-xl px-3 py-2 ${linkClass({ isActive })}`}>
                      Events
                    </span>
                                    )}
                                </NavLink>

                                <NavLink to="/community" className={linkClass}>
                                    {({ isActive }) => (
                                        <span className={`rounded-xl px-3 py-2 ${linkClass({ isActive })}`}>
                      Community
                    </span>
                                    )}
                                </NavLink>

                                <NavLink to="/hawk-ai" className={linkClass}>
                                    {({ isActive }) => (
                                        <span className={`rounded-xl px-3 py-2 ${linkClass({ isActive })}`}>
                      Hawk AI
                    </span>
                                    )}
                                </NavLink>

                                <NavLink to="/notifications">
                                    {({ isActive }) => (
                                        <span
                                            className={`relative rounded-xl px-3 py-2 ${
                                                isActive
                                                    ? "bg-red-50 text-red-700 font-semibold"
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            }`}
                                        >
                      Notifications

                                            {unread > 0 && (
                                                <span className="absolute -top-1 -right-1 rounded-full bg-red-700 px-1.5 py-0.5 text-xs text-white">
                          {unread}
                        </span>
                                            )}
                    </span>
                                    )}
                                </NavLink>

                                <NavLink to="/profile" className={linkClass}>
                                    {({ isActive }) => (
                                        <span className={`rounded-xl px-3 py-2 ${linkClass({ isActive })}`}>
                      Profile
                    </span>
                                    )}
                                </NavLink>
                            </>
                        )}
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2">
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.fullName}
                                            className="h-9 w-9 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                                            {user.fullName?.charAt(0)}
                                        </div>
                                    )}

                                    <div className="leading-tight">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user.fullName?.split(" ")[0]}
                                        </p>
                                        <p className="text-xs text-gray-500">Student</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogoutClick}
                                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    className="rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-800"
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
                        <NavLink onClick={closeMenu} to="/" className={mobileLinkClass}>
                            Home
                        </NavLink>

                        {user && (
                            <>
                                <NavLink onClick={closeMenu} to="/jobs" className={mobileLinkClass}>
                                    Jobs
                                </NavLink>

                                <NavLink onClick={closeMenu} to="/events" className={mobileLinkClass}>
                                    Events
                                </NavLink>

                                <NavLink onClick={closeMenu} to="/community" className={mobileLinkClass}>
                                    Community
                                </NavLink>

                                <NavLink onClick={closeMenu} to="/hawk-ai" className={mobileLinkClass}>
                                    Hawk AI
                                </NavLink>

                                <NavLink onClick={closeMenu} to="/notifications">
                                    {({ isActive }) => (
                                        <div
                                            className={`flex items-center justify-between rounded-xl px-4 py-3 ${
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

                                <NavLink onClick={closeMenu} to="/profile" className={mobileLinkClass}>
                                    Profile
                                </NavLink>
                            </>
                        )}

                        <div className="border-t pt-3">
                            {user ? (
                                <>
                                    <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
                                        {user.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt={user.fullName}
                                                className="h-10 w-10 rounded-full object-cover border"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                                                {user.fullName?.charAt(0)}
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-semibold text-gray-900">{user.fullName}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full rounded-xl bg-red-700 px-4 py-3 font-medium text-white"
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