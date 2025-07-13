import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import Logo from "../assets/logo.png";

const NavItem = ({ label, to, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className="group relative py-2 text-white focus:outline-none"
      aria-label={label}
      onClick={onClick}
    >
      <span
        className={`text-lg font-medium transition-colors ${
          isActive ? "text-yellow-400" : "hover:text-yellow-400"
        }`}
      >
        {label}
      </span>
      {/* Animated underline */}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-200 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
};

const DashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navItems = [
    { label: "Home", to: "/dashboard" },

    { label: "Transfer & Pay", to: "/dashboard/transfer" },
    { label: "Business Tools", to: "/dashboard/tools" },
    { label: "Help and Support", to: "/dashboard/support" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.reload();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-900 text-white p-4">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex-shrink-0 focus:outline-none">
          <img
            src={Logo}
            alt="BSB Logo"
            className="h-12 w-auto"
            loading="eager"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between flex-1">
          <div className="flex items-center ml-8 space-x-6">
            {navItems.map((item, index) => (
              <NavItem key={index} {...item} />
            ))}
          </div>

          {/* Right Side - Profile and Sign Out */}
          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard/profile"
              className="flex items-center space-x-2 hover:text-yellow-400 transition-colors focus:outline-none"
              aria-label="Profile"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <button
              type="button"
              className="flex items-center space-x-2 hover:text-blue-200 transition-colors focus:outline-none"
              onClick={handleLogout}
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-blue-900 bg-opacity-95">
          <div className="flex flex-col h-full p-4">
            {/* Header with logo and close button */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/dashboard" onClick={closeMenu}>
                <img
                  src={Logo}
                  alt="BSB Logo"
                  className="h-12 w-auto"
                  loading="eager"
                />
              </Link>
              <button
                type="button"
                className="p-2"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col space-y-6 mb-12">
              {navItems.map((item, index) => (
                <NavItem key={index} {...item} onClick={closeMenu} />
              ))}
            </div>

            {/* Profile and Sign Out */}
            <div className="mt-auto flex flex-col space-y-6 pb-8">
              <Link
                to="/dashboard/profile"
                className="flex items-center space-x-2 hover:text-yellow-400 transition-colors py-2 focus:outline-none"
                aria-label="Profile"
                onClick={closeMenu}
              >
                <User className="w-5 h-5" />
                <span className="text-lg">Profile</span>
              </Link>
              <button
                type="button"
                className="flex items-center space-x-2 hover:text-blue-200 transition-colors py-2 focus:outline-none"
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                aria-label="Sign Out"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-lg">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
