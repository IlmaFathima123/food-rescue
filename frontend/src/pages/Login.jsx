import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full border bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { login, register, currentUser } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("donor"); // "donor" | "claimer"
  const [businessName, setBusinessName] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, show status or let them go to their destination
  if (currentUser) {
    const defaultDestination = currentUser.role === "donor" ? "/my-donations" : "/find";
    return (
      <div className="max-w-md mx-auto px-5 py-16 text-center">
        <div className="ticket p-8">
          <p className="text-4xl" aria-hidden="true">👋</p>
          <h1 className="mt-3 font-display text-2xl">Already Signed In</h1>
          <p className="mt-2 text-sm text-ink-soft">
            You are logged in as <span className="font-semibold text-ink">{currentUser.name}</span>
            {currentUser.businessName ? ` (${currentUser.businessName})` : ""}.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => navigate(redirect || defaultDestination)}
              className="w-full py-2.5 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
            >
              Continue to {redirect ? "your request" : currentUser.role === "donor" ? "My Donations" : "Find Food"} →
            </button>
            <Link
              to="/"
              className="w-full py-2.5 text-sm font-semibold border border-ink/20 hover:border-ink/40 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        const user = await login(email, password);
        const fallback = user.role === "donor" ? "/my-donations" : "/find";
        navigate(redirect || fallback);
      } else {
        const user = await register({
          name,
          email,
          password,
          role,
          businessName,
          phone,
        });
        const fallback = user.role === "donor" ? "/my-donations" : "/find";
        navigate(redirect || fallback);
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 sm:px-6 py-12">
      {/* Informational callout if redirected from a protected action */}
      {redirect && (
        <div className="mb-6 p-4 bg-turmeric-light border border-turmeric/40 text-sm">
          <p className="font-semibold text-ink flex items-center gap-1.5">
            <span aria-hidden="true">🔒</span> Sign in required
          </p>
          <p className="mt-1 text-ink-soft">
            {redirect.startsWith("/claim")
              ? "Please log in or create an account to claim food. This helps keep reservations reliable."
              : redirect.startsWith("/donate")
              ? "Please log in to post surplus food donations."
              : redirect.startsWith("/my-donations")
              ? "Please log in to view and manage your donations."
              : "Please sign in to proceed with your request."}
          </p>
        </div>
      )}

      <div className="ticket p-6 sm:p-8">
        {/* Tab switch */}
        <div className="flex border-b border-ink/10 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              mode === "login"
                ? "border-leaf text-leaf-deep"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              mode === "register"
                ? "border-leaf text-leaf-deep"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            Create Account
          </button>
        </div>

        <h1 className="font-display text-2xl">
          {mode === "login" ? "Welcome back" : "Join FoodRescue LK"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {mode === "login"
            ? "Sign in to claim food or manage food donations."
            : "Register as a food donor or community claimer."}
        </p>

        {error && (
          <div className="mt-4 p-3 bg-clay-light border border-clay/30 text-xs text-clay-deep font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2 border text-xs cursor-pointer ${
                      role === "donor"
                        ? "border-leaf bg-leaf-light/40 font-semibold text-leaf-deep"
                        : "border-ink/15 hover:bg-ink/5"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="donor"
                      checked={role === "donor"}
                      onChange={() => setRole("donor")}
                      className="accent-leaf"
                    />
                    Food Donor
                  </label>
                  <label
                    className={`flex items-center gap-2 p-2 border text-xs cursor-pointer ${
                      role === "claimer"
                        ? "border-leaf bg-leaf-light/40 font-semibold text-leaf-deep"
                        : "border-ink/15 hover:bg-ink/5"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="claimer"
                      checked={role === "claimer"}
                      onChange={() => setRole("claimer")}
                      className="accent-leaf"
                    />
                    Food Claimer
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass + " border-ink/15"}
                  placeholder="e.g. Kasun Fernando"
                />
              </div>

              {role === "donor" && (
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Business / Organization Name <span className="text-clay-deep">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={inputClass + " border-ink/15"}
                    placeholder="e.g. Tasty Bakes, Green Park Hotel"
                  />
                  <p className="mt-1 text-[11px] text-ink-soft">
                    This will appear on the food donation listings you publish.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass + " border-ink/15"}
                  placeholder="07X XXX XXXX"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass + " border-ink/15"}
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass + " border-ink/15"}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors disabled:opacity-60"
          >
            {submitting
              ? "Please wait…"
              : mode === "login"
              ? "Sign In"
              : "Create Account & Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
