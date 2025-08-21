import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import PostComposer from "../components/PostComposer.jsx";
import PostCard from "../components/PostCard.jsx";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await api.get("/posts/feed");  // <-- here
            setPosts(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const addPostToTop = (p) => setPosts(prev => [p, ...prev]);

    return (
        <div>
            <PostComposer onPosted={addPostToTop} />
            {loading ? <div>Loading feed...</div> : (
                <div className="space-y-4 mt-4">
                    {posts.map(post => <PostCard key={post._id} post={post} onUpdate={fetchPosts} />)}
                </div>
            )}
        </div>
    );
}
