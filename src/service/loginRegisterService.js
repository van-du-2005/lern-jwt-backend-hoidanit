import bcrypt from "bcryptjs";
import db from "../models/index";
import { Op } from "sequelize";

import {
  hashPassWord,
  isCheckEmailExist,
  isCheckPhoneExist,
} from "../utils/checkData";

import { getGroupRoles } from "./JWTService";
import { createJWT } from "../middleware/JWTActionMiddle";

const createNewUser = async (userData) => {
  try {
    // check email exist
    const checkEmail = await isCheckEmailExist(userData.email);
    if (checkEmail) {
      return {
        EM: "Email is already in use",
        EC: 1,
      };
    }

    // check phone exist
    const checkPhone = await isCheckPhoneExist(userData.phone);
    if (checkPhone) {
      return {
        EM: "Phone number is already in use",
        EC: 1,
      };
    }

    // hash password
    const hashPass = hashPassWord(userData.password);

    // add user (email, phone, password,  confirmPassword, username,) to db
    await db.User.create({
      email: userData.email,
      phone: userData.phone,
      password: hashPass,
      username: userData.username,
      group_id: 4,
    });

    //  return
    return {
      EM: "Create new user successfully",
      EC: "0",
    };
  } catch (e) {
    return {
      EM: "error from server",
      EC: "-1",
    };
  }
};

const checkPassword = (userPassword, hashPassword) => {
  return bcrypt.compareSync(userPassword, hashPassword);
};

const checkLogin = async (rawData) => {
  try {
    let user = await db.User.findAll({
      where: {
        [Op.or]: [{ email: rawData.valueLogin }, { phone: rawData.valueLogin }],
      },
      raw: true,
    });

    let groupRoles = await getGroupRoles(user[0].group_id);

    if (user && user.length > 0) {
      const payload = {
        email: user[0].email,
        groupWithRoles: groupRoles.DT,
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        username: user[0].username,
      };

      const checkPass = checkPassword(rawData.password, user[0].password);
      if (checkPass) {
        const JWT = createJWT(payload);
        if (JWT) {
          return {
            EM: "Login successfully",
            EC: "0",
            DT: {
              JWT: JWT,
              groupRole: groupRoles.DT,
              email: user[0].email,
              username: user[0].username,
            },
          };
        } else {
          return {
            EM: "Login failed, please try again",
            EC: "-1",
            DT: {},
          };
        }
      }
      console.log(">>> not found password: ", rawData.password);
    }
    console.log(">>> not found user with email/phone: ", rawData.valueLogin);
    return {
      EM: "email/phone number or password is incorrect",
      EC: "1",
    };
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from server",
      EC: "-1",
    };
  }
};

module.exports = {
  createNewUser,
  checkLogin,
};
