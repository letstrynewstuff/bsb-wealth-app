import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";

import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("token") },
});

const AdminSupport = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!token || !userData || userData.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/support-messages",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Fetch support messages error:", err);
        setError(
          err.response?.data?.message || "Error fetching support messages"
        );
        if ([401, 403].includes(err.response?.status)) {
          navigate("/login");
        }
      }
    };

    fetchMessages();

    socket.on("supportMessage", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => socket.off("supportMessage");
  }, [navigate]);

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
        "http://localhost:5000/api/admin/support/reply",
        { messageId, reply: reply.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply("");
      setSelectedMessageId(null);
    } catch (err) {
      console.error("Send reply error:", err);
      setError(err.response?.data?.message || "Error sending reply");
      if ([401, 403].includes(err.response?.status)) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        to="/admin/dashboard"
        className="mb-6 text-blue-600 flex items-center gap-2 hover:text-blue-700"
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Admin Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-full">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Support Messages
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {messages.length === 0 && (
            <p className="text-gray-600 text-center">
              No support messages available.
            </p>
          )}
          {messages.map((msg) => (
            <div key={msg._id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800 font-medium">
                    {msg.sender === "client"
                      ? `${msg.username} (${msg.email})`
                      : "Admin"}
                  </p>
                  <p className="text-gray-600">{msg.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    | Status: {msg.status}
                  </p>
                </div>
                {msg.sender === "client" && msg.status === "open" && (
                  <button
                    onClick={() => setSelectedMessageId(msg._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Reply
                  </button>
                )}
              </div>
              {selectedMessageId === msg._id && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={handleReplyChange}
                    placeholder="Type your reply..."
                    disabled={isLoading}
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={() => handleSendReply(msg._id)}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
