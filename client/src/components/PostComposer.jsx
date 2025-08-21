// src/components/PostComposer.jsx
import React, { useState } from "react";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

export default function PostComposer({ onPosted }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() && files.length === 0) return;

    const form = new FormData();
    form.append("text", text);
    if (tags) form.append("tags", JSON.stringify(tags.split(",").map(t => t.trim()).filter(Boolean)));
    files.forEach((f) => form.append("media", f));

    try {
      setLoading(true);
      const res = await api.post("/posts", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // backend returns populated post — push to feed
      if (onPosted) onPosted(res.data);
      setText("");
      setTags("");
      setFiles([]);
    } catch (err) {
      console.error("Post error", err);
      alert(err?.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <textarea
        placeholder="What's happening?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input type="file" accept="image/*,video/*" multiple onChange={onFileChange} className="mb-2" />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <div className="flex justify-end">
        <button disabled={loading} className=" bg-teal-500 text-white hover:bg-teal-600 mt-1 px-4 py-2 rounded">
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
