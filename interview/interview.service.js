import AppError from "../utils/AppError.js";
import sequelize from "../utils/database.js";
import Question from "../question/question.model.js";
import Interview from "./interview.model.js";
import QnA from "./interview-question.model.js";
import { QueryInterface } from "sequelize";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyB3POKUT70XjE3vH8cSYO4_lhICzOH-IUM");

async function generateFeedback(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response;
}

class InterviewService {
    async getAnswer(interviewId,qId,answer)
    {
        let reference = await Question.findOne({
            where:{id: qId}
        })
        const prompt = `Write a feedback to evaluate this answer: ${answer} given reference answer: ${reference}`;
        const feedback =await generateFeedback(prompt);

        
       //create for every answer Interview-question row
            //interview_id,question_id
            let InterQuestEntry={
                interview_id: interviewId,
                question_id: qId,
                answer: answer,
                feedback: feedback,
                score: 0,      
                
            }
             QnA.create(InterQuestEntry);

        
  

    }

    
 
  
}

export default new InterviewService();