import AsyncWrapper from "../utils/AsyncWrapper.js";
import questionService from "./question.service.js";

class QuestionController {
  getQuestions = AsyncWrapper(async (req, res, next) => {
    const { interviewId, questions } = await questionService.getQuestions(
      req.user.id,
      req.query.role,
      req.query.duration
    );
    //question?role=frontend
    console.log(req.query.role);
    res.status(200).json({
      interviewId,
      questions 
    });
  });
}

export default new QuestionController();
