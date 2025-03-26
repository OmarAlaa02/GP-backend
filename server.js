import express from "express";
import cookieParser from "cookie-parser";
import sequelize from "./utils/database.js";

import AuthRouter from "./auth/auth.routes.js";
import QuestionRouter from "./question/question.routes.js";

import errorMiddleware from "./utils/errorMiddleWare.js";

const app = express();

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

app.use(errorMiddleware);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected...");
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  })
  .catch((err) => console.log("❌ Error: " + err));
