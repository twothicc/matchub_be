import { DataTypes } from "sequelize";
import { sequelize } from "../db/engine.js";

/**
 * Club schema
 */
const Club = sequelize.define("clubs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  about: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registrationFee: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  lastYearActiveMembers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contactPersonName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactPersonNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Club;
