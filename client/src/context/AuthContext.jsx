import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load from localStorage once
    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            try {
                setUserState(JSON.parse(saved));
            } catch {
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    // --- Save full user object ---
    const setUser = (u) => {
        setUserState(u);
        if (u) {
            localStorage.setItem("user", JSON.stringify(u));
        } else {
            localStorage.removeItem("user");
        }
    };

    // --- Merge partial update (ex: only avatar or posts) ---
    const updateUser = (patch) => {
        setUserState((prev) => {
            const next = { ...(prev || {}), ...patch };
            localStorage.setItem("user", JSON.stringify(next));
            return next;
        });
    };

    // Fake login
    const login = async ({ email, password }) => {
        const fakeUser = {
            _id: String(Date.now()),
            name: email.split("@")[0],
            email,
            avatar: "",
            bio: "",
            posts: [],
            reels: [],
        };
        setUser(fakeUser);
        return fakeUser;
    };

    // Fake register
    const register = async ({ name, email, password }) => {
        const fakeUser = {
            _id: String(Date.now()),
            name,
            email,
            avatar: "",
            bio: "",
            posts: [],
            reels: [],
        };
        setUser(fakeUser);
        return fakeUser;
    };

    // Logout
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, setUser, updateUser, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
