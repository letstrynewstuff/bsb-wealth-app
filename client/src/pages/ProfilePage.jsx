import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { HiUserCircle } from "react-icons/hi";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(
          "http://localhost:5000/api/client/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">{error || "Loading..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100">
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6">
        {/* Profile Icon */}
        <HiUserCircle className="w-32 h-32 text-blue-600 mb-6" />

        {/* User Details */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {profile.firstName} {profile.lastName}
          </h1>

          <div className="space-y-2 text-gray-600">
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone}
            </p>
            <p>
              <strong>Address:</strong> {profile.address}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(profile.dateOfBirth).toLocaleDateString()}
            </p>
            <p>
              <strong>Nationality:</strong> {profile.nationality}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`capitalize ${
                  profile.status === "active"
                    ? "text-green-600"
                    : profile.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {profile.status}
              </span>
            </p>
          </div>
        </div>

        {/* Accounts */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full mt-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Accounts</h2>
          {profile.accounts.length > 0 ? (
            <div className="space-y-4">
              {profile.accounts.map((account, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 text-gray-600"
                >
                  <p>
                    <strong>Type:</strong>{" "}
                    {account.type.charAt(0).toUpperCase() +
                      account.type.slice(1)}
                  </p>
                  <p>
                    <strong>Account Number:</strong> {account.accountNumber}
                  </p>
                  <p>
                    <strong>Balance:</strong> ${account.balance.toFixed(2)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`capitalize ${
                        account.status === "active"
                          ? "text-green-600"
                          : account.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {account.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No accounts found.</p>
          )}
        </div>
      </div>

      {/* Bank Footer */}
      <footer className="bg-blue-800 text-white w-full py-6 text-center">
        <p className="text-lg font-semibold">Bennington State Bank</p>
        <p className="text-sm">123 Bank Street, Bennington, USA</p>
        <p className="text-sm">Customer Support: 1-800-555-1234</p>
        <p className="text-sm">
          Email:{" "}
          <a
            href="mailto:support@benningtonstatebank.com"
            className="underline hover:text-blue-300"
          >
            support@benningtonstatebank.com
          </a>
        </p>
        <p className="text-xs mt-2">
          &copy; {new Date().getFullYear()} Bennington State Bank. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default ProfilePage;
