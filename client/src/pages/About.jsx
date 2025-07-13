import  { useState, useEffect } from "react"; // Import useState, useEffect
import { HeartHandshake, Users } from "lucide-react";
import NavigationLinks from "../component/NavigationLinks";
import SocialMedia from "../component/SocialMedia";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar"; // Assuming you have a Navbar component
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import { useInView } from "react-intersection-observer"; // Import useInView
import { HashLoader } from "react-spinners"; // Import a loader component

// Placeholder images (replace with actual paths in src/assets/)
import First from "../assets/firstbank.png";
import aboutBg from "../assets/aboutbg.png";
import Community from "../assets/communitycommit.png";
import bsbImg from "../assets/BSB-Ladies-scaled.png";

const About = () => {
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
  const [yearsStrongRef, yearsStrongInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [trueRootsRef, trueRootsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [communityCommitmentRef, communityCommitmentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [givingBackRef, givingBackInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ourStoryRef, ourStoryInView] = useInView({
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
        key="about-page" // Unique key for this page
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full overflow-hidden"
      >
        <Navbar />

        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="w-full h-[40vh] md:h-[60vh] bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
          style={{
            backgroundImage: aboutBg
              ? `url(${aboutBg})`
              : "url(https://placehold.co/1920x1080/000000/FFFFFF?text=About+Hero)",
          }}
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold relative z-10">
            Our Story
          </h1>
        </motion.div>

        {/* Blue line */}
        <div className="w-full h-2 bg-blue-600"></div>

        {/* Years Strong Section */}
        <motion.div
          ref={yearsStrongRef}
          initial={{ opacity: 0, y: 50 }}
          animate={yearsStrongInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="w-full bg-gray-100"
        >
          <div className="container mx-auto px-4 py-8 md:py-16 text-center">
            <h1 className="text-blue-600 text-3xl md:text-5xl font-bold mb-4 md:mb-8">
              135 Years Strong
            </h1>
            <p className="text-lg md:text-xl text-gray-800 max-w-4xl mx-auto mb-4 md:mb-6">
              The Bennington State Bank was founded on integrity and trust, and
              135 years later, we are still driven by our founding principles
              that define who we are.
            </p>
            <p className="text-base md:text-lg text-gray-800 max-w-4xl mx-auto mb-4 md:mb-6">
              <strong>
                The Bennington State Bank (BSB) is a community bank proudly
                serving Kansas for 135 years with branches in Salina,
                Bennington, Minneapolis, Wamego, Sylvan Grove, Lucas, Abilene,
                and Wichita, Kansas.
              </strong>
            </p>
            <p className="text-base md:text-lg text-gray-800 max-w-4xl mx-auto">
              <strong>
                We are your local trusted hometown bank, dedicated to delivering
                exceptional hometown customer service you can count on, paired
                with state-of-the-art banking products and services that will
                help you achieve your goals!
              </strong>
            </p>
          </div>
        </motion.div>

        {/* True to Our Roots Section */}
        <motion.div
          ref={trueRootsRef}
          initial="hidden"
          animate={trueRootsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col md:flex-row items-center justify-center p-4 sm:p-8 bg-white"
        >
          <motion.div
            variants={itemVariants}
            className="w-full md:w-1/2 mb-6 md:mb-0"
          >
            <img
              src={First}
              alt="First branch of Bennington State Bank"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="w-full md:w-1/2 flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4"
          >
            <div className="rounded-full bg-blue-100 p-4">
              <Users className="w-10 sm:w-12 h-10 sm:h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              True to Our Roots
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              Bennington State Bank was founded on the principles of integrity
              and trust, and we are still committed to those values today. We
              strive every day to go above and beyond to give exceptional
              service!
            </p>
          </motion.div>
        </motion.div>

        {/* Community Commitment Section */}
        <motion.div
          ref={communityCommitmentRef}
          initial="hidden"
          animate={communityCommitmentInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col md:flex-row items-center justify-center p-4 sm:p-8 bg-gray-100"
        >
          <motion.div
            variants={itemVariants}
            className="w-full md:w-1/2 mb-6 md:mb-0 order-2 md:order-1"
          >
            <img
              src={Community}
              alt="Community outreach"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="w-full md:w-1/2 flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4 order-1 md:order-2"
          >
            <div className="rounded-full bg-blue-100 p-4">
              <Users className="w-10 sm:w-12 h-10 sm:h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Community Commitment
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              We love our communities and are so proud to be founded in hometown
              Kansas! From prayers in the streets to Fourth of July celebrations
              to long hot harvest days, we have a heart for our communities. At
              BSB, we live where we work, and our goal is to help each community
              thrive and prosper. Doing so means providing volunteers, funds,
              programs, and so much more to organizations and businesses within
              our communities.
            </p>
          </motion.div>
        </motion.div>

        {/* Giving Back Section */}
        <motion.div
          ref={givingBackRef}
          initial="hidden"
          animate={givingBackInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col md:flex-row items-center justify-center p-4 sm:p-8 bg-white"
        >
          <motion.div
            variants={itemVariants}
            className="w-full md:w-1/2 mb-6 md:mb-0"
          >
            <img
              src={bsbImg}
              alt="BSB Ladies"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="w-full md:w-1/2 flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4"
          >
            <div className="rounded-full bg-blue-100 p-4">
              <HeartHandshake className="w-10 sm:w-12 h-10 sm:h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Giving Back
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              We are committed to giving back to our communities in so many
              ways. We are passionate about the needs of the customers,
              employees, and communities we proudly serve. We support local
              businesses and help stimulate the economy in the communities where
              we live and work.
            </p>
          </motion.div>
        </motion.div>

        {/* Our Story Section */}
        <motion.div
          ref={ourStoryRef}
          initial={{ opacity: 0, y: 50 }}
          animate={ourStoryInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="w-full bg-gray-100 py-8 md:py-16"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Our Story
              </h1>
              <div className="w-20 h-1 bg-blue-600 mb-6 md:mb-8"></div>
              <div className="max-w-7xl mx-auto">
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                  Our origins were built on the support of families and small
                  businesses in rural Kansas. Since the beginning, The
                  Bennington State Bank has kept the safety and soundness of our
                  customers' financial matters as the cornerstone of our
                  community bank, helping shape what BSB is today. For over 130
                  years, BSB has been committed to providing first-class banking
                  services to individuals, businesses, and communities
                  throughout central Kansas.
                </p>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                  In 1883, Christian Nelson, one of the original founders of the
                  town of Bennington, Kansas, and Adolph Gilbert formed a
                  private bank. In 1887, that private bank became one of the
                  first chartered by the State of Kansas and became known as The
                  Bennington Banking Company, with Christian Nelson as
                  president. Christian's son, John, was later named President,
                  and the name of the bank was then changed to The Bennington
                  State Bank.
                </p>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                  In 1945, the bank was sold by the Nelson family to the Berkley
                  family. In 1967, Kent (Mike) Berkley and his siblings assumed
                  controlling ownership of the bank. Assets of the bank in 1967
                  totaled $5 million. Today, with assets totaling over $800
                  million, BSB is one of the largest privately held banks in
                  Kansas. BSB has consistently been recognized as a 5-Star rated
                  bank by Bauer Financial, the nation's leading independent bank
                  rating firm, making BSB one of America's strongest and safest
                  financial institutions.
                </p>
                <p className="text-lg md:text-xl text-gray-700">
                  Throughout our long, storied history, BSB has consistently
                  provided safety and soundness to its customers while
                  maintaining the capital, liquidity, and balance sheet strength
                  that allows BSB to be a leader in Kansas and take pride in the
                  fact that we remain loyal to our roots as a local,
                  independent, full-service community bank.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Media */}
        <SocialMedia />

        {/* Navigation Links */}
        <NavigationLinks />

        {/* Footer */}
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default About;
