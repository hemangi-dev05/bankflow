import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AccountsProvider } from "./context/AccountsContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import About from "./pages/public/About";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import ResetPassword from "./pages/ResetPassword";
import OpenAccount from "./pages/account/OpenAccount";
import Dashboard from "./pages/app/Dashboard";
import Profile from "./pages/app/Profile";
import TransactionHistory from "./pages/app/TransactionHistory";
import MiniStatement from "./pages/app/MiniStatement";
import Transfer from "./pages/app/Transfer";
import Pay from "./pages/app/Pay";
import Withdraw from "./pages/app/Withdraw";
import PiggyBank from "./pages/app/PiggyBank";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AccountsProvider>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} /> 
            </Route>

            {/* Authenticated */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="open-account" element={<OpenAccount />} />
              <Route path="transactions" element={<TransactionHistory />} />
              <Route path="mini-statement" element={<MiniStatement />} />
              <Route path="transfer" element={<Transfer />} />
              <Route path="pay" element={<Pay />} />
              <Route path="withdraw" element={<Withdraw />} />
              <Route path="piggy-bank" element={<PiggyBank />} />
            </Route>

            <Route path="*" element={<Home />} />
          </Routes>
        </AccountsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}