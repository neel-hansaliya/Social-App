import React, { useState } from "react";
import api from "../lib/axios";
import Avatar from "@mui/material/Avatar";

export default function UserSearch() {
    const [q, setQ] = useState("");
    const [results, setResults] = useState([]);

    const search = async () => {
        if (!q.trim()) return;
        try {
            const res = await api.get(`/users/search?q=${encodeURIComponent(q)}`);
            setResults(res.data);
        } catch (e) { console.error(e); }
    };

    return (
        <div>
            <div className="flex gap-2">
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search users" className="flex-1 p-2 border rounded" />
                <button onClick={search} className="bg-teal-500 text-white px-3 rounded">Search</button>
            </div>

            <div className="mt-3 space-y-2">
                {results.map(u => (
                    <div key={u._id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                        <Avatar src={u.avatar} />
                        <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
