import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import io from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const socket = io(API_BASE_URL, {
  auth: { token: localStorage.getItem("token") },
});

const HelpSupport = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

// HelpSupport.jsx

useEffect(() => {
  const token = localStorage.getItem("token"); // Correctly get the token from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // If there's no token, the user isn't logged in. Redirect them.
  if (!token) {
    navigate("/login");
    return;
  }

  // Log the API_BASE_URL being used for debugging on Vercel
  console.log("HelpSupport: API_BASE_URL:", API_BASE_URL);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/client/support-messages`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Now the correct token is used
        }
      );
      setMessages(response.data);
    } catch (err) {
      console.error("HelpSupport: Fetch messages error:", err);
      setError(err.response?.data?.message || "Error fetching messages");

      if ([401, 403].includes(err.response?.status)) {
        console.log(
          "HelpSupport: API call failed with 401/403, redirecting to login."
        );
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate("/login");
      }
    }
  };

  fetchMessages();

  socket.on("supportReply", (msg) => {
    if (userData && msg.userId === userData.id) {
      setMessages((prev) => [...prev, msg]);
    }
  });

  return () => socket.off("supportReply");
}, [navigate]); // navigate dependency is correct

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (error) setError("");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("userData")); // Re-fetch userData for consistency

      await axios.post(
        `${API_BASE_URL}/api/client/support`,
        { message: message.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        {
          userId: userData ? userData.id : "unknown", // Use userData if available
          username: userData ? userData.username : "unknown", // Use userData if available
          email: userData ? userData.email : "unknown", // Use userData if available
          message: message.trim(),
          sender: "client",
          timestamp: new Date(),
          status: "open",
        },
      ]);
      setMessage("");
    } catch (err) {
      console.error("HelpSupport: Send message error:", err);
      setError(err.response?.data?.message || "Error sending message");

      if ([401, 403].includes(err.response?.status)) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        to="/dashboard"
        className="mb-6 text-blue-600 flex items-center gap-2 hover:text-blue-700"
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-full">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Help & Support
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Contact Us
          </h3>
          <p className="text-gray-600">
            Reach out to our support team for assistance with your account,
            transactions, or any banking needs. Our team is available 24/7 to
            help you.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
          {messages.length === 0 && (
            <p className="text-gray-600 text-center">No messages yet.</p>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.sender === "client" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === "client"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>

        <div className="mt-6 text-gray-600 text-sm">
          <p>
            For urgent issues, contact our support team at{" "}
            <a
              href="mailto:support@benningtonstatebank.com"
              className="text-blue-600 hover:underline"
            >
              info@benigtonbk.com
            </a>{" "}
            or call <strong>1-800-555-1234</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
