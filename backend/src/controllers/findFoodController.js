import Listing from "../models/Listing.js";
import { serializeListing } from "../utils/serializers.js";

export async function getListings(req, res, next) {
  try {
    const { search, location, category, price, status } = req.query;
    const query = {};
    if (location) query.location = location;
    if (category) query.category = category;
    if (price) query.price = price;
    if (status) query.status = status;
    if (search?.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(escaped, "i");
      query.$or = [{ foodName: rx }, { businessName: rx }];
    }

    const listings = await Listing.find(query).sort({ postedAt: -1 });
    res.json(listings.map(serializeListing));
  } catch (err) { next(err); }
}

export async function getListingById(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(serializeListing(listing));
  } catch (err) { next(err); }
}
