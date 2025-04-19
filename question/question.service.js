import AppError from "../utils/AppError.js";
import sequelize from "../utils/database.js";
import Question from "./question.model.js";
import Interview from "../interview/interview.model.js";

class QuestionService {
  async getQuestions(userId, role, duration) {
    const questionsByDifficulty = {};

    const limit = this.questionDuration(duration);

    let interview = await Interview.create({
      user_id: userId,
      role: role,
      duration: duration,
      score:0
    });

    const questions = await this.getRandomQuestions(role, limit);

    return { interviewId: interview.interview_id, questions };
  }

  questionDuration(duration) {
    return duration === "quick" ? 1 : duration === "full" ? 2 : 1;
  }
  async getRandomQuestions(role, limitPerDifficulty) {
    const difficulties = ["Easy", "Medium", "Hard"];
    let generalQuestions = [],
      roleQuestions = [];
    const generalQuestionsByDifficulty = {};
    const roleQuestionsByDifficulty = {};
    //6 9 
    for (const difficulty of difficulties) {
      const questions = await Question.findAll({
        where: { category: ["General Programming" , "Data Structures"], difficulty: difficulty },
        order: sequelize.literal("RAND()"), // Randomize results
        limit: 3,
      });
      
      generalQuestionsByDifficulty[difficulty] = questions;
    }
    for (const difficulty of difficulties) {
      const questions = await Question.findAll({
        where: { category: role, difficulty: difficulty },
        order: sequelize.literal("RAND()"), // Randomize results
        limit: limitPerDifficulty,
      });
      roleQuestionsByDifficulty[difficulty] = questions;
    }
    // const finalQuestions = {
    //   general: generalQuestionsByDifficulty,
    //   role: roleQuestionsByDifficulty,
    // };
    const finalQuestions = [];
    for (let difficulty of difficulties) {
      const general = generalQuestionsByDifficulty[difficulty];
      finalQuestions.push(general);
    }
    for (let difficulty of difficulties) {
      const role = roleQuestionsByDifficulty[difficulty];
      finalQuestions.push(role);
    }

    return finalQuestions;
  }
  // summary:
  // params: role ,duration
  // returns based on the selected duration array of general questions + role questions
}

export default new QuestionService();
