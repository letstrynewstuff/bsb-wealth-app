import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const QuickLoan = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedUserAccounts, setSelectedUserAccounts] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    reference: "",
    action: "approve",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/loan-requests`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch loan requests");
        }

        const data = await res.json();
        setLoanRequests(data);
      } catch (err) {
        setError(err.message || "Error fetching loan requests");
        if (err.message.includes("403") || err.message.includes("401")) {
          navigate("/login");
        }
      }
    };

    fetchLoanRequests();
  }, [navigate]);

  const handleSelectRequest = async (request) => {
    setSelectedRequest(request);
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userRes = await fetch(
        `${API_BASE_URL}/api/admin/users/${request.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userRes.ok) {
        throw new Error("Failed to fetch user details for loan request");
      }
      const userData = await userRes.json();
      setSelectedUserAccounts(userData.accounts || []);

      setFormData({
        amount: request.amount,
        date: new Date().toISOString().split("T")[0],
        reference: `Loan ${request._id}`,
        action: "approve",
      });
    } catch (err) {
      setError(err.message || "Error fetching user details.");
    } finally {
      setIsLoading(false);
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

    if (!selectedRequest) {
      setError("Please select a loan request");
      setIsLoading(false);
      return;
    }

    const targetAccount = selectedUserAccounts.find(
      (acc) => acc.type === "checking"
    );

    if (!targetAccount) {
      setError(
        "Selected user does not have a checking account to process the loan."
      );
      setIsLoading(false);
      return;
    }

    let transactionAction = "";
    if (formData.action === "approve" || formData.action === "credit") {
      transactionAction = "credit";
    } else if (formData.action === "debit") {
      transactionAction = "debit";
    } else {
      setError("Invalid action selected.");
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
          userId: selectedRequest.userId,
          accountType: targetAccount.type,
          accountNumber: targetAccount.accountNumber,
          amount: parseFloat(formData.amount),
          date: formData.date,
          description: formData.reference,
          action: transactionAction,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || `Failed to process loan ${formData.action}`
        );
      }

      setSuccess(`Loan ${formData.action}d successfully`);
      setFormData({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        reference: "",
        action: "approve",
      });
      setSelectedRequest(null);
      setSelectedUserAccounts([]);

      const resLoans = await fetch(`${API_BASE_URL}/api/admin/loan-requests`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const updatedLoans = await resLoans.json();
      setLoanRequests(updatedLoans);
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
        <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-purple-700 mr-2" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Quick Loan
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
          Loan Requests
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loanRequests.length > 0 ? (
            loanRequests.map((request) => (
              <div
                key={request._id}
                className={`p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 ${
                  selectedRequest?._id === request._id
                    ? "bg-purple-100 border-purple-500 border-2 scale-105"
                    : "bg-white hover:bg-gray-50 hover:shadow-lg"
                }`}
                onClick={() => handleSelectRequest(request)}
              >
                <p className="font-semibold text-sm sm:text-base break-words">
                  Loan ID: {request._id}
                </p>
                <p className="text-sm sm:text-base break-words">
                  User ID: {request.userId}
                </p>
                <p className="text-sm sm:text-base">
                  Amount: ${request.amount?.toFixed(2) || "N/A"}
                </p>
                <p className="text-sm sm:text-base">Status: {request.status}</p>
                <p className="text-sm sm:text-base">
                  Date: {new Date(request.date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No loan requests found.
            </p>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">
            Manage Loan ID:{" "}
            <span className="break-words">{selectedRequest._id}</span>
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
            <div>
              <label
                htmlFor="action"
                className="block text-sm font-medium text-gray-700"
              >
                Action
              </label>
              <select
                id="action"
                name="action"
                value={formData.action}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
                disabled={isLoading}
              >
                <option value="approve">Approve Loan (Credits Checking)</option>
                <option value="credit">Credit Loan (Credits Checking)</option>
                <option value="debit">Debit Loan (Debits Checking)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuickLoan;
