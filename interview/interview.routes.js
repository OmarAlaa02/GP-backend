import { Router } from "express";
import interviewController from "./interview.controller.js";
import auth from "../auth/auth.controller.js";

const interviewRouter = Router();

interviewRouter.post("/answer", auth.authorize, interviewController.getAnswers);

// get details of an Interview
interviewRouter.get("/:interviewId", auth.authorize, interviewController.getInterviewDetails);

// interviewRouter.get("/interviews", auth.authorize, interviewController.getInterviews);

//interviewRouter.get("/:interviewId", auth.authorize, interviewController.getInterviewInfo);


//return all onterviews by user
interviewRouter.get("/", auth.authorize, interviewController.getInterviews);



export default interviewRouter;
