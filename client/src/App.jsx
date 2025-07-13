import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HashLoader } from "react-spinners"; // Import HashLoader
import PropTypes from "prop-types";

import Navbar from "./component/Navbar";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardNavbar from "./component/DashboardNavbar";
import Transfer from "./pages/Transfer";
import Ach from "./pages/Ach";
import Wire from "./pages/Wire";
import WealthManagement from "./pages/WealthManagement";
import Personal from "./pages/Personal";
import Business from "./pages/Business";
import ProfilePage from "./pages/ProfilePage";
import HelpSupport from "./pages/HelpSupport";
import BusinessTool from "./pages/BusinessTools";

// Page wrapper with animation
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Dashboard layout
const DashboardLayout = () => (
  <div>
    <DashboardNavbar />
    <div className="container mx-auto px-4 py-6">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pageTransitionLoading, setPageTransitionLoading] = useState(false); // New state for global page loading

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Effect to handle page transition loading
  useEffect(() => {
    setPageTransitionLoading(true); // Start loading when route changes
    const timer = setTimeout(() => {
      setPageTransitionLoading(false); // End loading after a short delay
    }, 500); // Adjust this duration as needed (e.g., to match your transition time)

    return () => clearTimeout(timer); // Cleanup timer
  }, [location.pathname]); // Re-run effect when pathname changes

  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isLoginPage = location.pathname === "/login";
  const isLandingPage = location.pathname === "/";

  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {(isLandingPage || (!isDashboardRoute && !isLoginPage)) && <Navbar />}

      {pageTransitionLoading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100">
          {" "}
          {/* Adjust height if Navbar is present */}
          <HashLoader color="#2563EB" size={50} />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <LandingPage />
                </PageWrapper>
              }
            />
            <Route
              path="/about"
              element={
                <PageWrapper>
                  <About />
                </PageWrapper>
              }
            />
            <Route
              path="/services"
              element={
                <PageWrapper>
                  <Services />
                </PageWrapper>
              }
            />
            <Route
              path="/contact"
              element={
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              }
            />
            <Route
              path="/wealth-management"
              element={
                <PageWrapper>
                  <WealthManagement />
                </PageWrapper>
              }
            />
            <Route
              path="/personal"
              element={
                <PageWrapper>
                  <Personal />
                </PageWrapper>
              }
            />
            <Route
              path="/business"
              element={
                <PageWrapper>
                  <Business />
                </PageWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              }
            />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                }
              />
              <Route
                path="transfer"
                element={
                  <PageWrapper>
                    <Transfer />
                  </PageWrapper>
                }
              />
              <Route
                path="transfer/ach"
                element={
                  <PageWrapper>
                    <Ach />
                  </PageWrapper>
                }
              />
              <Route
                path="transfer/wire"
                element={
                  <PageWrapper>
                    <Wire />
                  </PageWrapper>
                }
              />
              <Route
                path="profile"
                element={
                  <PageWrapper>
                    <ProfilePage />
                  </PageWrapper>
                }
              />
              <Route
                path="support"
                element={
                  <PageWrapper>
                    <HelpSupport />
                  </PageWrapper>
                }
              />
              <Route
                path="tools"
                element={
                  <PageWrapper>
                    <BusinessTool />
                  </PageWrapper>
                }
              />
              <Route
                path="settings"
                element={
                  <PageWrapper>
                    <div>Settings Page</div>
                  </PageWrapper>
                }
              />
            </Route>

            <Route
              path="*"
              element={
                <PageWrapper>
                  <NotFound />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      )}
    </div>
  );
};

export default App;
