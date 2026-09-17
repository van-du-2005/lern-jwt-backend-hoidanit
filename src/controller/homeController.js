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

  return res.redirect("/");
};

const handlerDeleteUser = async (req, res) => {
  const userId = req.params.id;
  await userService.deleteUserById(userId);
  return res.redirect("/");
};

const handlerUpdateUserPage = async (req, res) => {
  const userId = req.params.id;
  const user = await userService.getUserById(userId);

  return res.render("update-user.ejs", { user });
};

const handlerUpdateUserById = async (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const username = req.body.username;

  await userService.updateUserById(id, email, username);
  return res.redirect("/");
};

module.exports = {
  handlerUserPage,
  handlerCreateUser,
  handlerDeleteUser,
  handlerUpdateUserPage,
  handlerUpdateUserById,
};
