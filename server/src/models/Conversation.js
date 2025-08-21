import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message", // ✅ reference to Message instead of plain string
        },
    },
    { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
