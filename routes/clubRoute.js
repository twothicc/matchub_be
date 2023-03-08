import express from "express";
import {
  getClubs,
  getAppliedClubs,
  applyClub,
} from "../handlers/clubHandler.js";

const router = express.Router();

router.get("/:page", getClubs);
router.get("/applied/:page", getAppliedClubs);
router.post("/apply", applyClub);

export default router;
