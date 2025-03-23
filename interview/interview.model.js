import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js"; // Import your database connection
import User from "../user/user.model.js";  // ✅ Import User model
import { text } from "express";

const Interview = sequelize.define("Interview", {
    interview_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    interview_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    role: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    duration: {
        type: DataTypes.ENUM("Quick" , "Full"),
        allowNull: false,
    },
    score: {//interview score
        type: DataTypes.INTEGER, 
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: "interviews"
});



export default Interview;
