import React, { useEffect, useRef, useState } from "react";
import api from "../lib/axios";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import Avatar from "@mui/material/Avatar";

export default function ChatWindow({ conversation }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const socketRef = useRef(null);
    const messagesRef = useRef(null);

    useEffect(() => {
        // fetch messages for conversation
        api.get(`/messages/${conversation._id}`).then(res => setMessages(res.data)).catch(() => { });
    }, [conversation._id]);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
        socketRef.current = io(socketUrl, {
            auth: { token: localStorage.getItem("token") }
        });

        socketRef.current.on("connect", () => {
            console.log("socket connected", socketRef.current.id);
            socketRef.current.emit("joinConversation", conversation._id);
        });

        socketRef.current.on("message", (msg) => {
            // ensure it's for current conversation
            if (msg.conversationId === conversation._id) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit("leaveConversation", conversation._id);
                socketRef.current.disconnect();
            }
        };
    }, [conversation._id]);

    const scrollToBottom = () => {
        setTimeout(() => messagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
    };

    const sendMessage = async () => {
        if (!text.trim()) return;
        // optimistic UI
        const temp = {
            _id: "tmp-" + Date.now(),
            text,
            author: user,
            conversationId: conversation._id,
            createdAt: new Date().toISOString(),
            pending: true
        };
        setMessages(prev => [...prev, temp]);
        setText("");
        scrollToBottom();

        try {
            const res = await api.post("/messages", { conversationId: conversation._id, text });
            // server will also emit via sockets; but update if necessary
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="bg-white rounded shadow p-4 h-[70vh] flex flex-col">
            <div className="border-b pb-3 mb-3">
                <div className="font-semibold">{conversation.title || conversation.participants.map(p => p.name).join(", ")}</div>
            </div>

            <div className="flex-1 overflow-auto px-2 space-y-4">
                {messages.map(m => (
                    <div key={m._id} className={`flex gap-3 ${m.author?._id === user?._id ? "justify-end" : "justify-start"}`}>
                        {m.author?._id !== user?._id && <Avatar src={m.author?.avatar} />}
                        <div className={`max-w-[70%] p-2 rounded ${m.author?._id === user?._id ? "bg-teal-100 text-right" : "bg-gray-100"}`}>
                            <div className="text-sm">{m.text}</div>
                            <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
                        </div>
                        {m.author?._id === user?._id && <Avatar src={m.author?.avatar} />}
                    </div>
                ))}
                <div ref={messagesRef} />
            </div>

            <div className="mt-3 flex gap-2 items-center">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" className="flex-1 p-2 border rounded" />
                <button onClick={sendMessage} className=" bg-teal-500 text-white hover:bg-teal-600 px-3 py-2 rounded">Send</button>
            </div>
        </div>
    );
}
