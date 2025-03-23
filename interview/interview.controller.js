import AsyncWrapper from "../utils/AsyncWrapper.js";
import interviewService from "./interview.service.js";

class interviewController {
    getAnswers = AsyncWrapper(async (req, res, next) => {
    const answers = await interviewService.getAnswer(req.body.interviewId,req.body.qId,req.body.answer);// get arrays of question's ids and answers
      console.log("interview Id",req.body.interviewId);
    res.status(200).json({message : "answer evaluated succefully !"});
  });
}

export default new interviewController();
