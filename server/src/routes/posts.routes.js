// import { Router } from "express";
// import { auth } from "../middleware/auth.js";
// import { upload } from "../utils/upload.js";
// import Post from "../models/Post.js";
// import User from "../models/User.js";

// const router = Router();

// /**
//  * ✍️ Create post (text + media + tags)
//  */
// router.post("/", auth, upload.array("media", 6), async (req, res) => {
//     try {
//         const { text, tags } = req.body;
//         const mediaUrls = (req.files || []).map((f) => `/uploads/${f.filename}`);
//         const tagIds = tags ? JSON.parse(tags) : [];

//         const post = await Post.create({
//             author: req.user._id,
//             text,
//             mediaUrls,
//             tags: tagIds,
//         });

//         const populated = await post.populate("author", "username name avatarUrl");

//         res.status(201).json(populated);
//     } catch (err) {
//         console.error("Create post error", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// /**
//  * 📰 Get feed (self + friends)
//  */
// router.get("/feed", auth, async (req, res) => {
//     try {
//         const ids = [req.user._id, ...(req.user.friends || [])];

//         const posts = await Post.find({ author: { $in: ids } })
//             .populate("author", "username name avatarUrl")
//             .populate("tags", "username name avatarUrl")
//             .sort({ createdAt: -1 })
//             .limit(50);

//         res.json(posts);
//     } catch (err) {
//         console.error("Get feed error", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// /**
//  * 👤 Get posts by user
//  */
// router.get("/user/:userId", auth, async (req, res) => {
//     try {
//         const posts = await Post.find({ author: req.params.userId })
//             .populate("author", "username name avatarUrl")
//             .populate("tags", "username name avatarUrl")
//             .sort({ createdAt: -1 });

//         res.json(posts);
//     } catch (err) {
//         console.error("Get user posts error", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// /**
//  * ❤️ Like / Unlike post
//  */
// router.post("/:id/like", auth, async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post) return res.status(404).json({ message: "Post not found" });

//         const alreadyLiked = post.likes.includes(req.user._id);
//         if (alreadyLiked) {
//             post.likes.pull(req.user._id);
//         } else {
//             post.likes.push(req.user._id);
//         }
//         await post.save();

//         res.json({ likes: post.likes.length, liked: !alreadyLiked });
//     } catch (err) {
//         console.error("Like post error", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// /**
//  * 💬 Add comment
//  */
// router.post("/:id/comment", auth, async (req, res) => {
//     try {
//         const { text } = req.body;
//         if (!text) return res.status(400).json({ message: "Comment text required" });

//         const post = await Post.findById(req.params.id);
//         if (!post) return res.status(404).json({ message: "Post not found" });

//         const comment = {
//             user: req.user._id,
//             text,
//             createdAt: new Date(),
//         };

//         post.comments.push(comment);
//         await post.save();

//         const populated = await Post.findById(post._id)
//             .populate("comments.user", "username name avatarUrl");

//         res.status(201).json(populated.comments.pop());
//     } catch (err) {
//         console.error("Add comment error", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// /**
//  * ❌ Delete comment
//  */
// router.delete("/:postId/comment/:commentId", auth, async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.postId);
//         if (!post) return res.status(404).json({ message: "Post not found" });

//         const comment = post.comments.id(req.params.commentId);
//         if (!comment) return res.status(404).json({ message: "Comment not found" });

//         if (String(comment.user) !== String(req.user._id))
//             return res.status(403).json({ message: "Not authorized" });

//         comment.remove();
//         await post.save();

//         res.json({ message: "Comment deleted" });
//     } catch (err) {
//         console.error("Delete comment error", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// /**
//  * 🗑 Delete post (only owner)
//  */
// router.delete("/:id", auth, async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post) return res.status(404).json({ message: "Post not found" });

//         if (String(post.author) !== String(req.user._id))
//             return res.status(403).json({ message: "Not authorized" });

//         await post.deleteOne();

//         res.json({ message: "Post deleted" });
//     } catch (err) {
//         console.error("Delete post error", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// export default router;
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import Post from "../models/Post.js";

const router = Router();

/**
 * ✍️ Create post (text + media + tags)
 */
router.post("/", auth, upload.array("media", 6), async (req, res) => {
    try {
        const { text, tags } = req.body;
        const mediaUrls = (req.files || []).map((f) => `/uploads/${f.filename}`);
        const tagIds = tags ? JSON.parse(tags) : [];

        const post = await Post.create({
            author: req.user._id,
            text,
            mediaUrls,
            tags: tagIds,
        });

        const populated = await post.populate("author", "username name avatarUrl");

        res.status(201).json(populated);
    } catch (err) {
        console.error("Create post error", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * 📰 Get feed (self + friends)
 */
router.get("/feed", auth, async (req, res) => {
    try {
        const ids = [req.user._id, ...(req.user.friends || [])];

        const posts = await Post.find({ author: { $in: ids } })
            .populate("author", "username name avatarUrl")
            .populate("tags", "username name avatarUrl")
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(posts);
    } catch (err) {
        console.error("Get feed error", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * 👤 Get posts by user
 */
router.get("/user/:userId", auth, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate("author", "username name avatarUrl")
            .populate("tags", "username name avatarUrl")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (err) {
        console.error("Get user posts error", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * ❤️ Like / Unlike post
 */
router.post("/:id/like", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const alreadyLiked = post.likes.includes(req.user._id);
        if (alreadyLiked) {
            post.likes.pull(req.user._id);
        } else {
            post.likes.push(req.user._id);
        }
        await post.save();

        res.json({ likes: post.likes.length, liked: !alreadyLiked });
    } catch (err) {
        console.error("Like post error", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * 💬 Add comment
 */
router.post("/:id/comment", auth, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "Comment text required" });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = {
            user: req.user._id,
            text,
            createdAt: new Date(),
        };

        post.comments.push(comment);
        await post.save();

        const populated = await Post.findById(post._id)
            .populate("comments.user", "username name avatarUrl");

        res.status(201).json(populated.comments.pop());
    } catch (err) {
        console.error("Add comment error", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * ❌ Delete comment
 */
router.delete("/:postId/comment/:commentId", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (String(comment.user) !== String(req.user._id))
            return res.status(403).json({ message: "Not authorized" });

        comment.remove();
        await post.save();

        res.json({ message: "Comment deleted" });
    } catch (err) {
        console.error("Delete comment error", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * 🗑 Delete post (only owner)
 */
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (String(post.author) !== String(req.user._id))
            return res.status(403).json({ message: "Not authorized" });

        await post.deleteOne();

        res.json({ message: "Post deleted" });
    } catch (err) {
        console.error("Delete post error", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
