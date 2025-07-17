import { useState, useEffect } from "react";
import {
  Home,
  Phone,
  Mail,
  CreditCard,
  ArrowUp,
  ArrowLeft,
  Laptop,
} from "lucide-react";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import Contactpng from "../assets/contact.png";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { HashLoader } from "react-spinners";
import axios from "axios";
import io from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

const socket = io(API_BASE_URL);

const Contact = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    conversationId: localStorage.getItem("conversationId") || "",
  });
  const [messages, setMessages] = useState([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    const conversationId = localStorage.getItem("conversationId");
    if (conversationId) {
      fetchMessages(conversationId);
    }

    socket.emit("joinConversation", conversationId);
    socket.on("supportReply", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      clearTimeout(timer);
      socket.off("supportReply");
    };
  }, []);

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/support/messages/${conversationId}`
      );
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching conversation messages:", err);
      setFormError("Failed to load conversation history. Please try again.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
    if (formSuccess) setFormSuccess("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    const { name, email, subject, message, conversationId } = formData;

    if (!name || !email || !subject || !message) {
      setFormError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/support/contact`, {
        name,
        email,
        subject,
        message,
        conversationId,
      });
      setFormSuccess(
        response.data.message || "Your message has been sent successfully!"
      );
      localStorage.setItem("conversationId", response.data.conversationId);
      setFormData((prev) => ({
        ...prev,
        message: "",
        conversationId: response.data.conversationId,
      }));
      fetchMessages(response.data.conversationId);
    } catch (err) {
      console.error("Contact form submission error:", err);
      setFormError(
        err.response?.data?.message ||
          "Error sending message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [helpSectionRef, helpSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [contactBoxesRef, contactBoxesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [phoneNumbersRef, phoneNumbersInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [contactFormSectionRef, contactFormSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
        key="contact-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full overflow-hidden"
      >
        <Navbar />

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="w-full h-[40vh] md:h-[60vh] bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
          style={{
            backgroundImage: Contactpng
              ? `url(${Contactpng})`
              : "url('https://via.placeholder.com/1200x600')",
          }}
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold relative z-10">
            Get In Touch
          </h1>
        </motion.section>

        {/* Blue Line */}
        <div className="w-full h-1 bg-blue-600"></div>

        {/* Help Section */}
        <motion.section
          ref={helpSectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={helpSectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-8 md:py-16"
        >
          <div className="flex flex-col items-center text-center mb-8 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              We are here to help!
            </h1>
            <div className="w-20 h-1 bg-blue-600 mb-6 md:mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl">
              Our friendly staff will be glad to answer your questions. Call,
              email, or visit a location to speak with a local banking expert.
            </p>
          </div>

          {/* Contact Boxes */}
          <motion.div
            ref={contactBoxesRef}
            initial="hidden"
            animate={contactBoxesInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-16"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 md:p-8 bg-white rounded-lg shadow-lg"
            >
              <Home size={48} className="text-blue-600 mb-4" />
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                See our locations
              </h2>
              <p className="text-gray-600 mb-6">
                Visit any BSB location to speak with a team member!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-300"
                aria-label="Find a BSB location"
              >
                Find a BSB location
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 md:p-8 bg-white rounded-lg shadow-lg"
            >
              <Phone size={48} className="text-blue-600 mb-4" />
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                Call us
              </h2>
              <p className="text-gray-600 mb-6">
                Visit any BSB location to speak with a team member!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-300"
                aria-label="Find a BSB location"
              >
                Find a BSB location
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 md:p-8 bg-white rounded-lg shadow-lg"
            >
              <Mail size={48} className="text-blue-600 mb-4" />
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                Email Us
              </h2>
              <p className="text-gray-600 mb-6">
                Visit any BSB location to speak with a team member!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-300"
                aria-label="Find a BSB location"
              >
                Find a BSB location
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Important Phone Numbers Section */}
        <motion.section
          ref={phoneNumbersRef}
          initial="hidden"
          animate={phoneNumbersInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="w-full bg-gray-100 py-8 md:py-16"
        >
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8">
              Important Phone Numbers for BSB Customers
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col items-center text-center">
                  <CreditCard size={32} className="text-blue-600 mb-4" />
                  <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                    Lost or stolen card
                  </h1>
                  <p className="text-gray-600">
                    If you have a lost/stolen card, please call{" "}
                    <span className="font-semibold">1-800-383-8000</span>.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col items-center text-center">
                  <ArrowUp size={32} className="text-blue-600 mb-4" />
                  <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                    Fraudulent Activity
                  </h1>
                  <p className="text-gray-600">
                    If your card is temporarily blocked, please call{" "}
                    <span className="font-semibold">1-866-508-2693</span>.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col items-center text-center">
                  <Phone size={32} className="text-blue-600 mb-4" />
                  <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                    Automated Telephone Banking
                  </h1>
                  <p className="text-gray-600">
                    24 Hour Telephone Banking:{" "}
                    <span className="font-semibold">1-800-586-3597</span>
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col items-center text-center">
                  <ArrowLeft size={32} className="text-blue-600 mb-4" />
                  <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                    PIN Reset
                  </h1>
                  <p className="text-gray-600">
                    To reset your debit card PIN, please call{" "}
                    <span className="font-semibold">1-800-717-4923</span>.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col items-center text-center">
                  <Laptop size={32} className="text-blue-600 mb-4" />
                  <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                    Bill Pay Support
                  </h1>
                  <p className="text-gray-600">
                    For Bill Pay Support, please call{" "}
                    <span className="font-semibold">1-866-665-0275</span>.
                  </p>
                </div>
              </motion.div>

              <div className="hidden md:block"></div>
            </div>
          </div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          ref={contactFormSectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={contactFormSectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-8 md:py-16"
        >
          <div className="flex flex-col items-center text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              We will contact you
            </h1>
            <div className="w-20 h-1 bg-blue-600 mb-6 md:mb-8"></div>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              Who would you like to contact?
            </h2>
            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {formSuccess}
                {formData.conversationId && (
                  <span>
                    {" "}
                    Your Conversation ID is {formData.conversationId}. Please
                    save this ID to continue the conversation later.
                  </span>
                )}
              </div>
            )}
            {messages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Conversation History
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-4 rounded-lg ${
                        msg.sender === "visitor"
                          ? "bg-blue-50 text-right"
                          : "bg-gray-50 text-left"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {msg.sender === "visitor"
                          ? `${msg.username} (${msg.email})`
                          : "Admin"}
                      </p>
                      {msg.subject && (
                        <p className="text-sm font-medium text-gray-600">
                          Subject: {msg.subject}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">{msg.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(msg.timestamp).toLocaleString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Name"
                  required
                  disabled={isSubmitting}
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
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Email"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Subject of your inquiry"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your message"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              {formData.conversationId && (
                <div>
                  <label
                    htmlFor="conversationId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Conversation ID
                  </label>
                  <input
                    type="text"
                    id="conversationId"
                    name="conversationId"
                    value={formData.conversationId}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                  />
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </div>
        </motion.section>

        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Contact;
