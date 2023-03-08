import express from "express";
import { initDB } from "../handlers/devHandler.js";

const router = express.Router();

router.get("/init_db", initDB);

export default router;
