import { useState } from "react";
import API from "../utils/api";

function PostCard({ post, refreshPosts }) {
    const [commentText, setCommentText] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || user?._id;

    const isLiked = post.likedBy?.some(
        (id) => id.toString() === userId?.toString()
    );

    async function handleLike() {
        try {
            await API.post(`/community/posts/${post.id}/like`);
            refreshPosts();
        } catch (error) {
            console.error("Like failed", error);
        }
    }

    async function handleComment(e) {
        e.preventDefault();

        if (!commentText.trim()) return;

        try {
            await API.post(`/community/posts/${post.id}/comment`, {
                text: commentText,
            });

            setCommentText("");
            refreshPosts();
        } catch (error) {
            console.error("Comment failed", error);
        }
    }

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex justify-between">
                <div>
                    <h3 className="font-semibold">{post.name}</h3>
                    <p className="text-sm text-gray-500">
                        {post.country} • {post.program}
                    </p>
                </div>

                <span className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full">
          {post.tag}
        </span>
            </div>

            <p className="mt-4 text-gray-700">{post.text}</p>

            <div className="mt-4 flex gap-4 text-sm">
                <button
                    onClick={handleLike}
                    className={
                        isLiked
                            ? "text-red-700 font-semibold"
                            : "text-gray-600 hover:text-red-700"
                    }
                >
                    {isLiked ? "♥ Liked" : "♡ Like"} ({post.likes})
                </button>

                <span className="text-gray-500">
          {post.comments?.length || 0} comments
        </span>
            </div>

            <div className="mt-4 space-y-3 border-t pt-4">
                {post.comments?.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-semibold">{comment.user}</p>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                ))}

                <form onSubmit={handleComment} className="flex gap-2">
                    <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />

                    <button className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                        Comment
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostCard;