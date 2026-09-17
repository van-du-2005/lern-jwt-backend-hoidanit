import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

const hashPassWord = (userPass) => {
  const hashPass = bcrypt.hashSync(userPass, salt);

  return hashPass;
};

const isCheckEmailExist = async (userEmail) => {
  // find email in db
  const user = await db.User.findOne({ where: { email: userEmail } });

  if (user) {
    return true;
  }
  return false;
};

const isCheckPhoneExist = async (userPhone) => {
  // find phone in db
  const user = await db.User.findOne({ where: { phone: userPhone } });

  if (user) {
    return true;
  }
  return false;
};

module.exports = {
  hashPassWord,
  isCheckEmailExist,
  isCheckPhoneExist,
};
