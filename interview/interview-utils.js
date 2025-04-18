function calculateQuestionScore(difficulty,correctness=1)
{
    const questionWeight =  {
        easy: 1,
        medium: 2,
        hard: 3
      };
      const questionCorrectness =  {
        "correct": 1,
        "partially correct": 0.5,
        "incorrect": 0
      };
    const weight = questionWeight[difficulty.toLowerCase()] || 0;
    correctness = questionCorrectness[correctness.toLowerCase()] || 0;
    return weight * correctness;
}
function calculateInterviewScore(questionInfo) {
    const difficultyWeights = {
      Easy: 1,
      Medium: 2,
      Hard: 3,
    };
   //questionId | question | answer | feedback | questionScore | questionDifficulty

    // console.log("question Difficultty",questionInfo)
    // Use two separate accumulators for possible and actual scores
    const { possibleScore, actualScore } = questionInfo.reduce(
      (acc, q) => {
        // Add difficulty weight to the possibleScore
        acc.possibleScore += difficultyWeights[q.difficulty] || 0;
        // Add the actual score to actualScore
        acc.actualScore += q.score || 0;
        console.log(acc)
        return acc;
      },
      { possibleScore: 0, actualScore: 0 }
    );
    // Avoid division by zero
    if (possibleScore === 0) return 0; 
  
    // Return the calculated percentage score
    return (actualScore / possibleScore) * 100;
  } 
  export { calculateQuestionScore, calculateInterviewScore };