/**
 * 👥 Get friends list (dummy for now)
 * GET /api/friends
 */
router.get("/", auth, async (req, res) => {
    try {
        // Dummy friends list
        const dummyFriends = [
            {
                _id: "1",
                name: "Aarav Sharma",
                username: "aarav",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
                _id: "2",
                name: "Meera Kapoor",
                username: "meera",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
                _id: "3",
                name: "Rohit Verma",
                username: "rohit",
                avatar: "https://randomuser.me/api/portraits/men/45.jpg",
            },
        ];

        return res.json(dummyFriends);

        // 🔹 Note:
        // Agar future me DB ka real data chahiye to upar ka dummyFriends hata ke
        // tumhara actual mongoose query wapas use kar sakte ho:
        //
        // const user = await User.findById(req.user._id)
        //   .populate("friends", "username name avatarUrl")
        //   .lean();
        // res.json(user?.friends || []);
    } catch (err) {
        console.error("Get friends error", err);
        res.status(500).json({ message: "Server error" });
    }
});
