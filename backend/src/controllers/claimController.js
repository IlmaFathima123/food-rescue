import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import Claim from "../models/Claim.js";
import { validationError } from "../middleware/errorHandler.js";
import { serializeClaim, serializeListing } from "../utils/serializers.js";
import { makeReservationId } from "../utils/reservationId.js";

function validateClaim(input) {
  const errors = {};
  if (!input.name?.trim()) errors.name = "Please enter your name.";
  if (!input.phone?.trim()) errors.phone = "Please enter a contact phone number.";
  else if (!/^[0-9+\-\s]{7,15}$/.test(input.phone.trim())) errors.phone = "Please enter a valid phone number.";
  const qty = Number(input.quantity);
  if (!qty || qty <= 0 || !Number.isInteger(qty)) errors.quantity = "Choose at least 1 whole unit.";
  return errors;
}

export async function createClaim(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const errors = validateClaim(req.body);
    if (Object.keys(errors).length) throw validationError(errors);
    const qty = Number(req.body.quantity);
    let createdClaim;

    await session.withTransaction(async () => {
      const listing = await Listing.findOneAndUpdate(
        { _id: req.params.id, quantityAvailable: { $gte: qty }, status: "available" },
        { $inc: { quantityAvailable: -qty } },
        { new: true, session }
      );

      if (!listing) {
        const existing = await Listing.findById(req.params.id).session(session);
        if (!existing) {
          const err = new Error("Listing not found"); err.status = 404; throw err;
        }
        throw validationError({ quantity: `Only ${existing.quantityAvailable} ${existing.unit} left.` });
      }

      if (listing.quantityAvailable === 0) {
        listing.status = "claimed";
        await listing.save({ session });
      }

      const snapshot = serializeListing(listing);
      const [claim] = await Claim.create([{
        reservationId: makeReservationId(),
        listingId: listing._id,
        quantity: qty,
        name: req.body.name.trim(),
        phone: req.body.phone.trim(),
        listingSnapshot: snapshot,
      }], { session });
      createdClaim = claim;
    });

    res.status(201).json(serializeClaim(createdClaim));
  } catch (err) { next(err); }
  finally { await session.endSession(); }
}

export async function getClaimByReservationId(req, res, next) {
  try {
    const claim = await Claim.findOne({ reservationId: req.params.reservationId });
    if (!claim) return res.status(404).json({ message: "Reservation not found" });
    res.json(serializeClaim(claim));
  } catch (err) { next(err); }
}
