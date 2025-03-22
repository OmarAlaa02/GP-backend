import AsyncWrapper from "../utils/AsyncWrapper.js";
import questionService from "./question.service.js";

class QuestionController {
  getQuestions = AsyncWrapper(async (req, res, next) => {
    const questions = await questionService.getQuestions(req.query.role);
    //question?role=frontend
    res.status(200).json(questions);
  });
}

export default new QuestionController();
