require("dotenv").config();

import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";

const app = express();

configViewEngine(app);
initWebRoutes(app);

const PORT = process.env.PORT || 8000;
const hostName = process.env.HOST_NAME || "localhost";

app.listen(PORT, () => {
  console.log(`Server is running on port http://${hostName}:${PORT}`);
});
