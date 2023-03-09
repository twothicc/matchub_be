import { Deferrable, DataTypes } from "sequelize";
import { sequelize } from "../db/engine.js";
import Club from "./club.js";
import User from "./user.js";

const UserClub = sequelize.define("userClubs", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE,
    },
  },
  club_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Club,
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE,
    },
  },
});

export default UserClub;
