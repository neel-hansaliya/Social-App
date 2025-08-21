import { Router } from "express";
import { auth } from "../middleware/auth.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const router = Router();

// 🔹 List all conversations for logged-in user
router.get("/conversations", auth, async (req, res) => {
    try {
        const convos = await Conversation.find({
            participants: req.user._id,
        })
            .sort({ updatedAt: -1 })
            .populate("participants", "username name avatarUrl")
            .populate({
                path: "lastMessage",
                populate: { path: "sender", select: "username name avatarUrl" }, // ✅ nested populate
            });

        res.json(convos);
    } catch (err) {
        console.error("Get conversations error", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Get messages for a conversation
router.get("/:conversationId", auth, async (req, res) => {
    try {
        const msgs = await Message.find({
            conversation: req.params.conversationId,
        })
            .sort({ createdAt: 1 })
            .populate("sender", "username name avatarUrl");

        res.json(msgs);
    } catch (err) {
        console.error("Get messages error", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Send message to user (REST fallback, in case socket not used)
router.post("/to/:userId", auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const { content } = req.body;

        // find or create conversation
        let convo = await Conversation.findOne({
            participants: { $all: [req.user._id, userId] },
        });

        if (!convo) {
            convo = await Conversation.create({
                participants: [req.user._id, userId],
            });
        }

        // create message
        const msg = await Message.create({
            conversation: convo._id,
            sender: req.user._id,
            content,
        });

        // update lastMessage with ObjectId (✅ fixed)
        convo.lastMessage = msg._id;
        await convo.save();

        // return with populated data
        const populatedMsg = await msg.populate(
            "sender",
            "username name avatarUrl"
        );

        res.json({ conversation: convo, message: populatedMsg });
    } catch (err) {
        console.error("Send message error", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
