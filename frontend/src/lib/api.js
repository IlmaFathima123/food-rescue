// ---------------------------------------------------------------------------
// Real API layer connecting frontend to backend + MongoDB Atlas
// ---------------------------------------------------------------------------

const BASE_URL = ""; // Relative path, routed through Vite proxy to http://localhost:5000

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "API request failed");
    if (data.errors) {
      error.fieldErrors = data.errors;
    }
    throw error;
  }

  return data;
}

/** GET /api/listings */
export async function fetchListings() {
  return request("/api/listings");
}

/** GET /api/listings/:id */
export async function fetchListingById(id) {
  return request(`/api/listings/${id}`);
}

/** POST /api/listings */
export async function createListing(input) {
  const errors = validateListing(input);
  if (Object.keys(errors).length > 0) {
    const error = new Error("Validation failed");
    error.fieldErrors = errors;
    throw error;
  }
  return request("/api/listings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** PUT /api/listings/:id */
export async function updateListing(id, input) {
  return request(`/api/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

/** DELETE /api/listings/:id */
export async function deleteListing(id) {
  return request(`/api/listings/${id}`, {
    method: "DELETE",
  });
}

/** GET /api/listings/donor/:donorId */
export async function fetchDonationsByDonor(donorId, businessName) {
  const query = businessName ? `?businessName=${encodeURIComponent(businessName)}` : "";
  return request(`/api/listings/donor/${donorId}${query}`);
}

/** POST /api/listings/:id/claim */
export async function claimListing(listingId, { quantity, name, phone, userId }) {
  const errors = {};
  if (!name?.trim()) errors.name = "Please enter your name.";
  if (!phone?.trim()) errors.phone = "Please enter a contact phone number.";
  else if (!/^[0-9+\-\s]{7,15}$/.test(phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }
  const qty = Number(quantity);
  if (!qty || qty <= 0) errors.quantity = "Choose at least 1.";
  if (Object.keys(errors).length > 0) {
    const error = new Error("Validation failed");
    error.fieldErrors = errors;
    throw error;
  }

  return request(`/api/listings/${listingId}/claim`, {
    method: "POST",
    body: JSON.stringify({ quantity: qty, name, phone, userId }),
  });
}

/** GET /api/claims/:reservationId */
export async function fetchClaimById(reservationId) {
  return request(`/api/claims/${reservationId}`);
}

/** GET /api/dashboard/stats */
export async function fetchDashboardStats() {
  return request("/api/dashboard/stats");
}

/** GET /api/dashboard/recent-donations */
export async function fetchRecentDonations() {
  return request("/api/dashboard/recent-donations");
}

/** POST /api/auth/login */
export async function loginUser(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/** POST /api/auth/register */
export async function registerUser(userData) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/** Field-level validation, mirrors backend validation */
export function validateListing(input) {
  const errors = {};
  if (!input.businessName?.trim()) errors.businessName = "Please enter your business name.";
  if (!input.foodName?.trim()) errors.foodName = "Please enter the food name.";
  if (!input.category) errors.category = "Please choose a food category.";
  if (!input.quantity || Number(input.quantity) <= 0) {
    errors.quantity = "Quantity must be greater than 0.";
  }
  if (!input.location?.trim()) errors.location = "Please enter a pickup location.";
  if (!input.pickupDeadline?.trim()) errors.pickupDeadline = "Please set a pickup deadline.";
  if (input.price === "discounted" && !input.discountLabel?.trim()) {
    errors.discountLabel = 'Add a discount label, e.g. "50% OFF".';
  }
  return errors;
}
