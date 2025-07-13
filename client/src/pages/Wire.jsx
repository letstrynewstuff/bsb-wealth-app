import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Globe } from "lucide-react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("token") },
});

const Wire = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountType: "",
    accountNumber: "",
    recipientAccountNumber: "",
    recipientName: "",
    recipientAccountType: "",
    recipientBank: "",
    amount: "",
    description: "",
  });
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!token || !userData || userData.role !== "client") {
      navigate("/login");
      return;
    }

    const fetchAccounts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/account", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(res.data.accounts.filter((acc) => acc.status === "active"));
      } catch (err) {
        console.error("Fetch account error:", err);
        setError("Failed to fetch accounts.");
        if ([401, 403].includes(err.response?.status)) {
          navigate("/login");
        }
      }
    };

    fetchAccounts();

    socket.on("transactionUpdate", (tx) => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (tx.userId === userData?.id) {
        setSuccess("Transfer successfully initiated.");
        setShowOtpPopup(false);
      }
    });

    return () => socket.off("transactionUpdate");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
      if (otpError) setOtpError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const selectedAccount = accounts.find(
        (acc) => acc.type === formData.accountType
      );

      if (!selectedAccount) {
        setError("Invalid or missing sender account.");
        setIsLoading(false);
        return;
      }

      const payload = {
        ...formData,
        accountNumber: selectedAccount.accountNumber,
        amount: parseFloat(formData.amount),
      };

      await axios.post("http://localhost:5000/api/client/transfers", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("OTP sent to your email.");
      setShowOtpPopup(true);
    } catch (err) {
      console.error("Wire transfer error:", err);
      setError(err.response?.data?.message || "Error initiating transfer.");
      if ([401, 403].includes(err.response?.status)) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const otpCode = otp.join("");

      await axios.post(
        "http://localhost:5000/api/client/verify-otp",
        { otp: otpCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Transaction successful!");
      setOtp(["", "", "", "", "", ""]);
      setShowOtpPopup(false);

      setFormData({
        accountType: "",
        accountNumber: "",
        recipientAccountNumber: "",
        recipientName: "",
        recipientAccountType: "",
        recipientBank: "",
        amount: "",
        description: "",
      });
    } catch (err) {
      console.error("OTP error:", err);
      setOtpError(err.response?.data?.message || "OTP verification failed.");
      if ([401, 403].includes(err.response?.status)) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 max-w-2xl mx-auto">
      <Link
        to="/dashboard/transfer"
        className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm sm:text-base"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back to transfer options
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Wire Transfer
          </h2>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        {success && !showOtpPopup && (
          <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-sm sm:text-base"
        >
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select account type</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc.type}>
                {acc.type.charAt(0).toUpperCase() + acc.type.slice(1)} (Balance:
                ${acc.balance})
              </option>
            ))}
          </select>

          <input
            name="recipientAccountNumber"
            type="text"
            placeholder="Recipient Account Number"
            value={formData.recipientAccountNumber}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="recipientName"
            type="text"
            placeholder="Recipient Name"
            value={formData.recipientName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="recipientBank"
            type="text"
            placeholder="Recipient Bank"
            value={formData.recipientBank}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <select
            name="recipientAccountType"
            value={formData.recipientAccountType}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Recipient Account Type</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="debitcard">Debit Card</option>
            <option value="investment">Investment</option>
          </select>

          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="description"
            type="text"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLoading ? "Processing..." : "Submit Wire Transfer"}
          </button>
        </form>
      </div>

      {/* OTP Modal */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Enter OTP
            </h3>
            {otpError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {otpError}
              </div>
            )}
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-10 h-10 text-center border rounded"
                    required
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setShowOtpPopup(false)}
                className="w-full mt-2 text-gray-600 bg-gray-200 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success === "Transaction successful!" && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4">
              Bennington State Bank
            </h2>
            <p className="text-gray-800 mb-3">
              We are pleased to confirm that your transaction with{" "}
              <strong className="text-blue-700">Bennington State Bank</strong>{" "}
              has been successfully completed.
            </p>
            <p className="text-gray-600 mb-6 text-sm">
              The transfer has been processed securely. If you have any
              questions, feel free to contact support.
            </p>
            <button
              onClick={() => setSuccess("")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wire;
