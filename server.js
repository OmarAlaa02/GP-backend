import express from "express";
import cookieParser from "cookie-parser";
import sequelize from "./utils/database.js";

import setupAssociations from "./utils/associations.js";
import AuthRouter from "./auth/auth.routes.js";
import QuestionRouter from "./question/question.routes.js";
import InterviewRouter from "./interview/interview.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", AuthRouter);
app.use("/question", QuestionRouter);
app.use("/interview", InterviewRouter);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected...");
    setupAssociations();
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  })
  .catch((err) => console.log("❌ Error: " + err));