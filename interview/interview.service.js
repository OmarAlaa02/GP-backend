import AppError from "../utils/AppError.js";
import sequelize from "../utils/database.js";
import Question from "../question/question.model.js";
import Interview from "./interview.model.js";
import InA from "./interview-question.model.js";
import { calculateQuestionScore, calculateInterviewScore } from "./interview-utils.js";
import { QueryInterface } from "sequelize";

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";


async function generateFeedback2(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response;
}

const FLASK_API_URL = "https://3187-34-44-99-255.ngrok-free.app/feedback";

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
    const questionDiffculty = questionEntry.dataValues.difficulty;
  
    reference = reference.dataValues.answer || "No reference"; // Adjust field name if needed
    const question = questionEntry.dataValues.question || "No question"; // Same here

    const { feedback, classification:correctness } = await generateFeedback(
        question,
        reference,
        answer
    );
    const questionScore = calculateQuestionScore(questionDiffculty,correctness)
    console.log(feedback,correctness);

    const InterQuestEntry = {
      interview_id: interviewId,
      question_id: qId,
      answer: answer,
      feedback,
      score: questionScore, // You can update this when your model provides scoring
    };

    await InA.create(InterQuestEntry);
  }

 

  
  async getInterviews(userId) {
    let interviews = await Interview.findAll({
      where: { user_id: userId },
    });
    for (const interview of interviews) {
        if (interview.dataValues.score === 0 || interview.dataValues.score === null) {
          
          let questionsInfo = await this.getQuestionInfo(interview.dataValues.interview_id)
          console.log("questionsInfo",questionsInfo)
          const questionDetails = questionsInfo.map(q => ({
            question_id: q.question_id,
            difficulty: q['question.difficulty'],  // because it's nested under the Question model
            score: q.score,
          }));
          const newScore = await calculateInterviewScore(questionDetails); 
            console.log(newScore)
          await Interview.update(
            { score: newScore },
            { where: { interview_id: interview.interview_id } }
          );
    
          // Optionally update it in memory too, to reflect in the return value
          interview.score = newScore;
        }
      }

    const formatedInterviews = interviews.map((interview) => ({
      id: interview.interview_id,
      role: interview.role,
      score: interview.score,
      date: interview.interview_date.toISOString().split("T")[0],
    }));
    // console.log(formatedInterviews[0].date.toISOString().split("T")[0]); 
    return formatedInterviews;
  }

  async getQuestionInfo(interviewId) {
    console.log("here is getQuestionInfo")
    let questions = await InA.findAll({
        attributes: ["question_id","answer", "feedback", "score"],
        where: { interview_id: interviewId },
        include: [
          {
            model: Question,
            attributes: ["question", "difficulty"],            //required: true
          },
        ],
        order: [["createdAt", "ASC"]],
        raw: true, // Flatten the nested result
      });
    return questions;
  }
 

  async getInterviewDetails(interviewId) {
    
    let questionDetails = await this.getQuestionInfo(interviewId) //questionId | question | answer | feedback | questionScore | questionDifficulty
    console.log(questionDetails);
    
  
     
    let formattedInterviews = questionDetails.map((entry) => ({
      question: entry["question.question"], // Access question text from join
      answer: entry.answer,
      feedback: entry.feedback,
      score: entry.score,
    }));
    
    let interviewInfo = await Interview.findOne({
      attributes: ["role", "interview_date", "score"],
      where: { interview_id: interviewId } // Flatten the nested result
    });

    if (interviewInfo.score === 0 || interviewInfo.score === null) {
        // 👇 Call your own logic to calculate the score
        let questionsInfo = await this.getQuestionInfo(interviewId)
        const questionDetails = questionsInfo.map(q => ({
            question_id: q.question_id,
            difficulty: q['question.difficulty'],  // because it's nested under the Question model
            score: q.score,
          }));
        const newScore = await calculateInterviewScore(questionDetails); 
  
        await Interview.update(
          { score: newScore },
          { where: { interview_id: interviewId } }
        );
  
        // Optionally update it in memory too, to reflect in the return value
        interviewInfo.score = newScore;
      }
    // console.log(interviewInfo[0].dataValues);
    const {role,interview_date,score} = interviewInfo;
    // console.log(role);
    return {questions:formattedInterviews ,role,score,date:interview_date.toISOString().split('T')[0]};
  }
}

export default new InterviewService();
