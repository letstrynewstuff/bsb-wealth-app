import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  DollarSign,
  CreditCard,
  TrendingUp,
  Award,
  Zap, 
  Target, 
  Coffee, 
  ShoppingBag, 
  Coins, 
  LineChart, 
  Bitcoin, 
  Scale,
  Phone, 
  Mail, 
  ArrowRight,
  ChevronRight,
  Building, 
  PiggyBank, 
} from "lucide-react";

import Footer from "../component/Footer"; // Assuming you have a Footer component

const BusinessTool = () => {
  // Sample Data for Business Promotions
  const businessPromotions = [
    {
      name: "Business Debit Card Bonus",
      offer: "Earn $100 cashback when you spend $1,000 in the first 90 days.",
      color: "blue",
      icon: CreditCard,
    },
    {
      name: "New Business Checking Offer",
      offer: "Get $250 bonus when you open a new business checking account.",
      color: "green",
      icon: DollarSign,
    },
    {
      name: "Merchant Services Discount",
      offer: "20% off processing fees for your first 3 months.",
      color: "purple",
      icon: Briefcase,
    },
  ];

  // Sample Data for Business Accounts
  const businessAccounts = [
    {
      type: "Small Business Checking",
      description:
        "Ideal for growing businesses with moderate transaction activity.",
      perks: [
        "Up to 200 free transactions",
        "Online bill pay",
        "Mobile deposit",
      ],
      icon: DollarSign,
    },
    {
      type: "Commercial Checking",
      description:
        "Designed for larger enterprises with high transaction volumes.",
      perks: [
        "Unlimited transactions",
        "Dedicated account manager",
        "Advanced treasury services",
      ],
      icon: Building, // Assuming Building icon is available, if not, use Briefcase
    },
    {
      type: "Business Savings",
      description: "Earn competitive interest on your idle business funds.",
      perks: [
        "Tiered interest rates",
        "Flexible access",
        "Automatic transfers",
      ],
      icon: PiggyBank,
    },
  ];

  // Sample Data for Investment Opportunities
  const investmentOpportunities = [
    {
      title: "Stocks & ETFs",
      description:
        "Invest in a diversified portfolio of publicly traded companies and exchange-traded funds.",
      icon: LineChart,
      details:
        "Access to major exchanges, expert-curated portfolios, real-time market data.",
    },
    {
      title: "Bonds & Fixed Income",
      description:
        "Secure your capital with government and corporate bonds for stable returns.",
      icon: Scale,
      details:
        "Diversify risk, predictable income streams, various maturity options.",
    },
    {
      title: "Treasury Bills",
      description:
        "Short-term government securities offering low-risk investment opportunities.",
      icon: Award, // Using Award for 'secure' nature
      details:
        "Backed by the full faith and credit of the government, short maturity periods.",
    },
    {
      title: "Cryptocurrency Investing",
      description:
        "Explore the world of digital assets with our secure and regulated crypto platform.",
      icon: Bitcoin,
      details:
        "Trade popular cryptocurrencies, secure cold storage, market insights.",
    },
  ];

  const PerkCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center h-full">
      <div className="mb-4">
        {Icon && <Icon className="h-10 w-10 text-blue-600" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const ServiceCard = ({ icon: Icon, title, description, features }) => (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="mb-4">
        {Icon && <Icon className="h-12 w-12 text-blue-600" />}
      </div>
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
    </div>
  );

  const InvestmentCard = ({ icon: Icon, title, description, details }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">
      <div className="mb-4">
        {Icon && <Icon className="h-12 w-12 text-green-600" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <div className="mt-auto">
        <p className="text-sm text-gray-500 italic">{details}</p>
        <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors duration-300">
          Explore Options
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Hero Section */}
      <section className="relative h-[45vh] md:h-[55vh] bg-gradient-to-r from-teal-700 to-green-600 flex items-center justify-center text-white">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            Business Solutions for Growth
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up delay-200">
            Discover a suite of financial tools and services designed to empower
            your business.
          </p>
        </div>
      </section>

      {/* Business Promotions Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Exclusive Business Promotions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessPromotions.map((promo, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center h-full"
              >
                <div className="mb-4">
                  {promo.icon && (
                    <promo.icon
                      className={`h-10 w-10 text-${promo.color}-600`}
                    />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {promo.name}
                </h3>
                <p className="text-gray-600 flex-grow">{promo.offer}</p>
                <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
                  Activate Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Account Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Tailored Business Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessAccounts.map((account, index) => (
              <ServiceCard
                key={index}
                icon={account.icon}
                title={account.type}
                description={account.description}
                features={account.perks}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Investment Opportunities Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Investment Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {investmentOpportunities.map((investment, index) => (
              <InvestmentCard
                key={index}
                icon={investment.icon}
                title={investment.title}
                description={investment.description}
                details={investment.details}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us CTA */}
      <section className="py-16 bg-blue-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Elevate Your Business Banking?
          </h2>
          <p className="text-lg mb-8">
            Our expert business bankers are here to provide personalized advice
            and solutions.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
          >
            <Phone className="mr-3 h-5 w-5" /> Contact Our Business Team
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessTool;
