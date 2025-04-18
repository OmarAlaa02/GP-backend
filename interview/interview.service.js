import AppError from "../utils/AppError.js";
import sequelize from "../utils/database.js";
import Question from "../question/question.model.js";
import Interview from "./interview.model.js";
import InA from "./interview-question.model.js";

import { QueryInterface } from "sequelize";

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const genAI = new GoogleGenerativeAI("AIzaSyB3POKUT70XjE3vH8cSYO4_lhICzOH-IUM");

async function generateFeedback2(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response;
}

const FLASK_API_URL = "https://ea53-34-28-248-24.ngrok-free.app/feedback";

async function generateFeedback(question, reference, answer) {
  try {
    const res = await axios.post(FLASK_API_URL, {
      question: question,
      reference: reference,
      user_answer: answer,
    });

    return res.data; // contains classification and feedback
  } catch (err) {
    console.error("Error calling Flask AI API:", err.message);
    return {
      classification: "Unknown",
      feedback: "Could not get feedback",
    };
  }
}

class InterviewService {
  async getAnswer(interviewId, qId, answer) {
    let reference = await Question.findOne({
      where: { id: qId },
    });
    const questionEntry = await Question.findOne({ where: { id: qId } });

    reference = reference.dataValues.answer || "No reference"; // Adjust field name if needed
    const question = questionEntry.dataValues.question || "No question"; // Same here

    const { feedback, classification } = await generateFeedback(
      question,
      reference,
      answer
    );
    console.log(classification);
    let score = 0;
    if (classification.toLocaleLowerCase().includes("partially correct"))
      score = 5;
    else if (classification.toLocaleLowerCase().includes("correct")) score = 10;

    const InterQuestEntry = {
      interview_id: interviewId,
      question_id: qId,
      answer: answer,
      feedback,
      score, // You can update this when your model provides scoring
    };

    await InA.create(InterQuestEntry);
  }

  async getInterviewInfo(userId, interviewId) {
    let interview = await Interview.findOne({
      where: { interview_id: interviewId, user_id: userId },
    });
    console.log(interviewId, userId);
    if (interview.score == null) {
      // let score = await this.calculateScore(userId, interviewId);
      // interview.score = score;
      // interview = await interview.save();
    }
    return interview;
  }
  //summary:
  //calculate the score of the interview
  //return interview

  async calculateScore(userId, interviewId) {
    const totalScore = await InA.sum("score", {
      where: { interview_id: interviewId },
    });

    return totalScore || 0;
  }
  async getInterviews(userId) {
    let interviews = await Interview.findAll({
      where: { user_id: userId },
    });
    const formatedInterviews = interviews.map((interview) => ({
      id: interview.interview_id,
      role: interview.role,
      score: interview.score,
      date: interview.interview_date.toISOString().split("T")[0],
    }));
    // console.log(formatedInterviews[0].date.toISOString().split("T")[0]); 
    return formatedInterviews;
  }

  async getInterviewDetails(interviewId) {
    let interviews = await InA.findAll({
      attributes: ["answer", "feedback", "score"],
      where: { interview_id: interviewId },
      include: [
        {
          model: Question,
          attributes: ["question"],
          //required: true
        },
      ],

      raw: true, // Flatten the nested result
    });
    // console.log(interviews);
    let formattedInterviews = interviews.map((entry) => ({
      question: entry["question.question"], // Access question text from join
      answer: entry.answer,
      feedback: entry.feedback,
      score: entry.score,
    }));
    let interviewInfo = await Interview.findAll({
      attributes: ["role", "interview_date", "score"],
      where: { interview_id: interviewId } // Flatten the nested result
    });
    // console.log(interviewInfo[0].dataValues);
    const {role,interview_date,score} = interviewInfo[0].dataValues;
    // console.log(formattedInterviews);
    // console.log(role);
    return {questions:formattedInterviews ,role,score,date:interview_date.toISOString().split('T')[0]};
  }
}

export default new InterviewService();
