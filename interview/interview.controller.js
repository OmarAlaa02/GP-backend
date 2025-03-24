import AsyncWrapper from "../utils/AsyncWrapper.js";
import interviewService from "./interview.service.js";

class interviewController {
    getAnswers = AsyncWrapper(async (req, res, next) => {
    const answers = await interviewService.getAnswer(req.body.interviewId,req.body.qId,req.body.answer);// get arrays of question's ids and answers
      console.log("interview Id",req.body.interviewId);
    res.status(200).json({message : "answer evaluated succefully !"});
  });
  
  getInterviewInfo = AsyncWrapper(async (req, res, next) => {
    const { interviewId } = req.params;  // Correct param retrieval
    const interview = await interviewService.getInterviewInfo(req.user.id, interviewId);
    //question?role=frontend
    res.status(200).json(interview);
  });
 
  getInterviewDetails = AsyncWrapper(async (req, res, next) => {
    const { interviewId } = req.params;  // Correct param retrieval
    const interviewDetails = await interviewService.getInterviewDetails(interviewId);
    //question?role=frontend
    res.status(200).json(interviewDetails);
  });

  getInterviews = AsyncWrapper(async (req, res, next) => {
    const interview = await interviewService.getInterviews(req.user.id);
    //question?role=frontend
    res.status(200).json(interview);
  });
}

export default new interviewController();
