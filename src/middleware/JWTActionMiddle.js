require("dotenv").config();
import jwt from "jsonwebtoken";

const nonSecurePaths = ["/logout", "/", "/user/login", "/user"];

const createJWT = (payload) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  console.log(">>> JWT_EXPIRES_IN: ", JWT_EXPIRES_IN);

  let token = null;

  try {
    token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.log(error);
  }
  return token;
};

const verifyToken = (token) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

//  lấy  token từ brearer save  trong authorization header
const extractToken = (req) => {
  const tokenRaw = req.headers.authorization;

  if (tokenRaw && tokenRaw.startsWith("Bearer ")) {
    const token = tokenRaw.split(" ")[1];
    return token;
  }
  return null;
};

// get url không có số ở cuối
const getURLNotNumber = (url) => {
  let result = url;
  // lấy ra array url không có "/"
  const urlPartsArr = result.split("/");

  // bỏ phần từ đầu nếu là ""
  if (urlPartsArr[0] === "") {
    urlPartsArr.shift();
  }

  // bỏ phần tử cuối nếu là số
  const indexEnd = urlPartsArr.length - 1; 
  const elementEnd = urlPartsArr[indexEnd]; 
  // nếu là số và >= 0 thì bỏ số đó ra khỏi mảng và ghép lại thành url hoàn chỉnh.
  if (!isNaN(+elementEnd) && +elementEnd >= 0) {
    urlPartsArr.pop();
    result = "/" + urlPartsArr.join("/");
  }

  // trả về kết quả url không có số ở cuối
  return result;
};

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();

  const jwt =
    req.cookies && req.cookies.JWT ? req.cookies.JWT : extractToken(req);

  if (jwt) {
    const decoded = verifyToken(jwt);

    if (decoded) {
      req.userDecoded = decoded;
      req.token = jwt;
      return next();
    } else {
      return res.status(401).json({
        DT: "",
        EC: -1,
        EM: "Invalid token, please login again..",
      });
    }
  } else {
    return res.status(401).json({
      DT: "",
      EC: -1,
      EM: "Authentication token missing, please login again..",
    });
  }
};

const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/account")
    return next();
  const email = req.userDecoded.email;
  const roles = req.userDecoded.groupWithRoles?.[0]?.Roles || [];
  const urlAccess = getURLNotNumber(req.path);

  if (roles && roles.length > 0) {
    let canAccess = false;
    canAccess = roles.some((role) => role.url === urlAccess);
    if (canAccess) {
      next();
    } else {
      console.log(">>> not found permission");
      return res.status(403).json({
        DT: "",
        EC: -1,
        EM: "You not have permission to access this resource.",
      });
    }
  } else {
    console.log(">>> empty roles");
    return res.status(401).json({
      DT: "",
      EC: -1,
      EM: "You not have  permission to access this resource.",
    });
  }
};

module.exports = { createJWT, verifyToken, checkUserJWT, checkUserPermission };
