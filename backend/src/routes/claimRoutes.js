import { Router } from "express";
import { createClaim, getClaimByReservationId } from "../controllers/claimController.js";

const router = Router();
router.post("/listings/:id/claim", createClaim);
router.get("/claims/:reservationId", getClaimByReservationId);
export default router;
