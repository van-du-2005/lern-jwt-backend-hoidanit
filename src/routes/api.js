import express from "express";
const router = express.Router();

import apiController from "../controller/apiController";
import userController from "../controller/userController";
import groupController from "../controller/groupController";
import roleController from "../controller/roleController";

import {
  checkUserJWT,
  checkUserPermission,
} from "../middleware/JWTActionMiddle";

// const  checkUser = (req, res, next) =>  {
//   const nonSecurePaths = ['/', '/about', '/contact'];
//   if (nonSecurePaths.includes(req.path)) return next();

//   //authenticate user
//   next();
// }

const initAPIRoutes = (app) => {
  // rest api

  router.all("*", checkUserJWT, checkUserPermission);
  router.post("/user", apiController.addNewUser);
  router.post("/user/login", apiController.handlerUserLogin);
  router.post("/logout", apiController.handlerUserLogout);

  // user
  router.get("/user/read", userController.readFunc);
  router.post("/user/create", userController.createFunc);
  router.put("/user/update", userController.updateFunc);
  router.delete("/user/delete", userController.deleteFunc);
  router.get("/account", userController.getUserAccount);

  // group
  router.get("/group/read", groupController.readFunc);

  // role
  router.get("/role/read", roleController.readFunc);
  router.get("/role/by-group-id/:groupId", roleController.readByGroupIFunc);
  router.post("/role/create", roleController.createFunc);
  router.post("/role/assign-role-to-group", roleController.assignRoleToGroupFunc);
  router.put("/role/update", roleController.updateFunc);
  router.delete("/role/delete", roleController.deleteFunc);

  //

  return app.use("/api/v1", router);
};

export default initAPIRoutes;
