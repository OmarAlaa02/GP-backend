import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js"; // Import your database connection

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// ✅ Sync the table with the database
const createTable = async () => {
  try {
    await sequelize.sync({ alter: true }); // Creates or updates the table structure
    console.log("✅ User table created/updated successfully!");
  } catch (error) {
    console.error("❌ Error creating table:", error);
  }
};

createTable(); // Call the function to create the table

export default User;
