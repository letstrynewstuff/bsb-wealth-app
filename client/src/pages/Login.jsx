import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Logo from "../assets/logo.png";
import LoginBg from "../assets/loginbg.png";

const InfoBar = () => (
  <div className="w-full bg-blue-800 text-white py-2 px-4 text-sm text-center">
    Lost/Stolen Debit Card Call: 1.800.383.8000 | Billpay Support Call:
    1.866.665.0275
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/client/login",
        formData
      );

      const { token, user } = response.data;

      // Save full user object that includes ID
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(user));

      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <InfoBar />
      <div
        className="flex-1 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 30%, transparent 100%), 
                           url(${LoginBg})`,
        }}
      >
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-md">
            <div className="mb-8">
              <Link to="/">
                <img src={Logo} alt="BSB Logo" className="h-20 w-auto" />
              </Link>
            </div>
            <div className="bg-white shadow-lg rounded-lg bg-opacity-95 p-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                Welcome Back
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <Link
                    to="/contact"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
