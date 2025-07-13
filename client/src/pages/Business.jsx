import React, { useState, useEffect } from "react"; // Import useEffect
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building,
  DollarSign,
  Handshake,
  Shield,
  Phone,
  Mail,
  ArrowRight,
  CreditCard,
  BarChart2,
} from "lucide-react";
import Footer from "../component/Footer"; // Assuming you have a Footer component
import Navbar from "../component/Navbar"; // Assuming you have a Navbar component
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import { useInView } from "react-intersection-observer"; // Import useInView
import { HashLoader } from "react-spinners"; // Import a loader component

// Placeholder images (replace with actual paths in src/assets/)
import businessHero from "../assets/teamIg.jpg"; // Placeholder for a business banking hero image

const Business = () => {
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
  const [accountsRef, accountsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [perksRef, perksInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
        key="business-page" // Unique key for this page
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
            backgroundImage: businessHero
              ? `url(${businessHero})`
              : "url(https://placehold.co/1920x1080/000000/FFFFFF?text=Business+Hero)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-green-700 opacity-70"></div>
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              Banking Solutions for Your Business
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl max-w-2xl mx-auto"
            >
              Empowering businesses of all sizes with tailored financial
              products and expert support.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-green-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
              >
                Contact Our Business Team{" "}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Business Account Types Section */}
        <motion.section
          ref={accountsRef}
          initial="hidden"
          animate={accountsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Business Accounts & Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <BusinessServiceCard
                  icon={<Briefcase className="h-12 w-12 text-blue-600" />}
                  title="Business Checking"
                  description="Accounts designed for businesses of all sizes, from startups to established enterprises. Manage cash flow efficiently."
                  features={[
                    "Flexible transaction limits",
                    "Online & mobile banking",
                    "Business debit cards",
                  ]}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <BusinessServiceCard
                  icon={<DollarSign className="h-12 w-12 text-green-600" />}
                  title="Business Savings"
                  description="Grow your business's capital with high-yield savings options. Prepare for future investments or unexpected needs."
                  features={[
                    "Competitive interest rates",
                    "Liquidity for business needs",
                    "Tiered interest options",
                  ]}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <BusinessServiceCard
                  icon={<Building className="h-12 w-12 text-purple-600" />}
                  title="Commercial Loans"
                  description="Access capital for expansion, equipment, or working capital. Tailored loan solutions to fuel your business growth."
                  features={[
                    "Flexible terms & rates",
                    "Real estate loans",
                    "Equipment financing",
                  ]}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <BusinessServiceCard
                  icon={<CreditCard className="h-12 w-12 text-red-600" />}
                  title="Merchant Services"
                  description="Streamline your payment processing with our secure and efficient merchant solutions. Accept all major credit cards."
                  features={[
                    "POS solutions",
                    "Online payment gateways",
                    "Fraud protection",
                  ]}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <BusinessServiceCard
                  icon={<BarChart2 className="h-12 w-12 text-indigo-600" />}
                  title="Treasury Management"
                  description="Optimize your cash flow and manage financial risks with our advanced treasury services for large businesses."
                  features={[
                    "Automated clearings",
                    "Fraud prevention tools",
                    "Liquidity management",
                  ]}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <BusinessServiceCard
                  icon={<Handshake className="h-12 w-12 text-yellow-600" />}
                  title="Business Consulting"
                  description="Get expert advice on financial strategy, growth planning, and operational efficiency to maximize your business's potential."
                  features={[
                    "Strategic financial planning",
                    "Market analysis",
                    "Risk assessment",
                  ]}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Business Perks Section */}
        <motion.section
          ref={perksRef}
          initial="hidden"
          animate={perksInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="py-16 bg-green-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
              Benefits for Your Business
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <PerkCard
                  icon={<Shield className="h-10 w-10 text-blue-600" />}
                  title="Dedicated Business Bankers"
                  description="Work with experienced professionals who understand your industry and specific business needs."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PerkCard
                  icon={<Phone className="h-10 w-10 text-green-600" />}
                  title="Local Decision Making"
                  description="Benefit from faster approvals and flexible solutions with decisions made right here in your community."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PerkCard
                  icon={<Mail className="h-10 w-10 text-red-600" />}
                  title="Advanced Digital Tools"
                  description="Access powerful online and mobile banking platforms designed to streamline your business operations."
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section for Business */}
        <motion.section
          ref={ctaRef}
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="py-16 bg-blue-900 text-white text-center"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg mb-8">
              Our team is ready to help you find the perfect banking solutions.
              Contact us today to discuss your business needs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
            >
              Speak to a Business Banker <ArrowRight className="ml-3 h-5 w-5" />
            </motion.button>
          </div>
        </motion.section>

        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

// Helper Components for Business Page
const BusinessServiceCard = ({ icon, title, description, features }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }} // Hover effect for business service cards
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 mb-4 flex-grow">{description}</p>
    <div className="mt-auto">
      <h4 className="font-medium text-gray-700 mb-2">Key Features:</h4>
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
        Learn More
      </button>
    </div>
  </motion.div>
);

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

export default Business;
