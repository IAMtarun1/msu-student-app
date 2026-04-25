import { useEffect, useRef, useState } from "react";
import API from "../utils/api";

const welcomeMessage = {
    sender: "bot",
    text: "Hi! I’m Hawk AI. Ask me about CPT, OPT, visa rules, jobs, events, or campus resources.",
};

const suggestions = [
    "How do I apply for CPT?",
    "What is OPT?",
    "Can I work off-campus on F-1?",
    "Where can I find on-campus jobs?",
];

function HawkAI() {
    const [messages, setMessages] = useState([welcomeMessage]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchChatHistory();
    }, []);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function fetchChatHistory() {
        try {
            const res = await API.get("/chat/history");

            if (res.data.length > 0) {
                setMessages([welcomeMessage, ...res.data]);
            }
        } catch (error) {
            console.error("Failed to load chat history:", error);
        } finally {
            setHistoryLoading(false);
        }
    }

    async function sendToBot(text) {
        if (!text.trim() || loading) return;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text,
            },
        ]);

        setInput("");
        setLoading(true);

        try {
            const res = await API.post("/chat/message", {
                message: text,
            });

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: res.data.reply,
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Sorry, Hawk AI could not respond right now. Please try again later.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    async function clearHistory() {
        try {
            await API.delete("/chat/history");
            setMessages([welcomeMessage]);
        } catch (error) {
            console.error("Failed to clear chat history:", error);
        }
    }

    function sendMessage(e) {
        e.preventDefault();
        sendToBot(input);
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border min-h-[75vh] flex flex-col overflow-hidden">
            <div className="border-b p-5 bg-gradient-to-r from-red-50 to-white">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-red-700 text-white flex items-center justify-center font-bold">
                            AI
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">Hawk AI Assistant</h1>
                            <p className="text-sm text-gray-500">
                                Visa, jobs, campus life, and international student support
                            </p>
                        </div>
                    </div>

                    {messages.length > 1 && (
                        <button
                            onClick={clearHistory}
                            className="text-sm border rounded-xl px-4 py-2 hover:bg-gray-100"
                        >
                            Clear chat
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-gray-50">
                {historyLoading ? (
                    <div className="bg-white border rounded-2xl p-4 text-gray-600">
                        Loading previous chat...
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-line shadow-sm ${
                                        msg.sender === "user"
                                            ? "bg-red-700 text-white rounded-br-sm"
                                            : "bg-white text-gray-800 border rounded-bl-sm"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {messages.length === 1 && (
                            <div className="bg-white border rounded-2xl p-4 shadow-sm">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Suggested questions
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => sendToBot(suggestion)}
                                            className="text-sm bg-gray-100 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-full transition"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border text-gray-600 max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Hawk AI is typing</span>
                                        <div className="flex gap-1">
                                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <form onSubmit={sendMessage} className="border-t p-4 bg-white">
                <div className="flex gap-3">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Hawk AI anything..."
                        className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
                    />

                    <button
                        disabled={loading || historyLoading || !input.trim()}
                        className="bg-red-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 hover:bg-red-800"
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                    For immigration questions, always confirm final decisions with CGCE/DSO.
                </p>
            </form>
            <div ref={messagesEndRef} />
        </div>
    );
}

export default HawkAI;