import React, { useState } from "react";
import dayjs from "dayjs";
import Avatar from "@mui/material/Avatar";
import api from "../lib/axios";

export default function PostCard({ post, onUpdate }) {
    const [likeProcessing, setLikeProcessing] = useState(false);

    const toggleLike = async () => {
        setLikeProcessing(true);
        try {
            await api.post(`/posts/${post._id}/like`);
            if (onUpdate) onUpdate();
        } catch (e) { console.error(e); }
        setLikeProcessing(false);
    };

    const deletePost = async () => {
        if (!confirm("Delete post?")) return;
        try {
            await api.delete(`/posts/${post._id}`);
            if (onUpdate) onUpdate();
        } catch (e) { }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="flex gap-3">
                <Avatar src={post.author?.avatar} alt={post.author?.name} />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-semibold">{post.author?.name}</div>
                            <div className="text-sm text-gray-500">{dayjs(post.createdAt).fromNow ? dayjs(post.createdAt).fromNow() : new Date(post.createdAt).toLocaleString()}</div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={toggleLike} disabled={likeProcessing} className="px-2 py-1 border rounded">Like {post.likes?.length || 0}</button>
                            {post.canDelete && <button onClick={deletePost} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>}
                        </div>
                    </div>

                    <div className="mt-3">{post.content}</div>
                </div>
            </div>
        </div>
    );
}
