import express from "express";
import cookieParser from "cookie-parser";
import sequelize from "./utils/database.js";

import AuthRouter from "./auth/auth.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", AuthRouter);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected...");
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  })
  .catch((err) => console.log("❌ Error: " + err));
