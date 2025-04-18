import AsyncWrapper from "../utils/AsyncWrapper.js";
import userService from "./user.service.js";

class UserController {
  getUserData = AsyncWrapper(async (req, res) => {
    // console.log("user id ", req.user);
    // const user = await userService.getUserData(req.user.id);
    res.status(200).json(req.user);
  });
}

export default new UserController();
