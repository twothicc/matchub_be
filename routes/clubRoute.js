import express from "express";
import {
  getClub,
  getClubs,
  getAppliedClubs,
  checkAppliedClub,
  applyClub,
} from "../handlers/clubHandler.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/details/:id", getClub);
router.get("/:page", getClubs);
router.get("/applied/:page", auth, getAppliedClubs);
router.get("/status/:id", auth, checkAppliedClub);
router.post("/apply/:id", auth, applyClub);

export default router;
