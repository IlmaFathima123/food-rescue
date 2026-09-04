import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    reservationId: { type: String, unique: true, required: true, index: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    claimedAt: { type: Date, default: Date.now },
    listingSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { versionKey: false }
);

export default mongoose.model("Claim", claimSchema);
