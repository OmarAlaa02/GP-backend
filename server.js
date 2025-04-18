import express from "express";
import cookieParser from "cookie-parser";
// import cors from 'cors';

import sequelize from "./utils/database.js";
import setupAssociations from "./utils/associations.js";

import AuthRouter from "./auth/auth.routes.js";
import QuestionRouter from "./question/question.routes.js";
import InterviewRouter from "./interview/interview.routes.js";
import userRouter from "./user/user.routes.js";

import errorMiddleware from "./utils/errorMiddleWare.js";
import homeDataMiddleware from "./utils/homeDataMiddleWare.js";
import auth from "./auth/auth.controller.js";


const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000", // Change to your frontend URL
//     credentials: true, // Allows cookies to be sent
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );


app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/auth", AuthRouter);
app.use("/question", QuestionRouter);
app.use("/interview", InterviewRouter);
app.use("/user", userRouter);
app.use("/home",auth.authorize,homeDataMiddleware);

app.use(errorMiddleware);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected...");
    setupAssociations();
    app.listen(8080, () => {
      console.log("listening on port 8080");
    });
  })
  .catch((err) => console.log("❌ Error: " + err));
