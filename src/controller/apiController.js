import loginRegisterService from "../service/loginRegisterService";

const addNewUser = async (req, res) => {
  try {
    // validate data email, phone, password,  confirmPassword, username,
    if (!req.body.email || !req.body.phone || !req.body.password) {
      console.log(">>>> check req.body:", req.body);
      return res.status(200).json({
        EM: "missing required parameters (email, phone, password,  confirmPassword, username)",
        EC: "1",
        DT: "",
      });
    }

    if (req.body.password && req.body.password.length < 4) {
      return res.status(200).json({
        EM: "Password must have least 3 letters",
      });
    }
    // gọi service add user.
    let data = await loginRegisterService.createNewUser(req.body);

    // trả về kết quả
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
    });
  } catch (e) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const handlerUserLogin = async (req, res) => {
  try {
    let result = await loginRegisterService.checkLogin(req.body);
    res.cookie("JWT", result.DT.JWT, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });
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

const handlerUserLogout = (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).json({
    EM: "Successfully logged out",
    EC: 0,
    DT: "",
  });
};

module.exports = {
  addNewUser,
  handlerUserLogin,
  handlerUserLogout,
};
