import userApiService from "../service/userApiService";
import roleApiService from "../service/roleApiService";

const readFunc1 = async (req, res) => {
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

const readByGroupIFunc = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    if (!groupId || +groupId < 0) {
      return res.status(200).json({
        EM: "GroupId is required",
        EC: "1",
        DT: [],
      });
    }

    const roles = await roleApiService.getRoleByGroupId(groupId);
    return res.status(200).json({
      EM: roles.EM,
      EC: roles.EC,
      DT: roles.DT,
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

const readFunc = async (req, res) => {
  try {
    const users = await roleApiService.getAllRoles();
    return res.status(200).json({
      EM: users.EM,
      EC: users.EC,
      DT: users.DT,
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

const createFunc = async (req, res) => {
  try {
    // validate

    let data = await roleApiService.createNewRoles(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });

    // return res.status(200).json({
    //   EM: "",
    //   EC: -1,
    //   DT: "",
    // });
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
    const userId = req.body.roleId;
    if (!userId) {
      return res.status(200).json({
        EM: "Not found user id",
        EC: "-1",
        DT: [],
      });
    }

    let data = await roleApiService.deleteRole(userId);
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

const assignRoleToGroupFunc = async (req, res) => {
  try {
    // data = {groupId: "", roles: []}
    const data = req.body;
    if (!data || !data.groupId) {
      return res.status(200).json({
        EM: "groupId is required",
        EC: 1,
        DT: "",
      });
    }

    if (!data || data.length === 0) {
      return res.status(200).json({
        EM: "not role to assign",
        EC: 1,
        DT: "",
      });
    }

    const result = await roleApiService.assignRoleToGroup(data);
    return res.status(200).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
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

module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
  readByGroupIFunc,
  assignRoleToGroupFunc,
};
