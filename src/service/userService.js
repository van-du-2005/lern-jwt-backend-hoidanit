import pool from "../configs/configDatabase";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const hashPassWord = (userPass) => {
  const hashPass = bcrypt.hashSync(userPass, salt);

  return hashPass;
};

const createNewUser = async (email, password, username) => {
  const hashPass = hashPassWord(password);

  const [results, fields] = await pool.execute(
    ` insert into users (email, password, username)
    values (?, ?, ?)`,
    [email, hashPass, username],
  );
};

const getAllUser = async () => {
  const [results, fields] = await pool.execute(`select * from users`);

  return results;
};

module.exports = {
  createNewUser,
  getAllUser,
};
