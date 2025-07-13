import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileEdit } from "lucide-react";

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
  const navigate = useNavigate();
  const { transactionId } = useParams(); // Optional: For direct transaction editing via URL

  // Fetch all transactions or a specific transaction
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/transactions", {
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

        // If transactionId is provided in URL, pre-select it
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

  // Handle transaction selection
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTransaction) {
      setError("Please select a transaction to edit");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/transactions/${selectedTransaction._id}`,
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
      setError("");

      // Update local transaction list
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
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center mb-6">
        <FileEdit className="w-8 h-8 text-blue-700 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Edit Transaction
        </h2>
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

      {/* Transaction Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Select Transaction
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className={`p-4 rounded-lg shadow-md cursor-pointer ${
                selectedTransaction?._id === transaction._id
                  ? "bg-blue-100 border-blue-500 border-2"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleSelectTransaction(transaction)}
            >
              <p className="font-semibold">ID: {transaction._id}</p>
              <p>Amount: ${transaction.amount}</p>
              <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
              <p>Status: {transaction.status}</p>
              <p>Description: {transaction.description || "N/A"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedTransaction && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Editing Transaction ID: {selectedTransaction._id}
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
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
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
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Transaction
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditTransaction;
