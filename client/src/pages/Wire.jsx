import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, DollarSign } from "lucide-react"; // Using DollarSign for general transfer icon
import axios from "axios";
import io from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const socket = io(API_BASE_URL, {
  auth: { token: localStorage.getItem("token") },
});

const Wire = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountType: "", // This will be the type (e.g., 'checking')
    recipientAccountNumber: "", // This will be the 10-digit account number
    recipientAccountType: "",
    amount: "",
    description: "",
    recipientBank: "",
    recipientName: "", // Added for wire transfer
    swiftCode: "", // Added for wire transfer
    bankAddress: "", // Added for wire transfer
  });
  const [accounts, setAccounts] = useState([]); // User's own accounts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(""); // Corrected this line

  // Refs for OTP input fields
  const otpInputRefs = useRef([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("token");

    if (!token || !userData || userData.role !== "client") {
      console.log("No token or user data, redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/account`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(
          response.data.accounts.filter(
            (acc) => acc.status === "active" && acc.accountNumber
          )
        );
      } catch (err) {
        console.error("Fetch accounts error:", err);
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to fetch accounts. Please try again."
          );
        }
      }
    };
    fetchAccounts();

    socket.on("transactionUpdate", (transaction) => {
      if (transaction.userId === userData?.id) {
        setSuccess(
          "Your wire transfer has been successfully initiated. It will take 2-5 working days to process."
        );
        setShowOtpPopup(false);
        fetchAccounts();
      }
    });

    return () => {
      socket.off("transactionUpdate");
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5 && otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1].focus();
      }
      if (otpError) setOtpError("");
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0 && otpInputRefs.current[index - 1]) {
        otpInputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setOtpError("");
    setIsLoading(true);

    if (
      !formData.accountType ||
      !formData.recipientAccountNumber ||
      !formData.recipientAccountType ||
      !formData.amount ||
      !formData.recipientBank ||
      !formData.recipientName ||
      !formData.swiftCode ||
      !formData.bankAddress
    ) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      setError("Amount must be positive.");
      setIsLoading(false);
      return;
    }
    if (
      formData.recipientAccountNumber.length !== 10 ||
      !/^\d+$/.test(formData.recipientAccountNumber)
    ) {
      setError("Recipient Account Number must be a 10-digit number.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/client/transfers/initiate`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(
        "OTP has been sent to your registered email. Please enter it to complete the transfer."
      );
      setShowOtpPopup(true);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      console.error("Wire transfer initiation error:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "An error occurred during transfer initiation."
        );
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

      if (otpCode.length !== 6) {
        setOtpError("Please enter a 6-digit OTP.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/client/transfers/verify-otp`,
        { otp: otpCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message);
      setFormData({
        accountType: "",
        recipientAccountNumber: "",
        recipientAccountType: "",
        amount: "",
        description: "",
        recipientBank: "",
        recipientName: "",
        swiftCode: "",
        bankAddress: "",
      });
      setOtp(["", "", "", "", "", ""]);
      setShowOtpPopup(false);
    } catch (err) {
      console.error("OTP verification error:", err);
      if (err.response?.status === 401) {
        setOtpError("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate("/login");
      } else {
        setOtpError(
          err.response?.data?.message ||
            "An error occurred while verifying OTP."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl">
        <Link
          to="/dashboard/transfer"
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to transfer options
        </Link>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Wire Transfer
              </h2>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && !showOtpPopup && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                {success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  From Account Type
                </label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select account type</option>
                  {accounts.map((acc) => (
                    <option key={acc.accountNumber} value={acc.type}>
                      {acc.type.charAt(0).toUpperCase() + acc.type.slice(1)}{" "}
                      (Acct: {acc.accountNumber}) (Balance: $
                      {acc.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recipient Account Number
                </label>
                <input
                  name="recipientAccountNumber"
                  type="text"
                  placeholder="Enter 10-digit Account Number"
                  value={formData.recipientAccountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  maxLength="10"
                  pattern="\d{10}"
                  title="Recipient Account Number must be a 10-digit number."
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recipient Name
                </label>
                <input
                  name="recipientName"
                  type="text"
                  placeholder="Enter Recipient Name"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recipient Bank
                </label>
                <input
                  name="recipientBank"
                  type="text"
                  placeholder="Enter Recipient Bank Name"
                  value={formData.recipientBank}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recipient Bank SWIFT/BIC Code
                </label>
                <input
                  name="swiftCode"
                  type="text"
                  placeholder="Enter SWIFT/BIC Code"
                  value={formData.swiftCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recipient Bank Address
                </label>
                <input
                  name="bankAddress"
                  type="text"
                  placeholder="Enter Recipient Bank Address"
                  value={formData.bankAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recipient Account Type
                </label>
                <select
                  name="recipientAccountType"
                  value={formData.recipientAccountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select account type</option>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="debitcard">Debit Card</option>
                  <option value="investment">Investment</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  min="0.01"
                  step="0.01"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <input
                  name="description"
                  type="text"
                  placeholder="Enter transfer description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Initiating Transfer..." : "Make Wire Transfer"}
              </button>
            </form>
          </div>
        </div>

        {showOtpPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Enter OTP
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                An OTP has been sent to your registered email. Please enter the
                6-digit code below.
              </p>
              {otpError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                  {otpError}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm text-center">
                  {success}
                </div>
              )}
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                      disabled={isLoading}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Verifying..."
                    : "Verify OTP & Complete Transfer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpPopup(false);
                    setOtp(["", "", "", "", "", ""]);
                    setOtpError("");
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wire;
