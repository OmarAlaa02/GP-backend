import { z } from "zod";
import AppError from "../utils/AppError.js";
import User from "../user/user.model.js";
import Question from "../question/question.model.js";
import validateInput from "../utils/validateInput.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AuthService {
  async signUp(data) {
    const userSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email("Invalid email format"),
      password: z.string(),
    });

    const validatedUser = validateInput(userSchema, data);
    // console.log("validateuser", validatedUser);

    const sameEmail = await User.findOne({
      where: { email: validatedUser.email },
    });

    if (sameEmail) {
      throw new AppError("this email is already registered", 400);
    }

    try {
      validatedUser.password = await bcrypt.hash(validatedUser.password, 12);
      const newUser = await User.create(validatedUser);
    } catch (error) {
      console.log(error);
    }

    return validatedUser;
  }

  async login(data, res) {
    const userSchema = z.object({
      email: z.string().email("Invalid email format"),
      password: z.string(),
    });
    const validatedUser = validateInput(userSchema, data);

    let user = await User.findOne({
      where: { email: validatedUser.email },
    });

    if (!user) throw new AppError("Wrong email or password", 400);

    const isPasswordCorrect = await bcrypt.compare(
      validatedUser.password,
      user.password
    );
    if (!isPasswordCorrect) throw new AppError("Invalid password", 400);

    const token = jwt.sign(
      { id: user.id, firstName: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 10 * 60 * 60 * 1000, // 10 hours
    });

    return user;
  }

  async authorize(req) {
    const token = req.cookies.token;
    // console.log("token ", token);
    if (!token) throw new AppError("User is not logged in", 401);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: decodedToken.id },
      attributes: ["id", "firstName", "lastName", "email"],
    });
    // console.log(user);
    if (!user) throw new AppError("User not found", 404);
    // console.log("auth user: ", user);
    return user.dataValues;
  }
}

export default new AuthService();
