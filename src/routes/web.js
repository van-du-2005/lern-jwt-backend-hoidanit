import express from "express";
const router = express.Router();

import homeController from "../controller/homeController";
import apiController from "../controller/apiController"

const initWebRoutes = (app) => {
  router.get("/", homeController.handlerUserPage);
  router.post("/user/create-user", homeController.handlerCreateUser);
  router.post("/user/delete-user/:id", homeController.handlerDeleteUser);
  router.get("/user/update-user/:id", homeController.handlerUpdateUserPage);
  router.post("/user/update-user", homeController.handlerUpdateUserById);

  // rest api

  return app.use("/", router);
};

export default initWebRoutes;
