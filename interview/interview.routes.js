import { Router } from "express";
import interviewController from "./interview.controller.js";
import auth from "../auth/auth.controller.js";

const interviewRouter = Router();

interviewRouter.post("/", auth.authorize, interviewController.getAnswers);

export default interviewRouter;
