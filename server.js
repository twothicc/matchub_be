import express from "express";
import session from "express-session";
import mySqlSession from "express-mysql-session";
import bodyParser from "body-parser";

import AuthRoutes from "./routes/authRoute.js";
import ClubRoutes from "./routes/clubRoute.js";
import DevRoutes from "./routes/devRoute.js";

import User from "./models/user.js";
import Club from "./models/club.js";
import UserClub from "./models/userClub.js";

const MySQLStore = mySqlSession(session);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sessionStoreOption = {
  host: "localhost",
  post: 3306,
  user: "test",
  password: "test1234.",
  database: "matchub",
  createDatabaseTable: true,
};

const sessionStore = new MySQLStore(sessionStoreOption);

const hour = 3600000;

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      maxAge: hour * 2,
    },
  })
);

app.use("/dev", DevRoutes);
app.use("/clubs", ClubRoutes);
app.use("/auth", AuthRoutes);

await User.sync().catch((err) =>
  console.error("failed to sync User table", err)
);
await Club.sync().catch((err) =>
  console.error("failed to sync Club table", err)
);
await UserClub.sync().catch((err) =>
  console.error("failed to sync UserClub table", err)
);

const PORT = 5000;

app.listen(PORT, () => {
  "server up and running at " + PORT;
});
