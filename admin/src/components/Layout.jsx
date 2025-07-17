import React, { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  Shield,
  Wallet,
  BanknoteIcon,
  UserPlus,
  FileImage,
  IdCard,
  Bitcoin,
  Receipt,
  FileEdit,
  PlusCircle,
  MinusCircle,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu, // Added Menu icon for mobile toggle
  X, // Added X icon for mobile close
} from "lucide-react";

const Layout = () => {
  const navigate = useNavigate();
  const [customersOpen, setCustomersOpen] = useState(false);
  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar visibility

  const sidebarRef = useRef(null); // Ref for the sidebar element

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Close sidebar when clicking outside of it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md overflow-y-auto transform transition-transform duration-300 ease-in-out
                    lg:relative lg:translate-x-0 ${
                      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
      >
        <div className="p-4 border-b flex justify-between items-center lg:block">
          <h1 className="text-xl font-bold">Bank Manager Admin</h1>
          <button
            type="button"
            className="lg:hidden p-1 rounded-md text-gray-700 hover:bg-gray-200"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg text-sm ${
                    // Adjusted font size
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
                onClick={closeSidebar} // Close sidebar on navigation
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </NavLink>
            </li>

            {/* Customers Section */}
            <li>
              <button
                onClick={() => setCustomersOpen(!customersOpen)}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm" // Adjusted font size
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <span>Customer Management</span>
                </div>
                {customersOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {customersOpen && (
                <ul className="pl-6 mt-1 space-y-1">
                  <li>
                    <NavLink
                      to="/customers/all"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      All Customers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/customers/add"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Customer OTP
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/customers/add-client"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Client
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/customers/client-photo"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <FileImage className="w-4 h-4 mr-2" />
                      Client Photo
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/customers/kyc-id-card"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <IdCard className="w-4 h-4 mr-2" />
                      KYC ID Card
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/security/questions"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Security Questions
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* Transactions Section */}
            <li>
              <button
                onClick={() => setTransactionsOpen(!transactionsOpen)}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm" // Adjusted font size
              >
                <div className="flex items-center">
                  <ArrowLeftRight className="w-5 h-5 mr-3" />
                  <span>Transaction Management</span>
                </div>
                {transactionsOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {transactionsOpen && (
                <ul className="pl-6 mt-1 space-y-1">
                  <li>
                    <NavLink
                      to="/transactions/crypto"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <Bitcoin className="w-4 h-4 mr-2" />
                      Investment Transaction
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/transactions/credit-debit-crypto"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <Bitcoin className="w-4 h-4 mr-2" />
                      Credit/Debit Investment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/transactions/edit"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <FileEdit className="w-4 h-4 mr-2" />
                      Edit Transaction
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/billing/client"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Client Billing
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/transactions/credit-user"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Credit User
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/transactions/debit-user"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <MinusCircle className="w-4 h-4 mr-2" />
                      Debit User
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* Banking Services */}
            <li>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm" // Adjusted font size
              >
                <div className="flex items-center">
                  <BanknoteIcon className="w-5 h-5 mr-3" />
                  <span>Banking Services</span>
                </div>
                {servicesOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {servicesOpen && (
                <ul className="pl-6 mt-1 space-y-1">
                  <li>
                    <NavLink
                      to="/services/virtual-card"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Virtual Card
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/services/quick-loan"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Quick Loan
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/beneficiaries/all"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      All Beneficiaries
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/services/support"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          // Adjusted font size
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                      onClick={closeSidebar}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      AdminSupport
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center lg:px-6">
          {" "}
          {/* Adjusted padding */}
          {/* Hamburger menu for mobile */}
          <button
            type="button"
            className="lg:hidden p-1 rounded-md text-gray-700 hover:bg-gray-200"
            onClick={toggleSidebar}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Bank Manager
          </h2>{" "}
          {/* Adjusted font size */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {" "}
            {/* Adjusted spacing */}
            <div className="rounded-full bg-gray-200 px-3 py-1 text-sm hidden sm:block">
              Admin
            </div>{" "}
            {/* Adjusted padding and font size, hidden on very small screens */}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm" // Adjusted font size
            >
              <LogOut className="w-4 h-4 mr-1 sm:mr-2" />{" "}
              {/* Adjusted margin */}
              <span className="hidden sm:inline">Logout</span>{" "}
              {/* Hidden on very small screens */}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {" "}
          {/* Adjusted padding */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
