import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FindFood from "./pages/FindFood";
import DonateFood from "./pages/DonateFood";
import ClaimFood from "./pages/ClaimFood";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyDonations from "./pages/MyDonations";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<FindFood />} />
          <Route path="/donate" element={<DonateFood />} />
          <Route path="/claim/:id" element={<ClaimFood />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-donations" element={<MyDonations />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-5 py-24 text-center">
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="mt-2 text-ink-soft">That page doesn't exist.</p>
    </div>
  );
}
