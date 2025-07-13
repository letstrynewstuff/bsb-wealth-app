import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Shield,
  CreditCard,
  Building,
  ArrowRight,
  Phone,
  BarChart2,
  Briefcase,
  DollarSign,
  Star,
  User,
  Users,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { HashLoader } from "react-spinners";

import homeImg from "../assets/homeimg.png";
import heroImg from "../assets/heroimg.png";
import wealthBg from "../assets/wealthbg.png";
import agBanking from "../assets/agloans.png";
import communityImg from "../assets/community.png";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import NavigationLinks from "../component/NavigationLinks";
import SocialMedia from "../component/SocialMedia";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${
            index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ rating, comment, author, position }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-white p-6 rounded-xl shadow-lg"
  >
    <StarRating rating={rating} />
    <p className="mt-4 text-gray-600 italic">{comment}</p>
    <div className="mt-4">
      <p className="font-semibold text-gray-900">{author}</p>
      <p className="text-sm text-gray-500">{position}</p>
    </div>
  </motion.div>
);

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (loginError) setLoginError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/client/login`, // Corrected URL and endpoint
        loginData
      );
      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem(
        "userData",
        JSON.stringify({ username: loginData.username, role })
      );
      window.location.href =
        role === "admin" ? "/admin/dashboard" : "/dashboard";
    } catch (err) {
      setLoginError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const reviews = [
    {
      rating: 5,
      comment:
        "BSB has been instrumental in helping me achieve my financial goals. Their personal approach to banking makes all the difference.",
      author: "Jess",
      position: "Small Business Owner",
    },
    {
      rating: 5,
      comment:
        "The wealth management team at BSB provided expert guidance for my retirement planning. I couldn't be more satisfied with their service.",
      author: "Emily",
      position: "Retired Professional",
    },
    {
      rating: 4,
      comment:
        "Great community bank with friendly staff and excellent mortgage services. They made my first home purchase a smooth experience.",
      author: "Rodriguez",
      position: "Homeowner",
    },
  ];

  const [homeownershipRef, homeownershipInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [wealthSectionRef, wealthSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [wealthFeaturesRef, wealthFeaturesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [whyChooseUsRef, whyChooseUsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [bankingSolutionsRef, bankingSolutionsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [customerReviewsRef, customerReviewsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaSectionRef, ctaSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [agSectionRef, agSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [committedRef, committedInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [communitySectionRef, communitySectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <HashLoader color="#2563EB" size={50} />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <Navbar />

        <div className="relative min-h-[60vh] md:h-[70vh] flex items-center justify-center text-white pt-24 md:pt-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImg})` }}
          ></div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center md:items-start justify-between py-12 space-y-10 md:space-y-0">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold"
              >
                Find the Best Mortgage
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6"
              >
                With Local Lenders That Care.
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Apply Now
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full md:w-80 bg-gray-200 text-black p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Online Banking Login
              </h3>
              {loginError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {loginError}
                </div>
              )}
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className="w-full p-2 mb-4 border rounded-md"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full p-2 mb-4 border rounded-md"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[20px] bg-blue-900"></div>
        </div>

        <motion.div
          ref={homeownershipRef}
          initial={{ opacity: 0, y: 50 }}
          animate={homeownershipInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={homeownershipInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={homeImg}
                alt="Homeownership Grant Program"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={homeownershipInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Finance your dream home at BSB!
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                You may qualify for the Homeownership Grant Program, with up to
                <span className="font-semibold text-blue-900"> $15,000</span>
                for first-time homebuyers!
              </p>
              <p className="text-gray-600 mb-6">
                Learn more below and contact us to see if you qualify.
              </p>
              <Link
                to="/services"
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center"
              >
                Learn More <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          ref={wealthSectionRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={wealthSectionInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-cover bg-center h-[400px] sm:h-[500px] flex items-center justify-center text-white"
          style={{ backgroundImage: `url(${wealthBg})` }}
        >
          <div className="text-center px-4 sm:px-6 max-w-md sm:max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold">
              A Wealth Team You Can Trust
            </h2>
            <p className="mt-4 text-base sm:text-lg">
              At the Bennington State Bank Trust & Wealth Management, we know
              that you want peace of mind when it comes to your financial
              picture. To do that, you need a trusted partner to help you
              understand the nuances of your unique financial situation.
            </p>
            <Link
              to="/wealth-management"
              className="mt-6 inline-block bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        <motion.div
          ref={wealthFeaturesRef}
          initial="hidden"
          animate={wealthFeaturesInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="bg-white py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={
                  <BarChart2 className="h-10 sm:h-12 w-10 sm:w-12 text-blue-900" />
                }
                title="Financial Planning"
                description="We bring intentionality to financial goals and peace of mind to wealth transition."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={
                  <Briefcase className="h-10 sm:h-12 w-10 sm:w-12 text-blue-900" />
                }
                title="Investment Management"
                description="We work to understand your objectives and risk tolerance, building an asset allocation that fits."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={
                  <DollarSign className="h-10 sm:h-12 w-10 sm:w-12 text-blue-900" />
                }
                title="Estate Planning"
                description="You've worked hard to create a legacy, let us help make the transition smooth."
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          ref={whyChooseUsRef}
          initial="hidden"
          animate={whyChooseUsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="py-16 sm:py-20 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
              Why Choose Us?
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Shield className="h-8 w-8" />}
                  title="Secure Banking"
                  description="State-of-the-art security measures protecting your financial assets 24/7"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<CreditCard className="h-8 w-8" />}
                  title="Digital Banking"
                  description="Access your accounts anytime, anywhere with our modern online banking platform"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Building className="h-8 w-8" />}
                  title="Personal Service"
                  description="Dedicated bankers providing personalized solutions for your needs"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={bankingSolutionsRef}
          initial="hidden"
          animate={bankingSolutionsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="bg-gray-50 py-16 sm:py-20"
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
              Banking Solutions
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <motion.div variants={itemVariants}>
                <ProductCard
                  title="Checking Accounts"
                  description="Free checking with no minimum balance"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ProductCard
                  title="Savings Accounts"
                  description="Competitive rates to help your money grow"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ProductCard
                  title="Personal Loans"
                  description="No matter the size of your business, we can help you reach the next stage with products and services designed for businesses."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ProductCard
                  title="Mortgages"
                  description="Our expert lenders can find the right home mortgage for you"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={customerReviewsRef}
          initial="hidden"
          animate={customerReviewsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="bg-gray-50 py-16 sm:py-20"
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
              What Our Customers Say
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {reviews.map((review, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ReviewCard {...review} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={ctaSectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={ctaSectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-blue-900 text-white py-16 sm:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us with their
              banking needs. Open an account in minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Open Account <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" /> Contact Us
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={agSectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={agSectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="ag-section flex flex-col md:flex-row items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={agSectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="ag-image w-full md:w-1/2 mb-6 md:mb-0"
          >
            <img src={agBanking} alt="Agriculture" className="w-full h-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={agSectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full md:w-1/2 flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4"
          >
            <div className="rounded-full bg-blue-100 p-4">
              <Users className="w-10 sm:w-12 h-10 sm:h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              AG Banking
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              Our experienced Ag Bankers specialize in lending options for
              farmers and ranchers. We can help you plan for a long-term future
              on your operation. We are your Ag Partner!
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          ref={committedRef}
          initial={{ opacity: 0, y: 50 }}
          animate={committedInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center py-12 sm:py-16 px-4 md:px-12 bg-white"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative inline-block mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Committed to You.
              </h1>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-blue-500"></div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-12">
              As a local independent community bank, we focus on developing
              relationships with our customers and strive to deliver exceptional
              service every time. At BSB, we offer local community bank service
              with years of banking experience paired with leading-edge
              financial products and services that make banking easy.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4
              bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg
              transform transition-all duration-200 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Find a BSB Location
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          ref={communitySectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={communitySectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative min-h-[24rem] sm:min-h-[32rem]"
        >
          <div className="absolute inset-0">
            <img
              src={communityImg}
              alt="Community"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-50"></div>
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              We Care About Community
            </h1>
            <div className="w-16 sm:w-24 h-1 bg-blue-500"></div>
            <div className="max-w-3xl space-y-3 sm:space-y-4">
              <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed">
                We are a family-owned community bank and make decisions based on
                what is best for you.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed">
                For over 130 years we have put our customers first, and that is
                the way we do business, always.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-lg
              transform transition-all duration-200 hover:scale-105 hover:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              About Us
            </motion.button>
          </div>
        </motion.div>

        <SocialMedia />

        <NavigationLinks />

        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all flex flex-col h-full"
  >
    <div className="text-blue-900 mb-4">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    <p className="text-gray-600 flex-grow">{description}</p>
    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition w-full mt-4">
      Learn More
    </button>
  </motion.div>
);

const ProductCard = ({ title, description }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow h-full"
  >
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link
      to="/services"
      className="text-blue-900 font-medium hover:text-blue-700 flex items-center mt-auto"
    >
      Learn More <ChevronRight className="ml-1 h-4 w-4" />
    </Link>
  </motion.div>
);

export default LandingPage;
