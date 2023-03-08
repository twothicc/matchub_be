import { DummyClubListings } from "../data/clubListings.js";
import Club from "../models/club.js";

export const initDB = async (req, res) => {
  await Club.sync()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error("failed to sync Club", err);
    });

  for (let i = 0; i < DummyClubListings.length; i++) {
    await Club.create(DummyClubListings.at(i))
      .then((res) => {
        console.log("Club record " + res.id + " created");
      })
      .catch((err) => {
        console.error("failed to insert Club record", err);
      });
  }

  return res.status(200).send("dummy data initialized");
};
