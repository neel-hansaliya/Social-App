// import { Router } from "express";
// const router = Router();

// // Dummy Friends Data
// const dummyFriends = [
//   {
//     _id: "1",
//     name: "Rahul Sharma",
//     bio: "Traveler ✈️ | Photographer 📸",
//     avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
//     posts: [
//       { id: 1, content: "Exploring the mountains today 🏔️", image: "https://picsum.photos/300/200?random=11" },
//       { id: 2, content: "Sunset vibes 🌅", image: "https://picsum.photos/300/200?random=12" }
//     ]
//   },
//   {
//     _id: "2",
//     name: "Priya Verma",
//     bio: "Foodie 🍕 | Lifestyle blogger ✨",
//     avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
//     posts: [
//       { id: 1, content: "Tried new Italian pasta today 🍝", image: "https://picsum.photos/300/200?random=13" },
//       { id: 2, content: "Self-care Sundays 💖", image: "https://picsum.photos/300/200?random=14" }
//     ]
//   },
//   {
//     _id: "3",
//     name: "Amit Patel",
//     bio: "Tech Geek 💻 | Gamer 🎮",
//     avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
//     posts: [
//       { id: 1, content: "Learning React hooks 🔥", image: "https://picsum.photos/300/200?random=15" },
//       { id: 2, content: "Weekend gaming marathon 🎮", image: "https://picsum.photos/300/200?random=16" }
//     ]
//   }
// ];

// // ✅ Dummy suggestions API
// router.get("/suggestions", (req, res) => {
//   res.json(dummyFriends);
// });

// // ✅ Single friend profile
// router.get("/suggestions/:id", (req, res) => {
//   const friend = dummyFriends.find(f => f._id === req.params.id);
//   if (friend) {
//     res.json(friend);
//   } else {
//     res.status(404).json({ message: "Friend not found" });
//   }
// });

// // Get user profile by ID
// router.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).populate("posts");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user profile" });
//   }
// });

// export default router;

// backend/routes/friends.routes.js
import { Router } from "express";
const router = Router();

// Dummy Friends Data
const dummyFriends = [
  {
    _id: "1",
    name: "Rahul Sharma",
    bio: "Traveler ✈️ | Photographer 📸",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    posts: [
      { id: 1, content: "Exploring the mountains today 🏔️", image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=pexels-souvenirpixels-417074.jpg&fm=jpg" },
      { id: 2, content: "Sunset vibes 🌅", image: "https://media.istockphoto.com/id/485371557/photo/twilight-at-spirit-island.jpg?s=612x612&w=0&k=20&c=FSGliJ4EKFP70Yjpzso0HfRR4WwflC6GKfl4F3Hj7fk=" }
    ]
  },
  {
    _id: "2",
    name: "Priya Verma",
    bio: "Foodie 🍕 | Lifestyle blogger ✨",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    posts: [
      { id: 1, content: "Tried new Italian pasta today 🍝", image: "https://img.freepik.com/free-photo/morskie-oko-tatry_1204-510.jpg?semt=ais_hybrid&w=740&q=80" },
      { id: 2, content: "Self-care Sundays 💖", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRykJNo8ajLZVWDvJ6ygo8o_mSm6GLFy-hk2lSZvsUowMfNACVaPo3cEF2HTmPiQlautoo&usqp=CAU" }
    ]
  },
  {
    _id: "3",
    name: "Amit Patel",
    bio: "Tech Geek 💻 | Gamer 🎮",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    posts: [
      { id: 1, content: "Learning React hooks 🔥", image: "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-fall-nature-scenery-free-image.jpeg?w=2210&quality=70" },
      { id: 2, content: "Weekend gaming marathon 🎮", image: "https://r44performance.com/cdn/shop/articles/BMW-G90-M5-Review-Specs.jpg?v=1719568245&width=1500" }
    ]
  }
];

// ✅ Suggestions API
router.get("/suggestions", (req, res) => {
  res.json(dummyFriends);
});

// ✅ Single friend profile
router.get("/suggestions/:id", (req, res) => {
  const friend = dummyFriends.find(f => f._id === req.params.id);
  if (friend) {
    res.json(friend);
  } else {
    res.status(404).json({ message: "Friend not found" });
  }
});

export default router;
