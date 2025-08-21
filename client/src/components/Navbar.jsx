import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ChatIcon from '@mui/icons-material/Chat';

export default function Navbar() {
    const { user, logout, setUser } = useAuth();
    const nav = useNavigate();

    const handleLogout = async () => {
        await logout();
        nav("/auth");
    };

    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 text-xl font-semibold text-teal-600">
                    <span className="bg-teal-500 text-white px-2 py-1 rounded">S</span> Social
                </Link>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link to="/messages" title="Messages">
                                <IconButton><ChatIcon /></IconButton>
                            </Link>
                            <Link to="/me" className="flex items-center gap-2">
                                <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 36, height: 36 }} />
                                <span className="hidden sm:inline">{user?.name}</span>
                            </Link>



                            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
                        </>
                    ) : (
                        <Link to="/auth" className="bg-teal-500 text-white px-3 py-1 rounded">Login / Signup</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
