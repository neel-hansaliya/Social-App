import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function PersonalProfile() {
    const { user, setUser } = useAuth();

    const [profile, setProfile] = useState(
        user || { name: "My Name", bio: "This is my bio", avatar: "", posts: [], reels: [] }
    );
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (user) setProfile(user);
    }, [user]);

    // ✅ Save everything to context + localStorage
    const handleSaveAll = () => {
        setUser(profile);
        setEditing(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setProfile({ ...profile, avatar: url });
        }
    };

    const handlePostUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setProfile({
                ...profile,
                posts: [...profile.posts, { id: Date.now(), url }],
            });
        }
    };

    const handleReelUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setProfile({
                ...profile,
                reels: [...profile.reels, { id: Date.now(), url }],
            });
        }
    };

    const handleDelete = (id, type) => {
        setProfile({
            ...profile,
            [type]: profile[type].filter((item) => item.id !== id),
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-4 relative">
                <div className="relative">
                    <Avatar
                        src={profile.avatar}
                        sx={{ width: 120, height: 120 }}
                        className="border-4 border-teal-500"
                    />
                    <label className="absolute bottom-0 right-0 bg-teal-500 p-2 rounded-full cursor-pointer">
                        <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                        <Pencil size={18} className="text-white" />
                    </label>
                </div>

                {editing ? (
                    <div className="w-full text-center">
                        <input
                            className="border p-2 rounded w-full mb-2"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                        <textarea
                            className="border p-2 rounded w-full"
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        />
                        {/* <button
              onClick={handleSaveAll}
              className="mt-2 bg-teal-500 text-white px-4 py-2 rounded"
            >
              Save Profile
            </button> */}
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold">{profile.name}</h2>
                        <p className="text-gray-600">{profile.bio}</p>
                        <button
                            onClick={() => setEditing(true)}
                            className="text-sm text-blue-600 underline"
                        >
                            Edit Profile
                        </button>
                    </>
                )}
            </div>

            {/* Upload Buttons */}
            <div className="mt-6 flex gap-4 justify-center">
                <label className="flex items-center gap-2 bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded cursor-pointer">
                    <PlusCircle size={18} /> Add Post
                    <input type="file" accept="image/*" hidden onChange={handlePostUpload} />
                </label>
                <label className="flex items-center gap-2 bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded cursor-pointer">
                    <PlusCircle size={18} /> Add Reel
                    <input type="file" accept="video/*" hidden onChange={handleReelUpload} />
                </label>
            </div>

            {/* ✅ Global Save Button */}
            <div className="mt-4 flex justify-center">
                <button
                    onClick={handleSaveAll}
                    className="bg-gray-400 text-white hover:bg-gray-500 px-6 py-2 rounded-lg"
                >
                    Save All Changes
                </button>
            </div>

            {/* Posts */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Posts</h3>
                {profile.posts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {profile.posts.map((p) => (
                            <div key={p.id} className="relative group">
                                <img src={p.url} alt="Post" className="rounded-lg w-full h-58 object-cover" />
                                <button
                                    onClick={() => handleDelete(p.id, "posts")}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500">No posts yet</div>
                )}
            </div>

            {/* Reels */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Reels</h3>
                {profile.reels.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {profile.reels.map((r) => (
                            <div key={r.id} className="relative group">
                                <video src={r.url} controls className="rounded-lg w-full h-78 object-cover" />
                                <button
                                    onClick={() => handleDelete(r.id, "reels")}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500">No reels yet</div>
                )}
            </div>
        </div>
    );
}
