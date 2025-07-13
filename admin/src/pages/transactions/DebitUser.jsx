import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MinusCircle } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const DebitUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    reference: "",
    accountType: "",
    accountNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    setSelectedAccount("");
    setFormData((prev) => ({ ...prev, accountType: "", accountNumber: "" }));
  };

  const handleAccountChange = (e) => {
    const selectedAccountType = e.target.value;
    setSelectedAccount(selectedAccountType);

    const user = users.find((u) => u._id === selectedUser);
    if (user) {
      const account = user.accounts.find(
        (acc) => acc.type === selectedAccountType
      );
      if (account) {
        setFormData((prev) => ({
          ...prev,
          accountType: selectedAccountType,
          accountNumber: account.accountNumber,
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!selectedUser || !selectedAccount || !formData.accountNumber) {
      setError("Please select a user and an account.");
      setIsLoading(false);
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError("Amount must be positive.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/credit-debit-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          userId: selectedUser,
          accountType: formData.accountType,
          accountNumber: formData.accountNumber,
          amount: parseFloat(formData.amount),
          date: formData.date,
          description: formData.reference,
          action: "debit",
        }),
      });

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
        accountNumber: "",
      });
      setSelectedUser("");
      setSelectedAccount("");
    } catch (err) {
      setError(err.message);
      if (err.message.includes("403") || err.message.includes("401")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentUserAccounts =
    users.find((user) => user._id === selectedUser)?.accounts || [];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center mb-6">
        <MinusCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-700 mr-2" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Debit User
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
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
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
              disabled={isLoading}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} ({user.username})
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
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
                disabled={isLoading}
              >
                <option value="">Select an account</option>
                {currentUserAccounts.length > 0 ? (
                  currentUserAccounts.map((account) => (
                    <option key={account.accountNumber} value={account.type}>
                      {account.type.charAt(0).toUpperCase() +
                        account.type.slice(1)}{" "}
                      (Acct: {account.accountNumber}) (Balance: $
                      {account.balance.toFixed(2)})
                    </option>
                  ))
                ) : (
                  <option disabled>
                    No active accounts found for this user
                  </option>
                )}
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
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter amount"
              required
              min="0.01"
              disabled={isLoading}
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
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
              disabled={isLoading}
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
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter reference or description"
              rows="4"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-base"
            disabled={isLoading}
          >
            {isLoading ? "Debiting User..." : "Debit User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DebitUser;
