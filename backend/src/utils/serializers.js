export function serializeListing(doc) {
  const l = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(l._id),
    donorId: l.donorId ? String(l.donorId) : null,
    businessName: l.businessName,
    foodName: l.foodName,
    category: l.category,
    quantityTotal: l.quantityTotal,
    quantityAvailable: l.quantityAvailable,
    unit: l.unit,
    location: l.location,
    pickupDeadline: l.pickupDeadline,
    price: l.price,
    discountLabel: l.discountLabel ?? null,
    description: l.description || "",
    status: l.status,
    postedAt: l.postedAt,
  };
}

export function serializeClaim(doc) {
  const c = doc.toObject ? doc.toObject() : doc;
  return {
    id: c.reservationId,
    listingId: String(c.listingId),
    quantity: c.quantity,
    name: c.name,
    phone: c.phone,
    claimedAt: c.claimedAt,
    listingSnapshot: c.listingSnapshot,
  };
}
