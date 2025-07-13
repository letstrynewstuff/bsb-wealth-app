import { useEffect, useState } from "react"; // Import useState, useEffect
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
import Navbar from "../component/Navbar"; // Assuming you have a Navbar component
import Contactpng from "../assets/contact.png";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import { useInView } from "react-intersection-observer"; // Import useInView
import { HashLoader } from "react-spinners"; // Import a loader component

const Contact = () => {
  const [pageLoading, setPageLoading] = useState(true); // State for overall page loading

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000); // Simulate a 1 second load time
    return () => clearTimeout(timer);
  }, []);

  // useInView hooks for scroll animations
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
        key="contact-page" // Unique key for this page
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
              : "url(https://placehold.co/1920x1080/000000/FFFFFF?text=Contact+Hero)",
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
            {/* Location Box */}
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

            {/* Phone Box */}
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

            {/* Email Box */}
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

            {/* First Row of Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Lost/Stolen Card */}
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

              {/* Fraudulent Activity */}
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

              {/* Automated Banking */}
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

            {/* Second Row of Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PIN Reset */}
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

              {/* Bill Pay Support */}
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

              {/* Empty div for grid alignment */}
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

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              Who would you like to contact?
            </h2>
            <form className="space-y-6">
              {/* Form fields remain the same */}
              {/* Add your form fields here. Example: */}
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Name"
                  required
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Email"
                  required
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Subject of your inquiry"
                  required
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.section>

        {/* Footer */}
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Contact;
