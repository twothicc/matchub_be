import dotenv from "dotenv";

dotenv.config();

export const PORT = parseInt(process.env.PORT);
export const HOUR = parseInt(process.env.HOUR);
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT);
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_NAME = process.env.DB_NAME;
export const FRONTEND = process.env.FRONTEND;
export const SESSION_KEY = process.env.SESSION_KEY;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const PAGE_SIZE = parseInt(process.env.PAGE_SIZE);
