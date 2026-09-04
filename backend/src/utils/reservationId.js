export function makeReservationId() {
  const time = Date.now().toString().slice(-8);
  const random = Math.floor(10 + Math.random() * 90);
  return `FR-${time}${random}`;
}
