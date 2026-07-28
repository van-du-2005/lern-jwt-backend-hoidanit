import userService from "../service/userService";

const handlerUserPage = async (req, res) => {
  const users = await userService.getAllUser();
  return res.render("create-user.ejs", { users });
};

const handlerCreateUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  await userService.createNewUser(email, password, username);

  return res.send("test success");
};

module.exports = {
  handlerUserPage,
  handlerCreateUser,
};
