// frontend/src/components/FriendsPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function FriendsPanel() {
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/friends/suggestions")
            .then(res => res.json())
            .then(data => setFriends(data))
            .catch(err => console.error("Error:", err));
    }, []);

    return (
        <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Suggestions</h2>
            <div className="space-y-3">
                {friends.map(friend => (
                    <Link
                        key={friend._id}
                        to={`/profile/${friend._id}`}
                        className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                    >
                        <img
                            src={friend.avatarUrl}
                            alt={friend.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-semibold">{friend.name}</p>
                            <p className="text-sm text-gray-500">{friend.bio}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}