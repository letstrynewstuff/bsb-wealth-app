import  { useState, useEffect } from "react"; // Import useEffect
import { Link } from "react-router-dom";
import {
  User,
  DollarSign,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Award,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Mail,
  Phone,
  Home,
} from "lucide-react";
import Footer from "../component/Footer"; // Assuming you have a Footer component
import Navbar from "../component/Navbar"; // Assuming you have a Navbar component
import axios from "axios"; // For form submission
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import { useInView } from "react-intersection-observer"; // Import useInView
import { HashLoader } from "react-spinners"; // Import a loader component
import PropTypes from "prop-types"; // Keep PropTypes for prop validation

// Placeholder images (replace with actual paths in src/assets/)
import personalHero from "../assets/personalHero.jpg"; // Hero background
import checkingImg from "../assets/firstbank.png"; // Checking account
import savingsImg from "../assets/savingsImg.jpg"; // Savings account
import investmentImg from "../assets/investmentImg.jpg"; // Investment account
import perksBg from "../assets/perksBg.jpg"; // Perks background
import formBg from "../assets/agloans.png"; // Form side image

const Personal = () => {
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
    accountType: "checking", // Default to checking for personal
  });
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // State for overall page loading

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000); // Simulate a 1 second load time
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setRegistrationMessage("");
    setRegistrationError("");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRegistrationMessage("");
    setRegistrationError("");

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        ...formData,
        accounts: [{ type: formData.accountType, balance: 0 }], // Send account type for registration
      });
      setRegistrationMessage(response.data.message);
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
        accountType: "checking",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setRegistrationError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // useInView hooks for scroll animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [accountsRef, accountsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [perksRef, perksInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants for staggered reveal of cards/items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between children animations
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
        key="personal-page" // Unique key for this page
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col"
      >
        <Navbar />

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative h-[50vh] pt-20 md:h-[65vh] bg-cover bg-center flex items-center justify-center text-white"
          style={{
            backgroundImage: personalHero
              ? `url(${personalHero})`
              : "url(https://placehold.co/1920x1080/000000/FFFFFF?text=Personal+Hero)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-70"></div>
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              Your Personal Banking Partner
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl max-w-2xl mx-auto"
            >
              Secure, convenient, and tailored financial solutions for your
              everyday life and future goals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="#create-account-form"
                className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
              >
                Open an Account Today <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Account Types Section */}
        <motion.section
          ref={accountsRef}
          initial="hidden"
          animate={accountsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Accounts Designed for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <AccountTypeCard
                  icon={<DollarSign className="h-12 w-12 text-blue-600" />}
                  image={checkingImg}
                  title="Checking Accounts"
                  description="Manage your daily finances with ease. Enjoy features like online bill pay, mobile deposits, and no monthly fees with qualifying activity."
                  perks={[
                    "Free online banking & bill pay",
                    "Mobile deposit & alerts",
                    "Debit card with rewards",
                  ]}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <AccountTypeCard
                  icon={<PiggyBank className="h-12 w-12 text-green-600" />}
                  image={savingsImg}
                  title="Savings Accounts"
                  description="Grow your money with competitive interest rates and flexible savings options. Perfect for short-term goals or long-term wealth building."
                  perks={[
                    "Competitive interest rates",
                    "Automatic savings transfers",
                    "No monthly service fees",
                  ]}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <AccountTypeCard
                  icon={<TrendingUp className="h-12 w-12 text-purple-600" />}
                  image={investmentImg}
                  title="Investment Accounts"
                  description="Plan for your future with our diverse investment options. Our advisors can help you build a portfolio tailored to your financial aspirations."
                  perks={[
                    "Expert financial guidance",
                    "Diversified portfolio options",
                    "Retirement planning support",
                  ]}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Banking Perks Section */}
        <motion.section
          ref={perksRef}
          initial="hidden"
          animate={perksInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="py-16 bg-blue-50 bg-cover bg-center"
          style={{
            backgroundImage: perksBg
              ? `url(${perksBg})`
              : "url(https://placehold.co/1920x600/E0F2F7/000000?text=Perks+Background)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
              Why Bank With Us? Unmatched Perks!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <PerkCard
                  icon={<Award className="h-10 w-10 text-yellow-500" />}
                  title="Award-Winning Service"
                  description="Our dedicated team provides personalized support, ensuring your banking experience is always exceptional."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PerkCard
                  icon={<ShieldCheck className="h-10 w-10 text-blue-600" />}
                  title="Top-Tier Security"
                  description="Your financial safety is our priority. We employ advanced security measures to protect your accounts."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PerkCard
                  icon={<Headphones className="h-10 w-10 text-red-500" />}
                  title="24/7 Customer Support"
                  description="Get help whenever you need it with our round-the-clock customer service, available by phone, email, or chat."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PerkCard
                  icon={<CreditCard className="h-10 w-10 text-green-500" />}
                  title="Exclusive Card Benefits"
                  description="Enjoy premium benefits with our debit and credit cards, including cashback, travel rewards, and purchase protection."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PerkCard
                  icon={<User className="h-10 w-10 text-purple-500" />}
                  title="Personalized Financial Advice"
                  description="Receive tailored guidance from our expert financial advisors to help you achieve your unique financial goals."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PerkCard
                  icon={<Home className="h-10 w-10 text-indigo-500" />}
                  title="Community Focused"
                  description="We're deeply invested in the communities we serve, supporting local initiatives and fostering economic growth."
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Create Account Form Section */}
        <motion.section
          id="create-account-form"
          ref={formRef}
          initial={{ opacity: 0, y: 50 }}
          animate={formInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
                Open Your Personal Account
              </h2>
              <p className="text-center text-gray-600 mb-10">
                Fill out the form below to start your banking journey with us.
              </p>
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                {registrationMessage && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
                    {registrationMessage}
                  </div>
                )}
                {registrationError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                    {registrationError}
                  </div>
                )}
                <form
                  onSubmit={handleRegisterSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nationality"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nationality
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="accountType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Desired Account Type
                    </label>
                    <select
                      id="accountType"
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    >
                      <option value="checking">Checking Account</option>
                      <option value="savings">Savings Account</option>
                      <option value="investment">Investment Account</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Create Account"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src={formBg}
                alt="Account Creation"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </motion.section>

        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

// Helper Components for Personal Page
const AccountTypeCard = ({ icon, image, title, description, perks }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }} // Hover effect for account type cards
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
  >
    {image && (
      <img
        src={image}
        alt={title}
        className="w-full h-32 object-cover rounded-md mb-4"
      />
    )}
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 mb-4 flex-grow">{description}</p>
    <div className="mt-auto">
      <h4 className="font-medium text-gray-700 mb-2">Key Perks:</h4>
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        {perks.map((perk, index) => (
          <li key={index}>{perk}</li>
        ))}
      </ul>
      <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
        Learn More
      </button>
    </div>
  </motion.div>
);

AccountTypeCard.propTypes = {
  icon: PropTypes.node.isRequired,
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  perks: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const PerkCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }} // Hover effect for perk cards
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center h-full"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

PerkCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Personal;
