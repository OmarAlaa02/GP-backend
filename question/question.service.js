import AppError from "../utils/AppError.js";
import Question from "./question.model.js";

class QuestionService {
  async getQuestions(role) {
    let questions = await Question.findAll({ where: { category: role } });
    console.log(questions);
    return questions;
  }
}

export default new QuestionService();
