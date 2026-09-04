import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "../lib/api";

const FoodContext = createContext(null);

export function FoodProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.fetchListings();
      setListings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshListings();
  }, [refreshListings]);

  const addListing = useCallback(
    async (input) => {
      const listing = await api.createListing(input);
      await refreshListings();
      return listing;
    },
    [refreshListings]
  );

  const updateListing = useCallback(
    async (id, input) => {
      const listing = await api.updateListing(id, input);
      await refreshListings();
      return listing;
    },
    [refreshListings]
  );

  const deleteListing = useCallback(
    async (id) => {
      const result = await api.deleteListing(id);
      await refreshListings();
      return result;
    },
    [refreshListings]
  );

  const claimListing = useCallback(
    async (listingId, payload) => {
      const claim = await api.claimListing(listingId, payload);
      await refreshListings();
      return claim;
    },
    [refreshListings]
  );

  const value = {
    listings,
    loading,
    refreshListings,
    addListing,
    updateListing,
    deleteListing,
    claimListing,
    getListingById: (id) => listings.find((l) => l.id === id),
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

export function useFood() {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error("useFood must be used inside a FoodProvider");
  return ctx;
}
