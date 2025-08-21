import { Router } from "express";
import User from "../models/User.js";
import Post from "../models/Post.js"; // ✅ so we can fetch user posts
import { auth } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

const router = Router();

/**
 * 🔍 Search users
 * GET /api/users/search?q=abc
 */
router.get("/search", auth, async (req, res) => {
    try {
        const q = req.query.q || "";
        const users = await User.find({
            $or: [
                { username: new RegExp(q, "i") },
                { name: new RegExp(q, "i") },
            ],
        }).select("username name avatarUrl bio location");

        res.json(users);
    } catch (err) {
        console.error("User search error", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * 👤 Get user by id
 * GET /api/users/:id
 */
router.get("/:id", auth, async (req, res) => {
    try {
        const u = await User.findById(req.params.id)
            .select("-password")
            .populate("friends", "username name avatarUrl");

        if (!u) return res.status(404).json({ message: "Not found" });

        // ✅ also fetch latest posts for profile page
        const posts = await Post.find({ author: req.params.id })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("author", "username name avatarUrl");

        res.json({ user: u, posts });
    } catch (err) {
        console.error("Get user error", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * ✏️ Update profile
 * PUT /api/users/me
 */
router.put("/me", auth, upload.single("avatar"), async (req, res) => {
    try {
        const { name, bio, location } = req.body;

        if (req.file) req.user.avatarUrl = `/uploads/${req.file.filename}`;
        if (name !== undefined) req.user.name = name;
        if (bio !== undefined) req.user.bio = bio;
        if (location !== undefined) req.user.location = location;

        await req.user.save();

        res.json({
            message: "Updated",
            user: {
                id: req.user._id,
                username: req.user.username,
                name: req.user.name,
                avatarUrl: req.user.avatarUrl,
                bio: req.user.bio,
                location: req.user.location,
            },
        });
    } catch (err) {
        console.error("Update profile error", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
