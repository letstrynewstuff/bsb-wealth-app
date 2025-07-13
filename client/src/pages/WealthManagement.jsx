import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  BarChart2,
  Briefcase,
  DollarSign,
  Star,
  Users,
  Phone,
  ArrowRight,
} from "lucide-react";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import NavigationLinks from "../component/NavigationLinks";
import SocialMedia from "../component/SocialMedia";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { HashLoader } from "react-spinners";

import wealthBg from "../assets/wealthbg.png";
import teamImg from "../assets/teamIg.jpg";
import investmentImg from "../assets/investmentImg.jpg";
import planningImg from "../assets/perksBg.jpg";

// StarRating Component
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

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

// ReviewCard Component

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

ReviewCard.propTypes = {
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
};

// FeatureCard Component
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
    <Link
      to="/contact"
      className="text-blue-900 font-medium hover:text-blue-700 flex items-center mt-auto"
    >
      Learn More <ChevronRight className="ml-1 h-4 w-4" />
    </Link>
  </motion.div>
);

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const WealthManagement = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000); // Simulate a 1 second load time
    return () => clearTimeout(timer);
  }, []);

  const reviews = [
    {
      rating: 5,
      comment:
        "The wealth management team at BSB crafted a personalized investment plan that aligns perfectly with my long-term goals. Their expertise is unmatched.",
      author: "Michael S.",
      position: "Entrepreneur",
    },
    {
      rating: 5,
      comment:
        "BSB’s financial advisors took the time to understand my family’s needs. Their estate planning services gave us peace of mind for the future.",
      author: "Sarah L.",
      position: "Retired Educator",
    },
    {
      rating: 4,
      comment:
        "The investment strategies provided by BSB have helped diversify my portfolio effectively. The team is always available to answer my questions.",
      author: "David R.",
      position: "Small Business Owner",
    },
  ];

  // useInView hooks for scroll animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [introRef, introInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [teamRef, teamInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [investmentApproachRef, investmentApproachInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [whyChooseRef, whyChooseInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [planningProcessRef, planningProcessInView] = useInView({
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
        key="wealth-management-page" // Unique key for this page
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-100 flex flex-col"
      >
        <Navbar />

        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative min-h-[60vh] md:h-[70vh] flex items-center text-white"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: wealthBg
                ? `url(${wealthBg})`
                : "url(https://placehold.co/1920x1080/000000/FFFFFF?text=Wealth+Hero)",
            }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              Wealth Management at Bennington State Bank
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto"
            >
              Partner with our trusted wealth management team to secure your
              financial future with personalized investment strategies and
              expert guidance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/contact"
                className="mt-6 inline-block bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
              >
                Get Started Today
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Introduction Section */}
        <motion.div
          ref={introRef}
          initial={{ opacity: 0, y: 50 }}
          animate={introInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Building Your Financial Legacy
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              At Bennington State Bank, our Trust & Wealth Management division
              is dedicated to helping you achieve your financial goals. With
              over 130 years of serving our community, we combine local
              expertise with sophisticated financial solutions to provide
              personalized wealth management services. Whether you're planning
              for retirement, growing your investments, or securing your
              family&apos;s future, our team is here to guide you every step of
              the way.
            </p>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Our approach is rooted in understanding your unique needs, risk
              tolerance, and aspirations. We believe that wealth management is
              more than just numbers—it&apos;s about building trust, fostering
              relationships, and creating a legacy that lasts for generations.
            </p>
          </div>
        </motion.div>

        {/* Services Section */}
        <motion.div
          ref={servicesRef}
          initial="hidden"
          animate={servicesInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="bg-gray-50 py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
              Our Wealth Management Services
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={
                    <BarChart2 className="h-10 sm:h-12 w-10 sm:w-12 text-blue-900" />
                  }
                  title="Financial Planning"
                  description="Our advisors work with you to create a comprehensive financial plan tailored to your goals, from retirement to education funding, ensuring every aspect of your financial life is aligned."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={
                    <Briefcase className="h-10 sm:h-12 w-10 sm:w-12 text-blue-900" />
                  }
                  title="Investment Management"
                  description="We design diversified investment portfolios based on your risk tolerance and objectives, leveraging market insights to maximize returns while minimizing risks."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={
                    <DollarSign className="h-10 sm:h-12 w-10 sm:w-12 text-blue-900" />
                  }
                  title="Estate and Trust Planning"
                  description="Protect and transfer your wealth seamlessly with our estate planning services, including trust management and legacy planning to secure your family's future."
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Team Expertise Section */}
        <motion.div
          ref={teamRef}
          initial={{ opacity: 0, y: 50 }}
          animate={teamInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="py-12 sm:py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={teamInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={teamImg}
                alt="Wealth Management Team"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={teamInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Meet Our Expert Team
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Our wealth management team consists of certified financial
                planners, investment advisors, and trust specialists with
                decades of combined experience. We take a collaborative
                approach, working closely with you to understand your financial
                situation and craft strategies that align with your vision.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                At BSB, we pride ourselves on our local roots and personalized
                service. Our advisors are not just financial experts—they're
                your neighbors, committed to the Bennington community and
                dedicated to your success.
              </p>
              <Link
                to="/contact"
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center"
              >
                Schedule a Consultation{" "}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Investment Approach Section */}
        <motion.div
          ref={investmentApproachRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={investmentApproachInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative min-h-[400px] sm:min-h-[500px] flex items-center justify-center text-white"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: investmentImg
                ? `url(${investmentImg})`
                : "url(https://placehold.co/1920x1080/000000/FFFFFF?text=Investment+Approach)",
            }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-md sm:max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold">
              A Disciplined Investment Approach
            </h2>
            <p className="mt-4 text-base sm:text-lg">
              Our investment philosophy is built on discipline, diversification,
              and long-term growth. We conduct thorough market research and use
              data-driven strategies to build portfolios that withstand market
              volatility while pursuing your financial objectives.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-block bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Explore Investment Options
            </Link>
          </div>
        </motion.div>

        {/* Why Choose BSB Wealth Management */}
        <motion.div
          ref={whyChooseRef}
          initial="hidden"
          animate={whyChooseInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="bg-white py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
              Why Choose BSB Wealth Management?
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Users className="h-8 w-8 text-blue-900" />}
                  title="Personalized Service"
                  description="We take the time to understand your unique financial situation, tailoring our services to meet your specific needs and goals."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<BarChart2 className="h-8 w-8 text-blue-900" />}
                  title="Proven Expertise"
                  description="Our team of certified professionals brings years of experience in financial planning, investments, and estate management."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<DollarSign className="h-8 w-8 text-blue-900" />}
                  title="Transparent Fees"
                  description="We offer clear, competitive fee structures with no hidden costs, ensuring you understand the value of our services."
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Client Testimonials Section */}
        <motion.div
          ref={testimonialsRef}
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="bg-gray-50 py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
              What Our Clients Say
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

        {/* Planning Process Section */}
        <motion.div
          ref={planningProcessRef}
          initial={{ opacity: 0, y: 50 }}
          animate={planningProcessInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="py-12 sm:py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={planningProcessInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Our Wealth Planning Process
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Our wealth management process begins with a comprehensive
                assessment of your financial situation. We analyze your income,
                assets, liabilities, and goals to create a customized plan. From
                there, we implement tailored strategies, monitor progress, and
                adjust as needed to ensure your plan evolves with your life.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>
                  Discovery: Understand your financial goals and risk tolerance.
                </li>
                <li>
                  Planning: Develop a personalized financial and investment
                  plan.
                </li>
                <li>
                  Implementation: Execute strategies with precision and care.
                </li>
                <li>Monitoring: Regular reviews to keep your plan on track.</li>
              </ul>
              <Link
                to="/contact"
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center"
              >
                Start Your Plan <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={planningProcessInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={planningImg}
                alt="Wealth Planning Process"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-blue-900 text-white py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Take Control of Your Financial Future
            </h2>
            <p className="text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Partner with Bennington State Bank to build a wealth management
              plan that reflects your vision. Our team is ready to help you
              achieve financial success with confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Contact an Advisor <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" /> View Your Profile
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Social Media Section */}
        <SocialMedia />

        {/* Navigation Section */}
        <NavigationLinks />

        {/* Footer */}
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default WealthManagement;
