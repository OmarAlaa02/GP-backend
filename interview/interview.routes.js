import { Router } from "express";
import interviewController from "./interview.controller.js";
import auth from "../auth/auth.controller.js";

const interviewRouter = Router();

interviewRouter.post("/answer", auth.authorize, interviewController.getAnswers);

interviewRouter.get("/:interviewId/details", auth.authorize, interviewController.getInterviewDetails);

//interviewRouter.get("/:interviewId", auth.authorize, interviewController.getInterviewInfo);



interviewRouter.get("/", auth.authorize, interviewController.getInterviews);



export default interviewRouter;
