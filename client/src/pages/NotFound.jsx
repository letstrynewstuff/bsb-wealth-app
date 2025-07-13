import { Link } from "react-router-dom";
import { Frown, Phone, Home } from "lucide-react"; // Import icons for a better look

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 sm:p-10 lg:p-12 text-center max-w-lg w-full">
        <Frown
          size={80}
          className="text-blue-600 mx-auto mb-6 animate-bounce-slow"
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Oops! The page you&#39;re looking for doesn&#39;t exist. It might have been
          moved or deleted.
        </p>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Need Assistance?
          </h2>
          <p className="text-md text-gray-600 mb-6">
            If you believe this is an error or need help, please don&#39;t hesitate
            to reach out to us.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact" // Assuming you have a /contact route
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              <Phone size={20} className="mr-2" />
              Contact Our Bank
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
            >
              <Home size={20} className="mr-2" />
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

// {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Checking Account */}
//             <div className="bg-gray-50 p-4 rounded-lg border-2 border-blue-500 hover:shadow-md transition-shadow">
//               <div className="flex items-center space-x-2 mb-2">
//                 <DollarSign className="h-5 w-5 text-blue-600" />
//                 <h3 className="text-sm font-medium text-gray-600">
//                   Checking Account
//                 </h3>
//               </div>
//               <p className="text-2xl font-semibold text-gray-800">$12,456.78</p>
//             </div>

//             {/* Savings */}
//             <div className="bg-gray-50 p-4 rounded-lg border-2 border-blue-500 hover:shadow-md transition-shadow">
//               <div className="flex items-center space-x-2 mb-2">
//                 <PiggyBank className="h-5 w-5 text-blue-600" />
//                 <h3 className="text-sm font-medium text-gray-600">Savings</h3>
//               </div>
//               <p className="text-2xl font-semibold text-gray-800">$45,789.12</p>
//             </div>

//             {/* Visa Card */}
//             <div className="bg-gray-50 p-4 rounded-lg border-2 border-blue-500 hover:shadow-md transition-shadow">
//               <div className="flex items-center space-x-2 mb-2">
//                 <CreditCard className="h-5 w-5 text-blue-600" />
//                 <h3 className="text-sm font-medium text-gray-600">Visa Card</h3>
//               </div>
//               <p className="text-2xl font-semibold text-gray-800">$3,241.50</p>
//             </div>

//             {/* Investment */}
//             <div className="bg-gray-50 p-4 rounded-lg border-2 border-blue-500 hover:shadow-md transition-shadow">
//               <div className="flex items-center space-x-2 mb-2">
//                 <TrendingUp className="h-5 w-5 text-blue-600" />
//                 <h3 className="text-sm font-medium text-gray-600">
//                   Investment
//                 </h3>
//               </div>
//               <p className="text-2xl font-semibold text-gray-800">$78,123.45</p>
//             </div>
//           </div> */}
