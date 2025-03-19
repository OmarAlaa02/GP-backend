import AsyncWrapper from "../utils/AsyncWrapper.js";
import authService from "./auth.service.js";

class AuthController {
  signup = AsyncWrapper(async (req, res) => {
    const newUser = await authService.signUp(req.body);
    res.status(201).json({ data: newUser });
  });
}

export default new AuthController();
