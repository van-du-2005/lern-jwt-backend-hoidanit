import pool from "../configs/configDatabase";
import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

const hashPassWord = (userPass) => {
  const hashPass = bcrypt.hashSync(userPass, salt);

  return hashPass;
};

const createNewUser = async (email, password, username) => {
  const hashPass = hashPassWord(password);
  await db.User.create({
    email: email,
    password: hashPass,
    username: username,
  });
};

const getAllUser = async () => {
  let user1 = await db.User.findOne({
    where: { id: 1 },
    include: { model: db.Group, attributes: ["name", "description"] },
    raw: true,
    nest: true,
  });

  let r = await db.Role.findAll({
    include: {
      model: db.Group,
      where: { id: 1 },
      attributes: ["name", "description"],
    },
    raw: true,
  });

  const users = await db.User.findAll({});
  console.log(">>> check user1: ", user1);
  console.log(">>> check r: ", r);

  return users;
};

const deleteUserById = async (userId) => {
  await db.User.destroy({
    where: {
      id: userId,
    },
  });
};

const getUserById = async (userId) => {
  let user = {};
  const data = await db.User.findOne({ where: { id: userId } });

  if (data !== null) {
    user = data.toJSON();
  }

  return user;
};

const updateUserById = async (id, email, username) => {
  await db.User.update(
    { email: email, username: username },
    {
      where: {
        id: id,
      },
    },
  );

  const [results, fields] = await pool.execute(
    `UPDATE User
    SET email = ?, username = ?
    WHERE id = ?;`,
    [email, username, id],
  );

  console.log(">>> check results: ", results);
};

module.exports = {
  createNewUser,
  getAllUser,
  deleteUserById,
  getUserById,
  updateUserById,
};
