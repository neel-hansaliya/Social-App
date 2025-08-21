import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import ChatWindow from "../components/ChatWindow.jsx";

export default function Messages() {
    const [convos, setConvos] = useState([]);
    const [active, setActive] = useState(null);

    // Dummy requests + friends
    const [requests, setRequests] = useState([
        { id: 1, name: "Rahul Sharma" },
        { id: 2, name: "Priya Patel" },
    ]);

    const [friends, setFriends] = useState([
        { id: "f1", name: "Aman Verma" },
        { id: "f2", name: "Sneha Kapoor" },
    ]);

    // Fetch real conversations
    useEffect(() => {
        api.get("/conversations")
            .then((res) => setConvos(res.data))
            .catch(() => { });
    }, []);

    // Accept request
    const acceptRequest = (id) => {
        const req = requests.find((r) => r.id === id);
        if (!req) return;

        // remove from requests
        setRequests((prev) => prev.filter((r) => r.id !== id));

        // add to friends
        setFriends((prev) => [...prev, { id: "f-" + id, name: req.name }]);
    };

    // Open chat for dummy friends
    const openFriendChat = (friend) => {
        const fakeConvo = {
            _id: "dummy-" + friend.id,
            title: friend.name,
            participants: [{ name: friend.name, _id: friend.id }],
        };
        setActive(fakeConvo);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Left Panel */}
            <div className="md:col-span-1 bg-white rounded shadow p-4 space-y-6">
                {/* Conversations */}
                <div>
                    <div className="space-y-2">
                        {convos.map((c) => (
                            <div
                                key={c._id}
                                onClick={() => setActive(c)}
                                className="cursor-pointer p-2 rounded hover:bg-gray-50"
                            >
                                <div className="font-medium">
                                    {c.title ||
                                        c.participants?.map((p) => p.name).join(", ")}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {c.latestMessage?.text?.slice(0, 40)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Friend Requests */}
                <div>
                    <h3 className="mb-2 -mt-5 font-semibold">Friend Requests</h3>
                    {requests.length === 0 ? (
                        <div className="text-sm text-gray-500">No requests</div>
                    ) : (
                        <div className="space-y-2">
                            {requests.map((r) => (
                                <div
                                    key={r.id}
                                    className="flex justify-between items-center p-2 border rounded"
                                >
                                    <span>{r.name}</span>
                                    <button
                                        onClick={() => acceptRequest(r.id)}
                                        className=" bg-teal-500 text-white hover:bg-teal-600 px-2 py-1 text-sm rounded"
                                    >
                                        Accept
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Friends List */}
                <div>
                    <h3 className="mb-2 font-semibold">Friends</h3>
                    {friends.length === 0 ? (
                        <div className="text-sm text-gray-500">No friends</div>
                    ) : (
                        <div className="space-y-2">
                            {friends.map((f) => (
                                <div
                                    key={f.id}
                                    onClick={() => openFriendChat(f)}
                                    className="cursor-pointer p-2 rounded hover:bg-gray-50"
                                >
                                    {f.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel (Chat Window) */}
            <div className="md:col-span-3">
                {active ? (
                    <ChatWindow conversation={active} />
                ) : (
                    <div className="bg-white rounded shadow p-6">
                        Select a conversation or friend to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
