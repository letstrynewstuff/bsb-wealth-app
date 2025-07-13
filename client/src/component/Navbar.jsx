import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import Logo from "../assets/logo.png";

const NAV_ITEMS = [
  { to: "/wealth-management", label: "Wealth Management" },
  { to: "/personal", label: "Personal" },
  { to: "/business", label: "Business" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Career" },
  { to: "/contact", label: "Contact" },
];

const NavItem = ({ to, label, onClick, isActive }) => (
  <Link
    to={to}
    className={`group relative flex items-center py-2 text-lg font-semibold transition-colors duration-200
      ${isActive ? "text-yellow-500" : "text-blue-600 hover:text-yellow-500"}`}
    onClick={onClick}
    aria-current={isActive ? "page" : undefined}
  >
    {label}
  </Link>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 bg-white shadow-md"
      role="navigation"
    >
      <div className="mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="flex h-28 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center transition-opacity hover:opacity-80"
              aria-label="Home"
            >
              <img
                src={Logo}
                alt="Company Logo"
                className="h-20 w-auto"
                loading="eager"
                width="80"
                height="80"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Navigation Links */}
          <div
            id="mobile-menu"
            className={`lg:flex lg:items-center lg:space-x-6
              ${
                isMenuOpen
                  ? "absolute left-0 top-full block w-full bg-white p-4 shadow-lg"
                  : "hidden"
              }
              lg:relative lg:block lg:w-auto lg:p-0 lg:shadow-none`}
          >
            <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-6 lg:space-y-0">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.to}
                  {...item}
                  onClick={() => setIsMenuOpen(false)}
                  isActive={location.pathname === item.to}
                />
              ))}
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-yellow-600 px-5 py-2 font-medium text-white 
                transition-all duration-200 hover:bg-yellow-700 hover:shadow-lg focus:outline-none focus:ring-2 
                focus:ring-yellow-500 focus:ring-offset-2 active:transform active:scale-95 lg:mt-0 lg:ml-6"
              onClick={() => setIsMenuOpen(false)}
            >
              ONLINE BANKING
            </Link>
          </div>

          {/* Search Button */}
          <button
            className="hidden rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 lg:block"
            aria-label="Search"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            <span
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 
              text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              Search
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
