import db from "../models/index";

const createNewRoles = async (roles) => {
  try {
    if (!roles || roles.length === 0) {
      return {
        EM: "nothing role to create",
        EC: 1,
        DT: [],
      };
    }

    const roleInDB = await db.Role.findAll({
      attributes: ["url"],
      raw: true,
    });

    let result = roles.filter((role) => {
      return !roleInDB.some((role2) => {
        return role2.url === role.url;
      });
    });

    const resultLength = result?.length || 0;

    if (+resultLength === 0) {
      return {
        EM: "nothing role to create",
        EC: 1,
        DT: [],
      };
    }

    await db.Role.bulkCreate(result);
    return {
      EM: `created ${resultLength} new roles `,
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from service",
      EC: -1,
      DT: [],
    };
  }
};

const getAllRoles = async () => {
  try {
    const roles = await db.Role.findAll({
      attributes: ["id", "url", "description"],
      order: [["id", "DESC"]],
    });
    if (roles && roles.length > 0) {
      return {
        EM: "Get all roles sucessfully",
        EC: 0,
        DT: roles,
      };
    }
    return {
      EM: "not found any roles",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from service",
      EC: -1,
      DT: [],
    };
  }
};

const getRoleByGroupId = async (groupId) => {
  try {
    if (!groupId || +groupId < 0) {
      return {
        EM: "error from service: groupId is required",
        EC: 1,
        DT: [],
      };
    }

    const roleRaws = await db.Group.findAll({
      where: { id: groupId },
      include: {
        model: db.Role,
        attributes: ["id", "url", "description"],
        through: { attributes: [] },
      },
      raw: true,
      nest: true,
    });

    if (!roleRaws || roleRaws.length === 0) {
      return {
        EM: "not find any roles for this groupId",
        EC: 1,
        DT: [],
      };
    }
    const roles = roleRaws.map((item) => item.Roles);

    return {
      EM: "Get roles by groupId successfully",
      EC: 0,
      DT: roles,
    };
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from service",
      EC: -1,
      DT: [],
    };
  }
};

const deleteRole = async (roleId) => {
  try {
    if (!roleId) {
      return {
        EM: "Role id required",
        EC: 1,
        DT: [],
      };
    }

    const role = await db.Role.findOne({
      where: { id: roleId },
    });

    if (!role) {
      return {
        EM: "Role not found",
        EC: 1,
        DT: [],
      };
    }

    await db.Role.destroy({
      where: { id: roleId },
    });

    return {
      EM: "Delete role successfully",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from service",
      EC: -1,
      DT: [],
    };
  }
};

const assignRoleToGroup = async (data) => {
  try {
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

    await db.Group_Role.destroy({
      where: { group_Id: +data.groupId },
    });

    const dataToCreate = data.roles.map((item) => {
      return {
        group_id: +data.groupId,
        role_id: +item.roleId,
      };
    });

    await db.Group_Role.bulkCreate(dataToCreate);
    return {
      EM: "Assign role to group successfully",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "error from service",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = {
  createNewRoles,
  getAllRoles,
  deleteRole,
  getRoleByGroupId,
  assignRoleToGroup,
};
