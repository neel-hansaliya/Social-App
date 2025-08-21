import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AuthForm({ mode, onSubmit }) {
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    return (
        <form className="bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto" onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
        }}>
            <h2 className="text-2xl mb-4">{mode === "login" ? "Login" : "Create account"}</h2>

            {mode === "register" && (
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name" className="w-full mb-3 px-3 py-2 border rounded" />
            )}

            <input required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                type="email" placeholder="Email" className="w-full mb-3 px-3 py-2 border rounded" />
            <input required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                type="password" placeholder="Password" className="w-full mb-3 px-3 py-2 border rounded" />

            <div className="flex justify-between items-center">
                <button className=" bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded">{mode === "login" ? "Login" : "Sign up"}</button>
                <a href="#" onClick={(e) => { e.preventDefault(); /* handled in parent */ }} className="text-sm text-teal-600">Forgot?</a>
            </div>
        </form>
    );
}

export default function Auth() {
    const { login, register } = useAuth();
    const [mode, setMode] = useState("login");
    const [error, setError] = useState(null);
    const nav = useNavigate();

    const handleSubmit = async (data) => {
        setError(null);
        try {
            if (mode === "login") await login({ email: data.email, password: data.password });
            else await register({ name: data.name, email: data.email, password: data.password });
            nav("/");
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center">
            <div className="w-full">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold">Welcome to Social</h1>
                    <p className="text-muted">Connect with friends — fast and simple.</p>
                </div>

                <div>
                    <div className="flex justify-center gap-2 mb-4">
                        <button onClick={() => setMode("login")} className={`px-4 py-2 rounded ${mode === "login" ? " bg-teal-500 text-white hover:bg-teal-600" : "bg-white border"}`}>Login</button>
                        <button onClick={() => setMode("register")} className={`px-4 py-2 rounded ${mode === "register" ? " bg-teal-500 text-white hover:bg-teal-600" : "bg-white border"}`}>Sign up</button>
                    </div>

                    {error && <div className="max-w-md mx-auto mb-4 text-red-600">{error}</div>}

                    <AuthForm mode={mode} onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
}
