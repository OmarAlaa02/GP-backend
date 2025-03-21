import AsyncWrapper from "../utils/AsyncWrapper.js";
import authService from "./auth.service.js";

class AuthController {
  signup = AsyncWrapper(async (req, res) => {
    const newUser = await authService.signUp(req.body);
    res.status(201).json({ data: newUser });
  });
  
  login = AsyncWrapper(async (req, res) => {
    const user = await authService.login(req.body, res);
    res.status(200).json({ data: user });
});

authorize = AsyncWrapper(async (req, res, next) => {
  const user = await authService.authorize(req);
  req.user = user;
  next();
});
}

export default new AuthController();
