import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MinusCircle } from "lucide-react";

const DebitUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    reference: "",
    accountType: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/admin/users", {
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
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle user selection
  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    setSelectedAccount("");
    setFormData((prev) => ({ ...prev, accountType: "" }));
  };

  // Handle account selection
  const handleAccountChange = (e) => {
    const accountType = e.target.value;
    setSelectedAccount(accountType);
    setFormData((prev) => ({ ...prev, accountType }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedUser || !selectedAccount) {
      setError("Please select a user and account");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/admin/credit-debit-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            userId: selectedUser,
            accountType: formData.accountType,
            amount: parseFloat(formData.amount),
            date: formData.date,
            description: formData.reference,
            action: "debit", // <-- ADD THIS
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to debit user");
      }

      setSuccess("User debited successfully");
      setFormData({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        reference: "",
        accountType: "",
      });
      setSelectedUser("");
      setSelectedAccount("");
    } catch (err) {
      setError(err.message);
      if (err.message.includes("403") || err.message.includes("401")) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center mb-6">
        <MinusCircle className="w-8 h-8 text-red-700 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900">Debit User</h2>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-700"
            >
              Select User
            </label>
            <select
              id="user"
              value={selectedUser}
              onChange={handleUserChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div>
              <label
                htmlFor="accountType"
                className="block text-sm font-medium text-gray-700"
              >
                Select Account
              </label>
              <select
                id="accountType"
                value={selectedAccount}
                onChange={handleAccountChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select an account</option>
                {users
                  .find((user) => user._id === selectedUser)
                  ?.accounts.map((account) => (
                    <option key={account.type} value={account.type}>
                      {account.type} (Balance: ${account.balance})
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="reference"
              className="block text-sm font-medium text-gray-700"
            >
              Reference
            </label>
            <textarea
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter reference or description"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Debit User
          </button>
        </form>
      </div>
    </div>
  );
};

export default DebitUser;
