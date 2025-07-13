import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const AllCustomers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Error fetching users");
        if (err.message.includes("403") || err.message.includes("401")) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center mb-6">
        <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-700 mr-2" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          All Customers
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading customers...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600 text-center">No customers found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">
                  {user.firstName} {user.lastName} ({user.username})
                </h3>
                <p className="text-gray-600 text-sm break-words">
                  <strong>ID:</strong> {user._id}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  <strong>Status:</strong> {user.status}
                </p>

                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Accounts
                  </h4>
                  {user.accounts.length === 0 ? (
                    <p className="text-gray-500 text-sm">No accounts</p>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1">
                      {user.accounts.map((account, index) => (
                        <li key={index} className="text-gray-600 text-sm">
                          <span className="font-medium">{account.type}</span>: $
                          {parseFloat(account.balance).toFixed(2)} (
                          {account.status}) (Acct: {account.accountNumber})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCustomers;
