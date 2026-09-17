import db from "../models/index";

const getGroupRoles = async (GroupId) => {
  if (!GroupId) {
    return {
      EM: "GroupId is required",
      EC: 1,
      DT: {},
    };
  }
  try {
    let rawData = await db.Group.findAll({
      where: { id: GroupId },
      attributes: ["id", "name", "description"],
      include: {
        model: db.Role,
        attributes: ["id", "url", "description"],
        through: { attributes: [] },
      },
      raw: true,
      nest: true,
    });

    if (rawData && rawData.length > 0) {
      let groupRoles = Object.values(
        rawData.reduce((acc, row) => {
          if (!acc[row.id]) {
            acc[row.id] = {
              id: row.id,
              name: row.name,
              description: row.description,
              Roles: [],
            };
          }

          if (row.Roles && row.Roles.id) {
            acc[row.id].Roles.push(row.Roles);
          }
          return acc;
        }, {}),
      );
      return {
        EM: "get group roles successfully",
        EC: 0,
        DT: groupRoles,
      };
    } else {
      return {
        EM: "Group not found",
        EC: 1,
        DT: {},
      };
    }
  } catch (error) {
    console.log(">>> check error: ", error);
    return {
      EM: "Something wrongs in service",
      EC: -1,
      DT: {},
    };
  }
};

module.exports = { getGroupRoles };
