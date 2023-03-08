import Club from "../models/club.js";
import UserClub from "../models/userClub.js";

const pageSize = 5;

export const getClubs = async (req, res) => {
  const page = req.params.page;
  const offset = pageSize * page;

  const clubs = await Club.findAll({ offset: offset, limit: pageSize })
    .then(() => {
      console.log(`successfully retrieved club page ${page}`);
    })
    .catch((err) => {
      return res.status(500).json({
        msg: `get club page ${page} unsuccessful`,
        err: err,
      });
    });

  return res.status(200).json({
    msg: `get club page ${page} successful`,
    data: clubs,
  });
};

export const getAppliedClubs = async (req, res) => {
  const page = req.params.page;
  const offset = pageSize * page;
  const userId = req.query.userId;

  const userClubRelations = await UserClub.findAll({
    where: {
      user_id: userId,
      offset: offset,
      limit: pageSize,
    },
  })
    .then(() => {
      console.log(
        `successfully retrieved applied club page ${page} for user ${userId}`
      );
    })
    .catch((err) => {
      return res.status(500).json({
        msg: `get applied club page ${page} for user ${userId} unsuccessful`,
        err: err,
      });
    });

  const appliedClubs = [];

  await Promise.all(
    userClubRelations.map(async (userClubRelation) => {
      const appliedClub = await Club.findByPk(userClubRelation.club_id).catch(
        (err) => {
          return res.status(500).json({
            msg: `get applied club page ${page} for user ${userId} unsuccessful`,
            err: err,
          });
        }
      );

      appliedClubs.push(appliedClub);
    })
  );

  return res.status(200).json({
    msg: `get applied club page ${page} for user ${userId} successful`,
    data: appliedClubs,
  });
};

export const applyClub = async (req, res) => {
  const userId = req.body.userId;
  const clubId = req.body.clubId;

  await UserClub.create({
    user_id: userId,
    club_id: clubId,
  }).catch((err) => {
    return res.status(500).json({
      msg: `apply club ${clubId} for user ${userId} unsuccessful`,
      err: err,
    });
  });

  return res
    .status(200)
    .send(`apply club ${clubId} for user ${userId} successful`);
};
