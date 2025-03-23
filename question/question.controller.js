import AsyncWrapper from "../utils/AsyncWrapper.js";
import questionService from "./question.service.js";

class QuestionController {
  getQuestions = AsyncWrapper(async (req, res, next) => {
    const interview = await questionService.getQuestions(req.user.id,req.query.role , req.query.duration);
    //question?role=frontend
    res.status(200).json({questions : interview.questions , interviewId : interview.interviewId});
  });
}

export default new QuestionController();
