import sequelize from "./database.js";  // ✅ Import sequelize instance

import User from "../user/user.model.js";
import Interview from "../interview/interview.model.js";
import Question from "../question/question.model.js";
import InA from "../interview/interview-question.model.js";


sequelize.sync({ alter: false, force: false });
// One User has Many Interviews
User.hasMany(Interview, { foreignKey: "user_id" });  // ✅ user_id should be the FK
Interview.belongsTo(User, { foreignKey: "user_id" });  // ✅ user_id should be the FK

InA.belongsTo(Question, { foreignKey: "question_id" });
Question.hasMany(InA, { foreignKey: "question_id" });   

// Many-to-Many Relationship Between Interviews & Questions
Interview.belongsToMany(Question, { through: InA, foreignKey: "interview_id" });
Question.belongsToMany(Interview, { through: InA, foreignKey: "question_id" });



export default function setupAssociations() {
    console.log("✅ Associations Set Up!");
}
