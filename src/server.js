require("dotenv").config();

import express from "express";
import cookieParser from "cookie-parser";

import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
import configBodyParse from "./configs/configBodyParse";
import CORS from "./configs/configCores";
import initAPIRoutes from "./routes/api";
import { createJWT, verifyToken } from "./middleware/JWTActionMiddle";

// import testConnect from "./configs/configConnectSeque";

const app = express();

// config cors
CORS(app);

// config View Engine
configViewEngine(app);

// config body-parser
configBodyParse(app);

// config cookie-parser
app.use(cookieParser());

// test connect database by sequelize
// testConnect();

// config routes
initWebRoutes(app);
initAPIRoutes(app);

app.use((req, res) => {
  return res.send("404 not found backend");
});

const PORT = process.env.PORT || 8000;
const hostName = process.env.HOST_NAME || "localhost";

app.listen(PORT, () => {
  console.log(`Server is running on port http://${hostName}:${PORT}`);
});
