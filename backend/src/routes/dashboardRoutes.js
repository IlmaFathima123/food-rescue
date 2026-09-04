import { Router } from "express";
import { getStats, getRecentDonations } from "../controllers/dashboardController.js";

const router = Router();
router.get("/stats", getStats);
router.get("/recent-donations", getRecentDonations);
export default router;
