import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const QuickLoan = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    reference: "",
    action: "approve",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch loan requests
  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(
          "http://localhost:5000/api/admin/loan-requests",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

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

  // Handle loan request selection
  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setFormData({
      amount: request.amount,
      date: new Date().toISOString().split("T")[0],
      reference: `Loan ${request._id}`,
      action: "approve",
    });
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

    if (!selectedRequest) {
      setError("Please select a loan request");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        formData.action === "approve"
          ? "http://localhost:5000/api/admin/approve-loan"
          : formData.action === "credit"
          ? "http://localhost:5000/api/admin/credit-loan"
          : "http://localhost:5000/api/admin/debit-loan";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          loanId: selectedRequest._id,
          userId: selectedRequest.userId,
          amount: parseFloat(formData.amount),
          date: formData.date,
          description: formData.reference,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${formData.action} loan`);
      }

      setSuccess(`Loan ${formData.action}d successfully`);
      setFormData({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        reference: "",
        action: "approve",
      });
      setSelectedRequest(null);

      // Refresh loan requests
      const resLoans = await fetch(
        "http://localhost:5000/api/admin/loan-requests",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      const updatedLoans = await resLoans.json();
      setLoanRequests(updatedLoans);
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
        <Clock className="w-8 h-8 text-purple-700 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900">Quick Loan</h2>
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

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Loan Requests
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loanRequests.map((request) => (
            <div
              key={request._id}
              className={`p-4 rounded-lg shadow-md cursor-pointer ${
                selectedRequest?._id === request._id
                  ? "bg-purple-100 border-purple-500 border-2"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleSelectRequest(request)}
            >
              <p className="font-semibold">Loan ID: {request._id}</p>
              <p>User ID: {request.userId}</p>
              <p>Amount: ${request.amount}</p>
              <p>Status: {request.status}</p>
              <p>Date: {new Date(request.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedRequest && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Manage Loan ID: {selectedRequest._id}
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
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="approve">Approve Loan</option>
                <option value="credit">Credit Loan Amount</option>
                <option value="debit">Debit Loan Amount</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuickLoan;
