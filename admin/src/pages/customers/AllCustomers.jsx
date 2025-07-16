import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  XCircle,
  ShieldOff,
  Shield,
  PlusCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const AllCustomers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionStates, setActionStates] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [accountType, setAccountType] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [modalError, setModalError] = useState("");
  const navigate = useNavigate();

  const accountTypes = ["checking", "savings", "debitcard", "investment"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status}`);
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("403") || err.message.includes("401")) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleApiAction = async (userId, endpoint, method, body) => {
    setActionStates((prev) => ({
      ...prev,
      [userId]: { isLoading: true, error: null },
    }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "An error occurred");
      }
      return await res.json();
    } catch (err) {
      setActionStates((prev) => ({
        ...prev,
        [userId]: { isLoading: false, error: err.message },
      }));
      return null;
    }
  };

  const onApprove = async (userId) => {
    const result = await handleApiAction(
      userId,
      `/api/admin/users/${userId}/approve`,
      "PUT"
    );
    if (result) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                status: "active",
                accounts: user.accounts.map((acc) => ({
                  ...acc,
                  status: "active",
                })),
              }
            : user
        )
      );
      setActionStates((prev) => ({
        ...prev,
        [userId]: { isLoading: false, error: null },
      }));
    }
  };

  const onReject = async (userId) => {
    const result = await handleApiAction(
      userId,
      `/api/admin/users/${userId}/reject`,
      "DELETE"
    );
    if (result) {
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    }
  };

  const onStatusChange = async (userId, newStatus) => {
    const result = await handleApiAction(
      userId,
      `/api/admin/users/${userId}/status`,
      "PUT",
      { status: newStatus }
    );
    if (result) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                status: newStatus,
                accounts: user.accounts.map((acc) => ({
                  ...acc,
                  status: newStatus,
                })),
              }
            : user
        )
      );
      setActionStates((prev) => ({
        ...prev,
        [userId]: { isLoading: false, error: null },
      }));
    }
  };

  const onAddAccount = async () => {
    if (!accountType || !initialBalance || parseFloat(initialBalance) < 0) {
      setModalError("Please select an account type and enter a valid balance.");
      return;
    }

    const result = await handleApiAction(
      selectedUserId,
      `/api/admin/users/${selectedUserId}/accounts`,
      "POST",
      { type: accountType, balance: parseFloat(initialBalance) }
    );

    if (result) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUserId
            ? {
                ...user,
                accounts: [...user.accounts, result.account],
              }
            : user
        )
      );
      setModalOpen(false);
      setAccountType("");
      setInitialBalance("");
      setModalError("");
      setActionStates((prev) => ({
        ...prev,
        [selectedUserId]: { isLoading: false, error: null },
      }));
    } else {
      setModalError("Failed to add account. Please try again.");
    }
  };

  const openAddAccountModal = (userId) => {
    setSelectedUserId(userId);
    setModalOpen(true);
    setAccountType("");
    setInitialBalance("");
    setModalError("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUserId(null);
    setAccountType("");
    setInitialBalance("");
    setModalError("");
  };

  const getAvailableAccountTypes = (user) => {
    const existingTypes = user.accounts.map((acc) => acc.type);
    return accountTypes.filter((type) => !existingTypes.includes(type));
  };

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
                className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">
                    {user.firstName} {user.lastName} ({user.username})
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
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
                            <span className="font-medium">{account.type}</span>:
                            ${parseFloat(account.balance).toFixed(2)}
                            <span className="text-xs"> ({account.status})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  {actionStates[user._id]?.error && (
                    <p className="text-red-500 text-xs mb-2">
                      {actionStates[user._id].error}
                    </p>
                  )}
                  <div className="flex items-center justify-start space-x-2 flex-wrap">
                    {user.status === "pending" && (
                      <>
                        <button
                          onClick={() => onApprove(user._id)}
                          disabled={actionStates[user._id]?.isLoading}
                          className="flex items-center px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 m-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => onReject(user._id)}
                          disabled={actionStates[user._id]?.isLoading}
                          className="flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 m-1"
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </button>
                      </>
                    )}
                    {user.status === "active" && (
                      <>
                        <button
                          onClick={() => onStatusChange(user._id, "suspended")}
                          disabled={actionStates[user._id]?.isLoading}
                          className="flex items-center px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-400 m-1"
                        >
                          <ShieldOff className="w-4 h-4 mr-1" /> Hold/Block
                        </button>
                        <button
                          onClick={() => openAddAccountModal(user._id)}
                          disabled={actionStates[user._id]?.isLoading}
                          className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 m-1"
                        >
                          <PlusCircle className="w-4 h-4 mr-1" /> Add Account
                        </button>
                      </>
                    )}
                    {user.status === "suspended" && (
                      <button
                        onClick={() => onStatusChange(user._id, "active")}
                        disabled={actionStates[user._id]?.isLoading}
                        className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 m-1"
                      >
                        <Shield className="w-4 h-4 mr-1" /> Unblock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Adding Account */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Account
            </h3>
            {modalError && (
              <p className="text-red-500 text-sm mb-3">{modalError}</p>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={actionStates[selectedUserId]?.isLoading}
              >
                <option value="">Select account type</option>
                {getAvailableAccountTypes(
                  users.find((user) => user._id === selectedUserId)
                ).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Balance
              </label>
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="Enter initial balance"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={actionStates[selectedUserId]?.isLoading}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                disabled={actionStates[selectedUserId]?.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={onAddAccount}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                disabled={actionStates[selectedUserId]?.isLoading}
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCustomers;
