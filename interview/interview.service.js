import AppError from "../utils/AppError.js";
import sequelize from "../utils/database.js";
import Question from "../question/question.model.js";
import Interview from "./interview.model.js";
import InA from "./interview-question.model.js";

import { QueryInterface } from "sequelize";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyB3POKUT70XjE3vH8cSYO4_lhICzOH-IUM");

async function generateFeedback(prompt) {
    // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // const result = await model.generateContent(prompt);
    // const response = result.response;
    return "response";
}

class InterviewService {
    async getAnswer(interviewId,qId,answer)
    {
        let reference = await Question.findOne({
            where:{id: qId}
        })
        const prompt = `Write a feedback to evaluate this answer: ${answer} given reference answer: ${reference}`;
        const aiFeedback =await generateFeedback(prompt);

        // let feedback = aiFeedback.answer
        // let score = aiFeedback.score
        
        let score=0//to be deleted
       //create for every answer Interview-question row
            //interview_id,question_id
            let InterQuestEntry={
                interview_id: interviewId,
                question_id: qId,
                answer: answer,
                feedback: "feedback",
                score: score,      
                
            }
             InA.create(InterQuestEntry);

    }
  
   async getInterviewInfo(userId,interviewId)
   {
    let interview = await Interview.findOne({ where: {interview_id:interviewId , user_id:userId } });
    console.log(interviewId,userId)
    if(interview.score==null)
    {   
        let score=await this.calculateScore(userId,interviewId)
        interview.score = score;
        interview =  await interview.save();
    }
    return interview
   }
   //summary: 
   //calculate the score of the interview 
   //return interview
    
 
   async calculateScore(userId,interviewId) {
    const totalScore = await InA.sum("score", {
        where: { interview_id: interviewId }
    });

    return totalScore || 0;     
}
async getInterviews(userId)
{
 let interviews =await Interview.findAll({
    where:{user_id:userId}
 })
 return interviews
}

async getInterviewDetails(interviewId)
{

let interviews = await InA.findAll({
    attributes: [ "answer", "feedback", "score"],
    where: { interview_id: interviewId },
    include: [{
        model: Question,
        attributes: ["question"],
        //required: true
       }],
    
       raw: true, // Flatten the nested result
    });
    
    
    let formattedInterviews = interviews.map((entry) => ({
        interviewId: entry.interview_id,
        question: entry["Question.text"], // Access question text from join
        answer: entry.answer,
        feedback: entry.feedback,
        score: entry.score,
    }));

return interviews
 
 
}

}

export default new InterviewService();