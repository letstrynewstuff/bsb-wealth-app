// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRight, Landmark, Globe } from 'lucide-react';

// const Transfer = () => {
//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Select Transfer Type</h1>
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* ACH Transfer Option */}
//         <Link
//           to="/dashboard/transfer/ach"
//           className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:border-blue-500 transition-all duration-200 text-left group"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <Landmark className="w-6 h-6 text-blue-600" />
//             </div>
//             <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">ACH Transfer</h3>
//           <p className="text-gray-600">
//             Make an ACH payment, payment complete in 1-2 business days. Send or collect electronic
//             payment from anywhere, vendors, customers, payees and more.
//           </p>
//         </Link>

//         {/* Wire Transfer Option */}
//         <Link
//           to="/dashboard/transfer/wire"
//           className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:border-blue-500 transition-all duration-200 text-left group"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <Globe className="w-6 h-6 text-blue-600" />
//             </div>
//             <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">Wire Transfer</h3>
//           <p className="text-gray-600">
//             Send money internationally or domestically. Faster processing time with same-day
//             delivery for domestic wires when submitted during business hours.
//           </p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Transfer;

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Landmark, Globe } from "lucide-react";

const Transfer = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Select Transfer Type
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* ACH Transfer Option */}
        <Link
          to="/dashboard/transfer/ach"
          className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:border-blue-500 transition-all duration-200 text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="ACH Transfer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Landmark className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <ArrowRight
              className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            ACH Transfer
          </h3>
          <p className="text-gray-600">
            Make an ACH payment, payment complete in 1-2 business days. Send or
            collect electronic payment from anywhere, vendors, customers, payees
            and more.
          </p>
        </Link>

        {/* Wire Transfer Option */}
        <Link
          to="/dashboard/transfer/wire"
          className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:border-blue-500 transition-all duration-200 text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Wire Transfer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Globe className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <ArrowRight
              className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Wire Transfer
          </h3>
          <p className="text-gray-600">
            Send money internationally or domestically. Faster processing time
            with same-day delivery for domestic wires when submitted during
            business hours.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Transfer;
