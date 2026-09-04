import Listing from "../models/Listing.js";
import Claim from "../models/Claim.js";

const BASELINE = {
  mealsRescued: 1250,
  foodProviders: 85,
  peopleHelped: 2430,
  kgSaved: 320,
  successfulClaims: 430,
};

export async function getStats(req, res, next) {
  try {
    const [providers, successfulClaims, activeListings, claimedListings, claimedAgg] = await Promise.all([
      Listing.distinct("businessName"),
      Claim.countDocuments(),
      Listing.countDocuments({ status: "available" }),
      Listing.countDocuments({ status: "claimed" }),
      Claim.aggregate([{ $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }]),
    ]);

    const rescuedNow = claimedAgg[0]?.totalQuantity || 0;
    res.json({
      mealsRescued: BASELINE.mealsRescued + rescuedNow,
      kgSaved: BASELINE.kgSaved,
      foodProviders: BASELINE.foodProviders + providers.length,
      peopleHelped: BASELINE.peopleHelped + successfulClaims,
      successfulClaims: BASELINE.successfulClaims + successfulClaims,
      activeListings,
      claimedListings,
    });
  } catch (err) { next(err); }
}

export async function getRecentDonations(req, res, next) {
  try {
    const listings = await Listing.find().sort({ postedAt: -1 }).limit(8).lean();
    res.json(listings.map((l) => ({
      id: String(l._id),
      foodName: l.foodName,
      location: l.location,
      quantity: `${l.quantityTotal} ${l.unit}`,
      status: l.status,
    })));
  } catch (err) { next(err); }
}
