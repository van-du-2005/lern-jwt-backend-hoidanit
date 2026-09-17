import db from "../models/index";
import {
  hashPassWord,
  isCheckEmailExist,
  isCheckPhoneExist,
} from "../utils/checkData";

const getAllUsers = async () => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "username", "email", "address", "phone", "sex"],
      include: [
        {
          model: db.Group,
          attributes: ["name", "description"],
        },
      ],
    });
    if (users) {
      return {
        EM: "Get all users successfully",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "Get all users failed",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from server",
      EC: -1,
      DT: [],
    };
  }
};

const getPaginatedUsers = async (page, limit) => {
  try {
    let data = {
      totalPage: 0,
      users: [],
    };

    if (!page || !limit) {
      return {
        EM: "Not found users",
        EC: 1,
        DT: data,
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await db.User.findAndCountAll({
      attributes: ["id", "username", "email", "address", "phone", "sex"],
      include: [
        {
          model: db.Group,
          attributes: ["name", "description", "id"],
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });

    if (count > 0 && rows) {
      const totalPage = Math.ceil(count / limit);
      data = {
        totalPage: totalPage,
        users: rows,
      };

      return {
        EM: "Get all users successfully",
        EC: 0,
        DT: data,
      };
    } else {
      return {
        EM: "No users found",
        EC: 1,
        DT: data,
      };
    }
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from server",
      EC: -1,
      DT: [],
    };
  }
};

const createNewUser = async (user) => {
  try {
    const isEmailExist = await isCheckEmailExist(user.email);
    if (isEmailExist) {
      return {
        EM: "Email is already exist",
        EC: 1,
        DT: "email",
      };
    }

    const isPhoneExist = await isCheckPhoneExist(user.phone);
    if (isPhoneExist) {
      return {
        EM: "Phone is already exist",
        EC: 1,
        DT: "phone",
      };
    }

    const hashedPassword = hashPassWord(user.password);
    const res = await db.User.create({
      email: user.email,
      password: hashedPassword,
      username: user.username,
      address: user.address,
      phone: user.phone,
      sex: user.gender,
      group_id: user.group,
    });

    return {
      EM: "User created successfully",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from server",
      EC: -1,
      DT: [],
    };
  }
};

const updateUser = async (data) => {
  try {
    
    const user = await db.User.findOne({ where: { id: data.id } });

    if (user) {
      await user.update({
        username: data.username,
        address: data.address,
        sex: data.gender,
        group_id: data.group,
      });
      return {
        EM: "User updated successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Not found user",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "Something wrongs in services",
      EC: -1,
      DT: [],
    };
  }
};

const deleteUser = async (userId) => {
  try {
    if (!userId) {
      return {
        EM: "not found user",
        EC: 1,
        DT: [],
      };
    }

    let user = await db.User.findOne({ where: { id: userId } });
    if (user) {
      await user.destroy();
      return {
        EM: "delete users successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "not found user",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from server",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getPaginatedUsers,
};
