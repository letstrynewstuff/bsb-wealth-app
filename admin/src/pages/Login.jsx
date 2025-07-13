import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";


const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); 

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      
      if (data.user.role !== "admin") {
        setError("Access denied: Admin credentials required.");
        setIsLoading(false); // Reset loading state
        return;
      }

      
      localStorage.setItem("token", data.token);
      
      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          firstName: data.user.firstName,
          role: data.user.role,
        })
      );

      // Redirect to the admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-blue-700 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              placeholder="Enter password"
              required
              disabled={isLoading} 
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading} 
          >
            {isLoading ? "Logging in..." : "Login"} {/* Show loading text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
