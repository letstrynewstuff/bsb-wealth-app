// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Layout from "./components/Layout";
// import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";

// // Customer Management
// import AllCustomers from "./pages/customers/AllCustomers";
// import AddCustomer from "./pages/customers/AddCustomer";
// import ClientPhoto from "./pages/customers/ClientPhoto";
// import KycIdCard from "./pages/customers/KycIdCard";
// import SecurityQuestions from "./pages/security/SecurityQuestions";
// import AddClient from "./pages/customers/AddClient";

// // Transaction Management
// import CryptoTransaction from "./pages/transactions/CryptoTransaction";
// import CreditDebitCrypto from "./pages/transactions/CreditDebitCrypto";
// import EditTransaction from "./pages/transactions/EditTransaction";
// import ClientBilling from "./pages/billing/ClientBilling";
// import CreditUser from "./pages/transactions/CreditUser";
// import DebitUser from "./pages/transactions/DebitUser";

// // Banking Services
// import VirtualCard from "./pages/services/VirtualCard";
// import QuickLoan from "./pages/services/QuickLoan";
// import AllBeneficiaries from "./pages/beneficiaries/AllBeneficiaries";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public route */}
//         <Route path="/login" element={<Login />} />

//         {/* Protected routes - wrapped in Layout component */}
//         <Route element={<Layout />}>
//           <Route path="/" element={<Dashboard />} />

//           {/* Customer Management */}
//           <Route path="/customers/all" element={<AllCustomers />} />
//           <Route path="/customers/add" element={<AddCustomer />} />
//           <Route path="/customers/add-client" element={<AddClient />} />
//           <Route path="/customers/client-photo" element={<ClientPhoto />} />
//           <Route path="/customers/kyc-id-card" element={<KycIdCard />} />
//           <Route path="/security/questions" element={<SecurityQuestions />} />

//           {/* Transaction Management */}
//           <Route path="/transactions/crypto" element={<CryptoTransaction />} />
//           <Route
//             path="/transactions/credit-debit-crypto"
//             element={<CreditDebitCrypto />}
//           />
//           <Route path="/transactions/edit" element={<EditTransaction />} />
//           <Route path="/billing/client" element={<ClientBilling />} />
//           <Route path="/transactions/credit-user" element={<CreditUser />} />
//           <Route path="/transactions/debit-user" element={<DebitUser />} />

//           {/* Banking Services */}
//           <Route path="/services/virtual-card" element={<VirtualCard />} />
//           <Route path="/services/quick-loan" element={<QuickLoan />} />
//           <Route path="/beneficiaries/all" element={<AllBeneficiaries />} />
//         </Route>

//         {/* 404 page */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import AdminLogin from "./pages/security/AdminLogin"; 
import NotFound from "./pages/NotFound";

// Customer Management
import AllCustomers from "./pages/customers/AllCustomers";
import AddCustomer from "./pages/customers/AddCustomer";
import ClientPhoto from "./pages/customers/ClientPhoto";
import KycIdCard from "./pages/customers/KycIdCard";
import SecurityQuestions from "./pages/security/SecurityQuestions";
import AddClient from "./pages/customers/AddClient";

// Transaction Management
import CryptoTransaction from "./pages/transactions/CryptoTransaction";
import CreditDebitCrypto from "./pages/transactions/CreditDebitCrypto";
import EditTransaction from "./pages/transactions/EditTransaction";
import ClientBilling from "./pages/billing/ClientBilling";
import CreditUser from "./pages/transactions/CreditUser";
import DebitUser from "./pages/transactions/DebitUser";

// Banking Services
import VirtualCard from "./pages/services/VirtualCard";
import QuickLoan from "./pages/services/QuickLoan";
import AllBeneficiaries from "./pages/beneficiaries/AllBeneficiaries";
import AdminSupport from "./pages/services/AdminSupport";

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAuthenticated = !!token && userData.role === "admin";

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected routes - wrapped in Layout component */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />

          {/* Customer Management */}
          <Route path="/customers/all" element={<AllCustomers />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/add-client" element={<AddClient />} />
          <Route path="/customers/client-photo" element={<ClientPhoto />} />
          <Route path="/customers/kyc-id-card" element={<KycIdCard />} />
          <Route path="/security/questions" element={<SecurityQuestions />} />

          {/* Transaction Management */}
          <Route path="/transactions/crypto" element={<CryptoTransaction />} />
          <Route
            path="/transactions/credit-debit-crypto"
            element={<CreditDebitCrypto />}
          />
          <Route path="/transactions/edit" element={<EditTransaction />} />
          <Route path="/billing/client" element={<ClientBilling />} />
          <Route path="/transactions/credit-user" element={<CreditUser />} />
          <Route path="/transactions/debit-user" element={<DebitUser />} />

          {/* Banking Services */}
          <Route path="/services/virtual-card" element={<VirtualCard />} />
          <Route path="/services/quick-loan" element={<QuickLoan />} />
          <Route path="/beneficiaries/all" element={<AllBeneficiaries />} />

          {/* Chat Support */}
          <Route path="/services/support" element={<AdminSupport />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;