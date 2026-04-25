import { createContext, useContext, useEffect, useState } from "react";
import API from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkUser() {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await API.get("/auth/me");
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkUser();
    }, []);

    function login(userData, token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}