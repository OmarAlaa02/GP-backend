import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import Interview from "./interview.model.js";
import Question from "../question/question.model.js";

const InterviewQuestion = sequelize.define(
  "InterviewQuestion",
  {
    interview_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Interview,
        key: "id",
      },
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Question,
        key: "id",
      },
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    score: {
      //question score
      type: DataTypes.INTEGER, //0: wring answer , 1: partially correct ,2: correct
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default InterviewQuestion;
