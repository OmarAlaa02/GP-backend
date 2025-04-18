import interviewsModel from "../interview/interview.model.js";
async function homeDataMiddleWare(req, res) {
  //first, last name
  //interviews entered
  //cvs generated

  const interviewsCount = await interviewsModel.count({
    where: {
      user_id: req.user.id,
    },
  });
  console.log(req.user);
  const homeData = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    interviewsCount,
  };

  res.status(200).json(homeData);
}

export default homeDataMiddleWare;
