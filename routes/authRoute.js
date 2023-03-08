import express from "express";
import { login, logout, signup } from "../handlers/authHandler.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", auth, logout);

export default router;
