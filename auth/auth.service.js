import { z } from "zod";
import AppError from "../utils/AppError.js";
import User from "../user/user.model.js";
import validateInput from "../utils/validateInput.js";

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
      await User.create(validatedUser);
    } catch (error) {
      console.log(error);
    }

    return validatedUser;
  }
}

export default new AuthService();
