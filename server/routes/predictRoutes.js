import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { predictDisease, getSymptoms } from "../controllers/predictController.js";

const router = express.Router();

router.post("/predict", verifyToken, predictDisease);
router.get("/symptoms", getSymptoms);

export default router;
