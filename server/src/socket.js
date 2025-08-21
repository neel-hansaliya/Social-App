import { Server } from "socket.io";
import Conversation from "./models/Conversation.js";
import Message from "./models/Message.js";
import { verifyToken } from "./middleware/auth.js"; // ✅ reuse

export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        },
    });

    // Track online users
    const onlineUsers = new Map();

    // ✅ Auth middleware for socket
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error("No token provided"));

            const user = await verifyToken(token);
            if (!user) return next(new Error("Invalid token"));

            socket.user = user; // full user object
            next();
        } catch (err) {
            console.error("Socket auth failed:", err.message);
            next(new Error("Authentication failed"));
        }
    });

    io.on("connection", (socket) => {
        console.log("✅ Socket connected:", socket.user._id);

        // Add user to online map
        onlineUsers.set(socket.user._id.toString(), socket.id);

        // Join personal room
        socket.join(String(socket.user._id));

        // 📩 Handle sending messages
        socket.on("message:send", async ({ to, content }) => {
            try {
                let convo = await Conversation.findOne({
                    participants: { $all: [socket.user._id, to] },
                });

                if (!convo) {
                    convo = await Conversation.create({
                        participants: [socket.user._id, to],
                    });
                }

                const msg = await Message.create({
                    conversation: convo._id,
                    sender: socket.user._id,
                    content,
                });

                // Update conversation with last message
                convo.lastMessage = msg._id;
                await convo.save();

                const fullMsg = await Message.findById(msg._id)
                    .populate("sender", "username avatar")
                    .lean();

                // emit to recipient & sender both
                io.to(String(to)).emit("message:new", {
                    conversationId: convo._id,
                    message: fullMsg,
                });
                io.to(String(socket.user._id)).emit("message:new", {
                    conversationId: convo._id,
                    message: fullMsg,
                });
            } catch (e) {
                console.error("❌ Socket message error:", e);
            }
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected:", socket.user._id);
            onlineUsers.delete(socket.user._id.toString());
        });
    });

    return io;
};
