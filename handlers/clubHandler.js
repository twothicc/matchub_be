import Club from "../models/club.js";
import UserClub from "../models/userClub.js";
import { PAGE_SIZE } from "../utils/config.js";

/**
 * getClub controller.
 *
 * Retrieves a single club record from store.
 */
export const getClub = async (req, res) => {
  const clubId = req.params.id;

  const club = await Club.findOne({
    where: {
      id: clubId,
    },
  });

  return res.status(200).json({
    msg: `get club ${clubId} details successful`,
    data: club,
  });
};

/**
 * getClubs controller.
 *
 * Retrieves a page of club records from store.
 */
export const getClubs = async (req, res) => {
  const page = req.params.page;
  const offset = PAGE_SIZE * page;

  const { count, rows } = await Club.findAndCountAll({
    attributes: [
      "id",
      ["title", "name"],
      ["contactPersonName", "organizer"],
      ["lastYearActiveMembers", "members"],
    ],
    offset: offset,
    limit: PAGE_SIZE,
  });

  return res.status(200).json({
    msg: `get club page ${page} successful`,
    data: {
      count: count,
      rows: rows,
    },
  });
};

/**
 * getAppliedClubs controller.
 *
 * Retrieves user-club relation records from store,
 * then retrieves each club record using the club_id
 * field in each relation record.
 */
export const getAppliedClubs = async (req, res) => {
  const page = req.params.page;
  const offset = PAGE_SIZE * page;
  const userId = req.query.userId;

  const { count, rows } = await UserClub.findAndCountAll({
    where: {
      user_id: userId,
    },
    offset: offset,
    limit: PAGE_SIZE,
  });

  const appliedClubs = [];

  await Promise.all(
    rows.map(async (row) => {
      const appliedClub = await Club.findByPk(row.club_id, {
        attributes: [
          "id",
          ["title", "name"],
          ["contactPersonName", "organizer"],
          ["lastYearActiveMembers", "members"],
        ],
      });

      appliedClubs.push(appliedClub);
    })
  );

  return res.status(200).json({
    msg: `get applied club page ${page} for user ${userId} successful`,
    data: {
      count: count,
      rows: appliedClubs,
    },
  });
};

/**
 * checkAppliedClubs controller.
 *
 * Checks if club is applied by the user.
 */
export const checkAppliedClub = async (req, res) => {
  const clubId = req.params.id;
  const userId = req.query.userId;

  const userClub = await UserClub.findOne({
    where: {
      user_id: userId,
      club_id: clubId,
    },
  });

  return res.status(200).json({
    msg: `check club ${clubId} application for user ${userId} successful`,
    isApplied: userClub !== null,
  });
};

/**
 * applyClubs controller.
 *
 * Creates a user-club relation record to
 * add this club under the user's applied clubs.
 */
export const applyClub = async (req, res) => {
  const userId = req.body.userId;
  const clubId = req.body.clubId;

  await UserClub.create({
    user_id: userId,
    club_id: clubId,
  });

  return res.status(200).json({
    msg: `apply club ${clubId} for user ${userId} successful`,
  });
};
