import { useEffect, useState } from "react";
import API from "../utils/api";
import PostCard from "../components/PostCard";
import SkeletonCard from "../components/SkeletonCard";

function Community() {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const res = await API.get("/community/posts");
            setPosts(res.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }

    async function createPost(e) {
        e.preventDefault();

        if (!text.trim()) return;

        try {
            const res = await API.post("/community/posts", { text });
            setPosts([res.data, ...posts]);
            setText("");
        } catch (error) {
            console.error("Error creating post:", error);
        }
    }

    const filteredPosts = posts.filter((post) => {
        const searchText = `${post.text} ${post.name} ${post.tag}`.toLowerCase();
        return searchText.includes(search.toLowerCase());
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Community</h1>
                <p className="text-gray-600 mt-2">
                    Connect with international students, ask questions, and share advice.
                </p>
            </div>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts, users, or topics..."
                className="w-full bg-white border rounded-xl px-4 py-3 mb-5"
            />

            <form onSubmit={createPost} className="bg-white border rounded-2xl p-5 mb-6">
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share a question, tip, or experience..."
            className="w-full border rounded-xl px-4 py-3 min-h-28"
        />

                <button className="mt-3 bg-red-700 text-white px-5 py-3 rounded-xl">
                    Post
                </button>
            </form>

            {!loading && filteredPosts.length === 0 && (
                <div className="bg-white border rounded-xl p-6 text-gray-600">
                    No posts found. Try searching something else.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {loading
                    ? Array(6)
                        .fill(0)
                        .map((_, i) => <SkeletonCard key={i} />)
                    : filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} refreshPosts={fetchPosts} />
                    ))}
            </div>
        </div>
    );
}

export default Community;