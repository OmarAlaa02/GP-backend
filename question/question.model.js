import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js"; // Import your database connection

//Question Number,Question,Answer,Category,Difficulty,
const Question = sequelize.define(
  "questions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Disable createdAt & updatedA1
    updatedAt: false,
  }
);


export default Question;
