// frontend/src/pages/Home.jsx
import React from "react";
import Feed from "./Feed.jsx";
import FriendsPanel from "../components/FriendPanel.jsx";

export default function Home() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <aside className="md:col-span-1">
                <FriendsPanel />
            </aside>

            <main className="md:col-span-2">
                <Feed />
            </main>

            <aside className="md:col-span-1">
                <FriendsPanel /> {/* Right column suggestions */}
            </aside>
        </div>
    );
}
