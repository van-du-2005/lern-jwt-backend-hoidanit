import express from "express";
const router = express.Router();

import homeController from "../controller/homeController";

const initWebRoutes = (app) => {
  router.get("/", homeController.handlerUserPage);
  router.post("/user/create-user", homeController.handlerCreateUser);

  return app.use("/", router);
};

export default initWebRoutes;
