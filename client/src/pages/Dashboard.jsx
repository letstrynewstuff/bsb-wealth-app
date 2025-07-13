import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Receipt,
  CreditCard,
  Users,
  Lightbulb,
  MessageSquare,
  ArrowRight,
  DollarSign,
  PiggyBank,
  Landmark,
  TrendingUp,
  Link,
  Clock,
  Brain,
  Gift,
  ChevronRight,
} from "lucide-react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("token") },
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Good Morning");
  const [userData, setUserData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // Dynamic Greeting Logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Fetch user and account data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/client/login");
          return;
        }

        const userRes = await fetch("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUserData(userData);

        const accountRes = await fetch("http://localhost:5000/api/account", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!accountRes.ok) throw new Error("Failed to fetch accounts");
        const accountData = await accountRes.json();
        setAccounts(accountData.accounts);

        const transRes = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!transRes.ok) throw new Error("Failed to fetch transactions");
        const transData = await transRes.json();
        setTransactions(transData.slice(0, 3)); // Show only 3 recent transactions
      } catch (err) {
        setError(err.message);
        if (err.message.includes("401") || err.message.includes("403")) {
          navigate("/client/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  // WebSocket for real-time updates
  useEffect(() => {
    socket.on("balanceUpdate", (data) => {
      if (data.userId === userData?._id) {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.type === data.accountType
              ? { ...acc, balance: data.balance }
              : acc
          )
        );
      }
    });

    socket.on("transactionUpdate", (transaction) => {
      if (transaction.userId === userData?._id) {
        setTransactions((prev) => [transaction, ...prev.slice(0, 2)]);
      }
    });

    return () => {
      socket.off("balanceUpdate");
      socket.off("transactionUpdate");
    };
  }, [userData]);

  // Navigation Handlers
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      {/* Blue Header Section */}
      <div className="bg-blue-800 h-40 p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold text-white">
                  {greeting}, {userData?.firstName || "User"}
                </h1>
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {[
                  {
                    icon: Send,
                    label: "Transfer",
                    path: "/dashboard/transfer",
                  },
                  {
                    icon: Users,
                    label: "Payroll",
                    path: "/dashboard/transfer",
                  },
                  {
                    icon: Receipt,
                    label: "Bills",
                    path: "/dashboard/transfer",
                  },
                  { icon: CreditCard, label: "Cards", path: "/manage-cards" },
                ].map(({ icon: Icon, label, path }, index) => (
                  <div
                    key={index}
                    onClick={() => handleNavigation(path)}
                    className="group flex items-center space-x-2 bg-blue-600 p-3 rounded-full whitespace-nowrap text-white transition-all duration-300 cursor-pointer hover:bg-blue-700 hover:scale-105 transform"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-end space-x-6">
                <div className="flex items-center space-x-2 p-2 text-white hover:bg-blue-700/20 rounded-full transition-colors cursor-pointer">
                  <div className="p-2 rounded-full">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <span className="text-sm">New insights</span>
                </div>
                <div className="flex items-center space-x-2 p-2 text-white hover:bg-blue-700/20 rounded-full transition-colors cursor-pointer">
                  <div className="p-2 rounded-full">
                    <MessageSquare className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Inbox</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account & Card Section */}
      <div className="container mx-auto px-6 mt-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Account & Card
            </h2>
            <div
              className="flex items-center space-x-2 text-blue-600 cursor-pointer hover:text-blue-700"
              onClick={() => handleNavigation("/accounts")}
            >
              <p className="text-sm">View account and card</p>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {accounts.length > 0 ? (
              accounts.map((account, index) => {
                const icons = {
                  checking: DollarSign,
                  savings: PiggyBank,
                  debitcard: CreditCard,
                  investment: TrendingUp,
                };
                const Icon = icons[account.type] || DollarSign;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border-2 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    onClick={() =>
                      account.type === "investment"
                        ? handleNavigation("/investment")
                        : handleNavigation(`/account/${account.type}`)
                    }
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <h3 className="text-sm font-medium text-gray-600">
                        {account.type.charAt(0).toUpperCase() +
                          account.type.slice(1)}
                      </h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-800">
                      ${account.balance.toFixed(2)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600">No accounts found</p>
            )}
          </div>
        </div>
      </div>

      {/* Four Main Section Boxes */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Link className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Quick Links
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Send,
                  title: "Send Money",
                  path: "/dashboard/transfer",
                },
                {
                  icon: Receipt,
                  title: "Pay Bills",
                  path: "/dashboard/transfer",
                },
                {
                  icon: CreditCard,
                  title: "Manage Cards",
                  path: "/manage-cards",
                },
                {
                  icon: PiggyBank,
                  title: "Savings Goals",
                  path: "/savings-goals",
                },
              ].map(({ icon: Icon, title, path }, index) => (
                <div
                  key={index}
                  onClick={() => handleNavigation(path)}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-blue-600 group-hover:rotate-12 transition-transform" />
                      <span className="text-sm font-medium">{title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Transactions
              </h2>
            </div>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-b border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.amount >= 0
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <DollarSign
                          className={`h-5 w-5 ${
                            transaction.amount >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-medium ${
                        transaction.amount >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount >= 0 ? "+" : "-"}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No transactions found</p>
              )}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => handleNavigation("/transactions")}
                className="text-blue-600 text-sm font-medium hover:underline hover:text-blue-800 transition-colors"
              >
                View all transactions
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Money Mindset
              </h2>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Financial Tip of the Day</h3>
                <p className="text-sm text-gray-700">
                  Set up automatic transfers to your savings account on payday
                  to build your emergency fund without thinking about it.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Budget Analysis</h3>
                <p className="text-sm text-gray-700">
                  You're spending 15% less on dining out this month compared to
                  last month. Great job!
                </p>
                <div className="mt-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Savings Challenge</h3>
                <p className="text-sm text-gray-700">
                  Join our 30-day savings challenge and save an extra $500 this
                  month!
                </p>
                <button className="mt-2 text-blue-600 text-sm font-medium hover:underline">
                  Join Challenge
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Gift className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Debit Card Deals
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "Target",
                  offer: "5% cashback on purchases over $50",
                  color: "red",
                },
                {
                  name: "Starbucks",
                  offer: "Free drink after 5 purchases",
                  color: "green",
                },
                {
                  name: "Amazon",
                  offer: "$10 off your next purchase over $50",
                  color: "blue",
                },
              ].map((deal, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-${deal.color}-100 p-2 rounded-lg`}>
                        <span
                          className={`text-lg font-bold text-${deal.color}-600`}
                        >
                          {deal.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{deal.name}</p>
                        <p className="text-sm text-gray-500">{deal.offer}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Activate
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-blue-600 text-sm font-medium hover:underline">
                View all deals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
