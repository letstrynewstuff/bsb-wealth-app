import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileEdit } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const EditTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    status: "pending",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { transactionId } = useParams();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/transactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await res.json();
        setTransactions(data);

        if (transactionId) {
          const transaction = data.find((t) => t._id === transactionId);
          if (transaction) {
            setSelectedTransaction(transaction);
            setFormData({
              amount: transaction.amount,
              date: new Date(transaction.date).toISOString().split("T")[0],
              status: transaction.status,
              description: transaction.description || "",
            });
          } else {
            setError("Transaction not found");
          }
        }
      } catch (err) {
        setError(err.message || "Error fetching transactions");
        if (err.message.includes("403") || err.message.includes("401")) {
          navigate("/login");
        }
      }
    };

    fetchTransactions();
  }, [navigate, transactionId]);

  const handleSelectTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      date: new Date(transaction.date).toISOString().split("T")[0],
      status: transaction.status,
      description: transaction.description || "",
    });
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTransaction) {
      setError("Please select a transaction to edit");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/api/admin/transactions/${selectedTransaction._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            amount: parseFloat(formData.amount),
            date: formData.date,
            status: formData.status,
            description: formData.description,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update transaction");
      }

      setSuccess("Transaction updated successfully");
      setTransactions((prev) =>
        prev.map((t) =>
          t._id === selectedTransaction._id ? { ...t, ...data.transaction } : t
        )
      );
      setSelectedTransaction({ ...selectedTransaction, ...data.transaction });
    } catch (err) {
      setError(err.message);
      if (err.message.includes("403") || err.message.includes("401")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center mb-6">
        <FileEdit className="w-7 h-7 sm:w-8 sm:h-8 text-blue-700 mr-2" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Edit Transaction
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

      <div className="mb-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">
          Select Transaction
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                className={`p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 ${
                  selectedTransaction?._id === transaction._id
                    ? "bg-blue-100 border-blue-500 border-2 scale-105"
                    : "bg-white hover:bg-gray-50 hover:shadow-lg"
                }`}
                onClick={() => handleSelectTransaction(transaction)}
              >
                <p className="font-semibold text-sm sm:text-base break-words">
                  ID: {transaction._id}
                </p>
                <p className="text-sm sm:text-base">
                  Amount: ${transaction.amount?.toFixed(2) || "N/A"}
                </p>
                <p className="text-sm sm:text-base">
                  Date: {new Date(transaction.date).toLocaleDateString()}
                </p>
                <p className="text-sm sm:text-base">
                  Status: {transaction.status}
                </p>
                <p className="text-sm sm:text-base break-words">
                  Description: {transaction.description || "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No transactions found.
            </p>
          )}
        </div>
      </div>

      {selectedTransaction && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">
            Editing Transaction ID:{" "}
            <span className="break-words">{selectedTransaction._id}</span>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                required
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
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
                disabled={isLoading}
              >
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="onhold">On Hold</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                rows="4"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Transaction"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditTransaction;
