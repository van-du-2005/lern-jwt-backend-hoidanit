import db from "../models/index";

const getAllGroups = async () => {
  try {
    const groups = await db.Group.findAll({ order: [["name", "ASC"]] });
    if (groups) {
      return {
        EM: "Get all groups successfully",
        EC: 0,
        DT: groups,
      };
    } else {
      return {
        EM: "Get all groups failed",
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

module.exports = { getAllGroups };
