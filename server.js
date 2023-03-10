import express from "express";
import session from "express-session";
import mySqlSession from "express-mysql-session";
import bodyParser from "body-parser";
import cors from "cors";

import AuthRoutes from "./routes/authRoute.js";
import ClubRoutes from "./routes/clubRoute.js";
import DevRoutes from "./routes/devRoute.js";

import User from "./models/user.js";
import Club from "./models/club.js";
import UserClub from "./models/userClub.js";

import {
  FRONTEND,
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_PORT,
  DB_NAME,
  SESSION_KEY,
  SESSION_SECRET,
  HOUR,
} from "./utils/config.js";

const app = express();

// CORS setup
const corsOptions = {
  origin: [FRONTEND],
  methods: ["GET", "PUT", "POST", "DELETE"],
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(cors(corsOptions));

// Add parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add and setup session store middleware
const MySQLStore = mySqlSession(session);

const sessionStoreOption = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  createDatabaseTable: true,
};

const sessionStore = new MySQLStore(sessionStoreOption);

app.use(
  session({
    key: SESSION_KEY,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      maxAge: HOUR * 2,
    },
  })
);

app.use("/dev", DevRoutes);
app.use("/clubs", ClubRoutes);
app.use("/auth", AuthRoutes);

/**
 * Synchronize the DB with schema.
 *
 * CREATE TABLE IF NOT EXISTS essentially.
 * CREATE, REFERENCE, ALTER permissions must be
 * granted to the DB user
 */
await User.sync().catch((err) =>
  console.error("failed to sync User table", err)
);
await Club.sync().catch((err) =>
  console.error("failed to sync Club table", err)
);
await UserClub.sync().catch((err) =>
  console.error("failed to sync UserClub table", err)
);

app.listen(PORT, () => {
  "server up and running at " + PORT;
});
