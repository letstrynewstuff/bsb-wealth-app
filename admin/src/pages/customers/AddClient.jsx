import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, PlusCircle, MinusCircle } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const AddClient = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    nationality: "",
    username: "",
    password: "",
    accounts: [{ type: "checking", balance: "" }],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleAccountChange = (index, e) => {
    const { name, value } = e.target;
    const newAccounts = [...formData.accounts];
    newAccounts[index] = {
      ...newAccounts[index],
      [name]: value,
    };
    setFormData((prev) => ({ ...prev, accounts: newAccounts }));
    setError("");
    setSuccess("");
  };

  const handleAddAccount = () => {
    setFormData((prev) => ({
      ...prev,
      accounts: [...prev.accounts, { type: "checking", balance: "" }],
    }));
    setError("");
    setSuccess("");
  };

  const handleRemoveAccount = (index) => {
    if (formData.accounts.length > 1) {
      const newAccounts = formData.accounts.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, accounts: newAccounts }));
      setError("");
      setSuccess("");
    } else {
      setError("A client must have at least one account.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const validAccounts = formData.accounts
        .map((acc) => ({
          type: acc.type,
          balance: parseFloat(acc.balance) || 0,
        }))
        .filter((acc) => acc.type);

      if (validAccounts.length === 0) {
        throw new Error("Please add at least one account for the client.");
      }

      for (const account of validAccounts) {
        if (isNaN(account.balance)) {
          throw new Error("Initial balance must be a valid number.");
        }
        if (account.balance < 0) {
          throw new Error("Initial balance cannot be negative.");
        }
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/add-client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          username: formData.username,
          password: formData.password,
          accounts: validAccounts,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add client");
      }

      setSuccess(data.message || "Client added successfully");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        nationality: "",
        username: "",
        password: "",
        accounts: [{ type: "checking", balance: "" }],
      });
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
        <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-green-700 mr-2 mb-2 sm:mb-0" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Add Client
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter first name"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter last name"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter email"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter phone number"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter full address"
              rows="3"
              required
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label
                htmlFor="nationality"
                className="block text-sm font-medium text-gray-700"
              >
                Nationality
              </label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                value={formData.nationality}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter nationality"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter username"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-4 border p-4 rounded-lg bg-gray-50">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Client Accounts
            </h3>
            {formData.accounts.map((account, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end"
              >
                <div>
                  <label
                    htmlFor={`accountType-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Account Type {index + 1}
                  </label>
                  <select
                    id={`accountType-${index}`}
                    name="type"
                    value={account.type}
                    onChange={(e) => handleAccountChange(index, e)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                    disabled={isLoading}
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="debitcard">Debit Card</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor={`initialBalance-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Initial Balance {index + 1}
                  </label>
                  <div className="flex items-center mt-1">
                    <input
                      id={`initialBalance-${index}`}
                      name="balance"
                      type="number"
                      step="0.01"
                      value={account.balance}
                      onChange={(e) => handleAccountChange(index, e)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter initial balance"
                      disabled={isLoading}
                    />
                    {formData.accounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAccount(index)}
                        className="p-2 bg-red-500 text-white rounded-r-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                        aria-label={`Remove account ${index + 1}`}
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAccount}
              className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={isLoading}
            >
              <PlusCircle className="w-5 h-5 mr-2" /> Add Another Account
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-base"
            disabled={isLoading}
          >
            {isLoading ? "Adding Client..." : "Add Client"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
