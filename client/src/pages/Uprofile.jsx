import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

export default function ProfilePage() {
    const { id } = useParams(); // URL se id le rhe hai (/profile/:id)
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Backend se friend profile fetch karo
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:5000/api/friends/suggestions/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Profile not found");
                return res.json();
            })
            .then(data => {
                setProfile(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching profile:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading profile...</div>;
    if (!profile) return <div>Profile not found</div>;

    return (
        <div className="bg-white p-6 rounded shadow">
            {/* User Info */}
            <div className="flex flex-col items-center gap-4">
                <Avatar src={profile.avatarUrl} sx={{ width: 120, height: 120 }} />
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-gray-600">{profile.bio}</p>

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                    <div><strong>{profile.posts?.length || 0}</strong> Posts</div>
                    <div><strong>{profile.followers?.length || 20}</strong> Followers</div>
                    <div><strong>{profile.following?.length || 10}</strong> Following</div>
                </div>
            </div>

            {/* Posts */}
            <div className="mt-6">
                <h3 className="font-semibold mb-3">Recent posts</h3>
                {profile.posts && profile.posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.posts.map((p) => (
                            <div key={p.id} className="border rounded p-3 shadow-sm">
                                <img
                                    src={p.image}
                                    alt="post"
                                    className="w-full h-48 object-cover rounded mb-2"
                                />
                                <p>{p.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No posts yet</div>
                )}
            </div>
        </div>
    );
}
