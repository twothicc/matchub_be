import Club from "../models/club.js";
import UserClub from "../models/userClub.js";

const pageSize = 5;

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

export const getClubs = async (req, res) => {
  const page = req.params.page;
  const offset = pageSize * page;

  const { count, rows } = await Club.findAndCountAll({
    attributes: [
      "id",
      ["title", "name"],
      ["contactPersonName", "organizer"],
      ["lastYearActiveMembers", "members"],
    ],
    offset: offset,
    limit: pageSize,
  });

  return res.status(200).json({
    msg: `get club page ${page} successful`,
    data: {
      count: count,
      rows: rows,
    },
  });
};

export const getAppliedClubs = async (req, res) => {
  const page = req.params.page;
  const offset = pageSize * page;
  const userId = req.query.userId;

  const { count, rows } = await UserClub.findAndCountAll({
    where: {
      user_id: userId,
    },
    offset: offset,
    limit: pageSize,
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
