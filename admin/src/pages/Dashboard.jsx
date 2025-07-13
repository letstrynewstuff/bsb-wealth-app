import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  CreditCard,
  Clock,
  Bitcoin,
  PlusCircle,
} from "lucide-react";

const Dashboard = () => {
  const [accountCount, setAccountCount] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch number of accounts
  useEffect(() => {
    const fetchAccountCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setAccountCount(data.length);
      } catch (err) {
        setError("Error fetching account data");
        console.error(err);
        if (err.message.includes("403") || err.message.includes("401")) {
          navigate("/login");
        }
      }
    };

    fetchAccountCount();
  }, [navigate]);

  // Card data
  const dashboardCards = [
    {
      title: "All Customers",
      icon: <Users className="w-8 h-8 text-white" />,
      color: "bg-blue-600 hover:bg-blue-700",
      path: "/customers/all",
    },
    {
      title: "Add Client",
      icon: <UserPlus className="w-8 h-8 text-white" />,
      color: "bg-green-600 hover:bg-green-700",
      path: "/customers/add-client",
    },
    {
      title: "Quick Loan",
      icon: <Clock className="w-8 h-8 text-white" />,
      color: "bg-purple-600 hover:bg-purple-700",
      path: "/services/quick-loan",
    },
    {
      title: "Virtual Card",
      icon: <CreditCard className="w-8 h-8 text-white" />,
      color: "bg-indigo-600 hover:bg-indigo-700",
      path: "/services/virtual-card",
    },
    {
      title: "Credit/Debit Crypto",
      icon: <Bitcoin className="w-8 h-8 text-white" />,
      color: "bg-yellow-600 hover:bg-yellow-700",
      path: "/transactions/credit-debit-crypto",
    },
    {
      title: "Credit User",
      icon: <PlusCircle className="w-8 h-8 text-white" />,
      color: "bg-teal-600 hover:bg-teal-700",
      path: "/transactions/credit-user",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Admin Dashboard
      </h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Total Accounts</h3>
          <p className="text-3xl font-bold text-blue-700">{accountCount}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} p-6 rounded-lg shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-200`}
            onClick={() => navigate(card.path)}
          >
            <div className="flex items-center">
              {card.icon}
              <h3 className="ml-4 text-lg font-semibold text-white">
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
