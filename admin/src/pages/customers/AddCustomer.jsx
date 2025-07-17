import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

// Define API base URL with fallback
const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

// Initialize socket only once
let socket;

const AddCustomer = () => {
  const [otps, setOtps] = useState([]);
  const [error, setError] = useState(null);

  // Establish socket connection
  useEffect(() => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined");
      setError(
        "API URL is not configured. Please check your environment variables."
      );
      return;
    }

    console.log("Connecting to Socket.IO at:", API_BASE_URL);
    socket = io(API_BASE_URL, {
      auth: { token: localStorage.getItem("token") },
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
      setError(
        "Failed to connect to real-time updates. Please refresh the page."
      );
    });

    socket.on("newOTP", (otpData) => {
      console.log("New OTP received:", otpData);
      if (otpData && typeof otpData === "object") {
        // Normalize otpId to _id
        const normalizedOtp = {
          ...otpData,
          otpId: otpData.otpId || otpData._id,
          userEmail: otpData.userEmail || otpData.userId?.email || "N/A",
        };
        setOtps((prevOtps) => [
          normalizedOtp,
          ...(Array.isArray(prevOtps) ? prevOtps : []),
        ]);
      } else {
        console.error("Invalid OTP data received:", otpData);
      }
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.off("newOTP");
        socket.off("connect");
        socket.off("connect_error");
        socket.disconnect();
      }
    };
  }, []);

  // Fetch OTPs on mount
  useEffect(() => {
    const fetchOtps = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error("API_BASE_URL is not defined");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        console.log("Fetching OTPs from:", `${API_BASE_URL}/api/admin/otps`);
        const response = await axios.get(`${API_BASE_URL}/api/admin/otps`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("OTP response data:", response.data);

        // Defensive check for array
        const data = Array.isArray(response.data) ? response.data : [];
        setOtps(
          data.map((otp) => ({
            ...otp,
            otpId: otp._id,
            userEmail: otp.userId?.email || "N/A",
          }))
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching OTPs:", err);
        const errorMessage =
          err.response?.status === 401
            ? "Unauthorized. Please log in again."
            : err.response?.status === 403
            ? "Access denied. Admin privileges required."
            : err.message || "Failed to fetch OTPs. Please try again.";
        setError(errorMessage);
        setOtps([]);
      }
    };
    fetchOtps();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Admin OTP Dashboard
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      {otps.length === 0 ? (
        <p className="text-gray-600">No OTPs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left text-gray-600">
                  OTP
                </th>
                <th className="py-2 px-4 border-b text-left text-gray-600">
                  User
                </th>
                <th className="py-2 px-4 border-b text-left text-gray-600">
                  Amount
                </th>
                <th className="py-2 px-4 border-b text-left text-gray-600">
                  Recipient
                </th>
                <th className="py-2 px-4 border-b text-left text-gray-600">
                  Bank
                </th>
                <th className="py-2 px-4 border-b text-left text-gray-600">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {otps.map((otp) => (
                <tr key={otp.otpId || otp._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{otp.otp || "N/A"}</td>
                  <td className="py-2 px-4 border-b">
                    {otp.userId?.username || "Unknown"} (
                    {otp.userEmail || "N/A"})
                  </td>
                  <td className="py-2 px-4 border-b">
                    ${otp.transferData?.amount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {otp.transferData?.recipientName || "N/A"} (
                    {otp.transferData?.recipientAccountNumber || "N/A"})
                  </td>
                  <td className="py-2 px-4 border-b">
                    {otp.transferData?.recipientBank || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {otp.createdAt
                      ? new Date(otp.createdAt).toLocaleString("en-US", {
                          timeZone: "Africa/Lagos",
                        })
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddCustomer;
