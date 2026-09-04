import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function linkClass({ isActive }) {
  return `text-sm font-medium transition-colors ${
    isActive ? "text-leaf-deep font-semibold" : "text-ink-soft hover:text-ink"
  }`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg" onClick={() => setOpen(false)}>
          <span aria-hidden="true">🍚</span>
          FoodRescue <span className="text-leaf-deep">LK</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/find" className={linkClass}>
            Find food
          </NavLink>
          <NavLink to="/donate" className={linkClass}>
            Donate food
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-donations" className={linkClass}>
              My Donations
            </NavLink>
          )}
          <NavLink to="/dashboard" className={linkClass}>
            Impact
          </NavLink>
        </nav>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-semibold text-ink leading-tight">
                  {currentUser.businessName || currentUser.name}
                </p>
                <span className="text-[10px] text-ink-soft uppercase tracking-wider">
                  {currentUser.role === "donor" ? "Donor" : "Claimer"}
                </span>
              </div>

              <NavLink
                to="/donate"
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
              >
                + Donate
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-medium border border-ink/20 text-ink-soft hover:text-clay-deep hover:border-clay/40 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-1.5 text-xs font-semibold text-ink border border-ink/20 hover:border-ink/40 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/donate"
                className="inline-flex items-center px-4 py-1.5 text-xs font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
              >
                Donate food
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="md:hidden p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <nav className="md:hidden border-t border-ink/10 px-5 py-4 flex flex-col gap-3 bg-paper">
          {isAuthenticated && (
            <div className="pb-3 border-b border-ink/10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">
                  {currentUser.businessName || currentUser.name}
                </p>
                <span className="text-xs text-ink-soft">
                  Logged in as {currentUser.role === "donor" ? "Food Donor" : "Food Claimer"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-clay-deep font-semibold underline"
              >
                Sign out
              </button>
            </div>
          )}

          <NavLink to="/find" className={linkClass} onClick={() => setOpen(false)}>
            Find food
          </NavLink>
          <NavLink to="/donate" className={linkClass} onClick={() => setOpen(false)}>
            Donate food
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-donations" className={linkClass} onClick={() => setOpen(false)}>
              My Donations
            </NavLink>
          )}
          <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
            Impact
          </NavLink>

          <div className="pt-2 border-t border-ink/10">
            {isAuthenticated ? (
              <NavLink
                to="/donate"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors block"
              >
                + Post food donation
              </NavLink>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-ink border border-ink/20 hover:border-ink/40 transition-colors block"
              >
                Sign in / Register
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
