import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";
import axios from "axios";
import io from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const socket = io(API_BASE_URL, {
  auth: { token: localStorage.getItem("token") },
});

const AdminSupport = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!token || !userData || userData.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/support-messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit },
          }
        );
        const { messages: fetchedMessages, total } = response.data;
        setMessages((prev) =>
          page === 1 ? fetchedMessages : [...prev, ...fetchedMessages]
        );
        setHasMore(page * limit < total);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching support messages"
        );
        if ([401, 403].includes(err.response?.status)) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    socket.on("supportMessage", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => socket.off("supportMessage");
  }, [navigate, page]);

  const handleReplyChange = (e) => {
    setReply(e.target.value);
    if (error) setError("");
  };

  const handleSendReply = async (messageId) => {
    if (!reply.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/admin/support/reply`,
        { messageId, reply: reply.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply("");
      setSelectedMessageId(null);

      const response = await axios.get(
        `${API_BASE_URL}/api/admin/support-messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: page * limit }, // Refetch all messages up to current page
        }
      );
      setMessages(response.data.messages);
      setHasMore(page * limit < response.data.total);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reply");
      if ([401, 403].includes(err.response?.status)) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen">
      <Link
        to="/"
        className="mb-6 text-blue-600 flex items-center gap-2 hover:text-blue-700 text-sm sm:text-base"
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Admin Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-full">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Support Messages
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isLoading && page === 1 && (
          <div className="text-center text-gray-600">Loading messages...</div>
        )}

        <div className="space-y-4">
          {messages.length === 0 && !isLoading && (
            <p className="text-gray-600 text-center text-sm sm:text-base">
              No support messages available.
            </p>
          )}
          {messages.map((msg) => (
            <div key={msg._id} className="border-b pb-4 last:border-b-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-gray-800 font-medium text-sm sm:text-base break-words">
                    {msg.sender === "admin"
                      ? "Admin"
                      : `${msg.username} (${msg.email})`}
                  </p>
                  {msg.subject && (
                    <p className="text-gray-600 font-medium text-sm sm:text-base break-words">
                      Subject: {msg.subject}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm sm:text-base break-words">
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    | Status: {msg.status} | Sender: {msg.sender}
                  </p>
                </div>
                {(msg.sender === "client" || msg.sender === "visitor") &&
                  msg.status === "open" && (
                    <button
                      onClick={() => setSelectedMessageId(msg._id)}
                      className="text-blue-600 hover:underline text-sm sm:text-base flex-shrink-0"
                    >
                      Reply
                    </button>
                  )}
              </div>
              {selectedMessageId === msg._id && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={handleReplyChange}
                    placeholder="Type your reply..."
                    disabled={isLoading}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                  <button
                    onClick={() => handleSendReply(msg._id)}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-shrink-0"
                  >
                    {isLoading ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {hasMore && !isLoading && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreMessages}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              Load More
            </button>
          </div>
        )}

        {isLoading && page > 1 && (
          <div className="mt-4 text-center text-gray-600">
            Loading more messages...
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
