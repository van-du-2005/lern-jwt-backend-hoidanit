import userApiService from "../service/userApiService";

const readFunc = async (req, res, next) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    if (page && limit) {
      const users = await userApiService.getPaginatedUsers(+page, +limit);
      return res.status(200).json({
        EM: users.EM,
        EC: users.EC,
        DT: users.DT,
      });
    } else {
      const users = await userApiService.getPaginatedUsers(page, limit);
      return res.status(200).json({
        EM: users.EM,
        EC: users.EC,
        DT: users.DT,
      });
    }
  } catch (error) {
    console.log(">>> check error: ", error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const createFunc = async (req, res) => {
  try {
    // validate

    let data = await userApiService.createNewUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(">>> check error: ", error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const updateFunc = async (req, res) => {
  try {
    const user = req.body;
    console.log(">>> check user controller: ", user);
    if (user.group === -1) {
      return res.status(200).json({
        EM: "not found group",
        EC: 1,
        DT: "group",
      });
    }

    let data = await userApiService.updateUser(user);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(">>> check error: ", error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const deleteFunc = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(200).json({
        EM: "Not found user id",
        EC: "-1",
        DT: [],
      });
    }

    let data = await userApiService.deleteUser(userId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(">>> check error: ", error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getUserAccount = async (req, res) => {
  return res.status(200).json({
    EM: "ok",
    EC: 0,
    DT: {
      accessToken: req.token,
      username: req.userDecoded.username,
      email: req.userDecoded.email,
      groupWithRoles: req.userDecoded.groupWithRoles,
    },
  });
};

module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
  getUserAccount,
};
